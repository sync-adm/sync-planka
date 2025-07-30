module.exports = {
  inputs: {
    projectId: {
      type: 'string',
      required: true,
    },
    integrationType: {
      type: 'string',
      isIn: ['instagram', 'facebook', 'tiktok'],
      required: true,
    },
    config: {
      type: 'json',
      defaultsTo: {},
    },
    disabled: {
      type: 'boolean',
      defaultsTo: false,
    },
  },

  exits: {
    integrationAlreadyExists: {
      responseType: 'badRequest',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const projectIntegration = await sails.helpers.projectIntegrations.createOne
      .with({
        values: {
          integrationType: inputs.integrationType,
          config: inputs.config,
          disabled: inputs.disabled,
        },
        projectId: inputs.projectId,
        actorUser: currentUser,
        request: this.req,
      })
      .intercept('integrationAlreadyExists', () => ({
        integrationAlreadyExists: 'Integration already exists for this project',
      }));

    return {
      item: projectIntegration,
    };
  },
};
