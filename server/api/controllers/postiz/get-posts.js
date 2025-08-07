const { idInput } = require('../../../utils/inputs');

const Errors = {
  PROJECT_INTEGRATION_NOT_FOUND: {
    projectNotFound: 'Project integration not found',
  },
};

module.exports = {
  inputs: {
    projectId: {
      ...idInput,
      required: true,
    },
    provider: {
      type: 'string',
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

    const projectIntegrations = await sails.helpers.projectIntegrations.getMany.with({
      projectId: inputs.projectId,
      actorUser: currentUser,
    });

    const instagramIntegration = projectIntegrations.find(
      (integration) => integration.integrationType === inputs.provider,
    );

    if (!instagramIntegration) {
      throw Errors.PROJECT_INTEGRATION_NOT_FOUND;
    }

    const posts = await sails.helpers.postiz.getPosts.with({
      integrationId: instagramIntegration.config.id,
    });

    if (!posts || posts.length === 0) {
      return { items: [] };
    }

    return {
      posts,
    };
  },
};
