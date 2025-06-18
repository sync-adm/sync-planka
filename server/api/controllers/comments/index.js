const { idInput } = require('../../../utils/inputs');

const Errors = {
  CARD_NOT_FOUND: {
    cardNotFound: 'Card not found',
  },
};

module.exports = {
  inputs: {
    cardId: {
      ...idInput,
      required: true,
    },
    beforeId: idInput,
  },

  exits: {
    cardNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const { card, project } = await sails.helpers.cards
      .getPathToProjectById(inputs.cardId)
      .intercept('pathNotFound', () => Errors.CARD_NOT_FOUND);

    if (currentUser.role !== User.Roles.ADMIN || project.ownerProjectManagerId) {
      const isProjectManager = await sails.helpers.users.isProjectManager(
        currentUser.id,
        project.id,
      );

      if (!isProjectManager) {
        const boardMembership = await BoardMembership.qm.getOneByBoardIdAndUserId(
          card.boardId,
          currentUser.id,
        );

        if (!boardMembership) {
          throw Errors.CARD_NOT_FOUND; // Forbidden
        }
      }
    }

    const comments = await Comment.qm.getByCardId(card.id, {
      beforeId: inputs.beforeId,
    });

    const userIds = sails.helpers.utils.mapRecords(comments, 'userId', true, true);
    const users = await User.qm.getByIds(userIds);

    return {
      items: comments,
      included: {
        users: sails.helpers.users.presentMany(users, currentUser),
      },
    };
  },
};
