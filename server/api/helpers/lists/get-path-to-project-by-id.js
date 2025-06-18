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
    const list = await List.qm.getOneById(inputs.id);

    if (!list) {
      throw 'pathNotFound';
    }

    const pathToProject = await sails.helpers.boards
      .getPathToProjectById(list.boardId)
      .intercept('pathNotFound', (nodes) => ({
        pathNotFound: {
          list,
          ...nodes,
        },
      }));

    return {
      list,
      ...pathToProject,
    };
  },
};
