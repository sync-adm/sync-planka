module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    pathNotFound: {},
  },

  async fn(inputs) {
    const attachment = await Attachment.qm.getOneById(inputs.id);

    if (!attachment) {
      throw 'pathNotFound';
    }

    const pathToProject = await sails.helpers.cards
      .getPathToProjectById(attachment.cardId)
      .intercept('pathNotFound', (nodes) => ({
        pathNotFound: {
          attachment,
          ...nodes,
        },
      }));

    return {
      attachment,
      ...pathToProject,
    };
  },
};
