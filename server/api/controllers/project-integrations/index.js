const { idInput } = require('../../../utils/inputs');

const Errors = {
  PROJECT_NOT_FOUND: {
    projectNotFound: 'Project not found',
  },
};

module.exports = {
  inputs: {
    projectId: {
      ...idInput,
      required: true,
    },
  },

  exits: {
    projectNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    try {
      const projectIntegrations = await sails.helpers.projectIntegrations.getMany.with({
        projectId: inputs.projectId,
        actorUser: currentUser,
      });

      return {
        items: projectIntegrations,
      };
    } catch (error) {
      if (error.message === 'User is not a manager of this project') {
        throw Errors.PROJECT_NOT_FOUND;
      }
      throw error;
    }
  },
};
