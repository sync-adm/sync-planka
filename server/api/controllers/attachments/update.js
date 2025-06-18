const { idInput } = require('../../../utils/inputs');

const Errors = {
  NOT_ENOUGH_RIGHTS: {
    notEnoughRights: 'Not enough rights',
  },
  ATTACHMENT_NOT_FOUND: {
    attachmentNotFound: 'Attachment not found',
  },
};

module.exports = {
  inputs: {
    id: {
      ...idInput,
      required: true,
    },
    name: {
      type: 'string',
      isNotEmptyString: true,
      maxLength: 128,
    },
  },

  exits: {
    notEnoughRights: {
      responseType: 'forbidden',
    },
    attachmentNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const pathToProject = await sails.helpers.attachments
      .getPathToProjectById(inputs.id)
      .intercept('pathNotFound', () => Errors.ATTACHMENT_NOT_FOUND);

    let { attachment } = pathToProject;
    const { card, list, board, project } = pathToProject;

    const boardMembership = await BoardMembership.qm.getOneByBoardIdAndUserId(
      board.id,
      currentUser.id,
    );

    if (!boardMembership) {
      throw Errors.ATTACHMENT_NOT_FOUND; // Forbidden
    }

    if (boardMembership.role !== BoardMembership.Roles.EDITOR) {
      throw Errors.NOT_ENOUGH_RIGHTS;
    }

    const values = _.pick(inputs, ['name']);

    attachment = await sails.helpers.attachments.updateOne.with({
      values,
      project,
      board,
      list,
      card,
      record: attachment,
      actorUser: currentUser,
      request: this.req,
    });

    if (!attachment) {
      throw Errors.ATTACHMENT_NOT_FOUND;
    }

    return {
      item: sails.helpers.attachments.presentOne(attachment),
    };
  },
};
