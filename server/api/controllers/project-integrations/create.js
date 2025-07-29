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

  async fn(inputs) {
    const projectIntegration = await sails.helpers.projectIntegrations.createOne.with({
      values: {
        integrationType: inputs.integrationType,
        config: inputs.config,
        disabled: inputs.disabled,
      },
      projectId: inputs.projectId,
      actorUser: this.req.me,
      request: this.req,
    });

    return {
      item: projectIntegration,
    };
  },
};
