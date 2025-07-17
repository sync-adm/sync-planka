const _ = require('lodash');
const { isDueDate, isStopwatch } = require('../../../utils/validators');
const { idInput } = require('../../../utils/inputs');

const Errors = {
  NOT_ENOUGH_RIGHTS: {
    notEnoughRights: 'Not enough rights',
  },
  LIST_NOT_FOUND: {
    listNotFound: 'List not found',
  },
  POSITION_MUST_BE_PRESENT: {
    positionMustBePresent: 'Position must be present',
  },
  VEHICLE_IMAGES_REQUIRED: {
    vehicleImagesRequired: 'Vehicle images are required',
  },
  INVALID_VEHICLE_IMAGES: {
    invalidVehicleImages: 'Vehicle images must be an array of URLs',
  },
};

module.exports = {
  inputs: {
    listId: {
      ...idInput,
      required: true,
    },
    type: {
      type: 'string',
      isIn: Object.values(Card.Types),
      required: true,
    },
    position: {
      type: 'number',
      min: 0,
      allowNull: true,
    },
    name: {
      type: 'string',
      maxLength: 1024,
      required: true,
    },
    description: {
      type: 'string',
      isNotEmptyString: true,
      maxLength: 1048576,
      allowNull: true,
    },
    dueDate: {
      type: 'string',
      custom: isDueDate,
    },
    stopwatch: {
      type: 'json',
      custom: isStopwatch,
    },
    vehicleImages: {
      type: 'json',
      required: true,
    },
  },

  exits: {
    notEnoughRights: {
      responseType: 'forbidden',
    },
    listNotFound: {
      responseType: 'notFound',
    },
    positionMustBePresent: {
      responseType: 'unprocessableEntity',
    },
    vehicleImagesRequired: {
      responseType: 'unprocessableEntity',
    },
    invalidVehicleImages: {
      responseType: 'unprocessableEntity',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    if (!inputs.vehicleImages || !Array.isArray(inputs.vehicleImages)) {
      throw Errors.INVALID_VEHICLE_IMAGES;
    }

    if (inputs.vehicleImages.length === 0) {
      throw Errors.VEHICLE_IMAGES_REQUIRED;
    }

    const imageUrls = inputs.vehicleImages.slice(0, 3);

    const urlRegex = /^https?:\/\/.+/;
    const validUrls = imageUrls.filter((url) => typeof url === 'string' && urlRegex.test(url));

    if (validUrls.length === 0) {
      throw Errors.INVALID_VEHICLE_IMAGES;
    }

    const { list, board, project } = await sails.helpers.lists
      .getPathToProjectById(inputs.listId)
      .intercept('pathNotFound', () => Errors.LIST_NOT_FOUND);

    const boardMembership = await BoardMembership.qm.getOneByBoardIdAndUserId(
      board.id,
      currentUser.id,
    );

    if (!boardMembership) {
      throw Errors.LIST_NOT_FOUND;
    }

    if (boardMembership.role !== BoardMembership.Roles.EDITOR) {
      throw Errors.NOT_ENOUGH_RIGHTS;
    }

    const values = _.pick(inputs, [
      'type',
      'position',
      'name',
      'description',
      'dueDate',
      'stopwatch',
    ]);

    const card = await sails.helpers.cards.createOne
      .with({
        project,
        values: {
          ...values,
          board,
          list,
          creatorUser: currentUser,
        },
        request: this.req,
      })
      .intercept('positionMustBeInValues', () => Errors.POSITION_MUST_BE_PRESENT);

    const attachments = [];
    const downloadPromises = validUrls.map(async (imageUrl, index) => {
      try {
        const filename = `veiculo-imagem-${index + 1}.jpg`;

        const imageData = await sails.helpers.attachments.downloadAndProcessImage.with({
          imageUrl,
          filename,
        });

        const attachment = await sails.helpers.attachments.createOne.with({
          project,
          board,
          list,
          values: {
            type: Attachment.Types.FILE,
            name: filename,
            data: imageData,
            card,
            creatorUser: currentUser,
          },
          request: this.req,
        });

        return attachment;
      } catch (error) {
        sails.log.warn(`Erro ao baixar imagem ${imageUrl}:`, error.message);
        return null;
      }
    });

    const downloadedAttachments = await Promise.all(downloadPromises);

    downloadedAttachments.forEach((attachment) => {
      if (attachment) {
        attachments.push(attachment);
      }
    });

    return {
      item: card,
      included: {
        attachments: attachments.map((attachment) =>
          sails.helpers.attachments.presentOne(attachment),
        ),
      },
    };
  },
};
