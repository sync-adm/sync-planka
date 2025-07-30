const { idInput } = require('../../../utils/inputs');

const Errors = {
  PROJECT_NOT_FOUND: {
    projectNotFound: 'Project not found',
  },
  POSTIZ_API_ERROR: {
    postizApiError: 'Failed to fetch integrations from Postiz',
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
    postizApiError: {
      responseType: 'serverError',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    try {
      const integrations = await sails.helpers.postiz.getIntegrations.with({
        projectId: inputs.projectId,
        actorUser: currentUser,
      });

      return integrations;
    } catch (error) {
      if (error.message === 'User is not a manager of this project') {
        throw Errors.PROJECT_NOT_FOUND;
      }
      if (error.message === 'Project not found') {
        throw Errors.PROJECT_NOT_FOUND;
      }
      if (error.message.includes('Failed to fetch integrations from Postiz')) {
        throw Errors.POSTIZ_API_ERROR;
      }
      throw error;
    }
  },
};
