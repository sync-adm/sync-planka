const { idInput } = require('../../../utils/inputs');

const Errors = {
  PROJECT_NOT_FOUND: {
    projectNotFound: 'Project not found',
  },
  MUST_NOT_HAVE_BOARDS: {
    mustNotHaveBoards: 'Must not have boards',
  },
};

module.exports = {
  inputs: {
    id: {
      ...idInput,
      required: true,
    },
  },

  exits: {
    projectNotFound: {
      responseType: 'notFound',
    },
    mustNotHaveBoards: {
      responseType: 'unprocessableEntity',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    let project = await Project.qm.getOneById(inputs.id);

    if (!project) {
      throw Errors.PROJECT_NOT_FOUND;
    }

    const isProjectManager = await sails.helpers.users.isProjectManager(currentUser.id, project.id);

    if (!isProjectManager) {
      throw Errors.PROJECT_NOT_FOUND; // Forbidden
    }

    project = await sails.helpers.projects.deleteOne
      .with({
        record: project,
        actorUser: currentUser,
        request: this.req,
      })
      .intercept('mustNotHaveBoards', () => Errors.MUST_NOT_HAVE_BOARDS);

    if (!project) {
      throw Errors.PROJECT_NOT_FOUND;
    }

    return {
      item: project,
    };
  },
};
