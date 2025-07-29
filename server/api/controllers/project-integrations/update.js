module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    config: {
      type: 'json',
    },
    disabled: {
      type: 'boolean',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const values = {};

    if (inputs.config !== undefined) {
      values.config = inputs.config;
    }

    if (inputs.disabled !== undefined) {
      values.disabled = inputs.disabled;
    }

    const projectIntegration = await sails.helpers.projectIntegrations.updateOne.with({
      id: inputs.id,
      values,
      actorUser: currentUser,
      request: this.req,
    });

    return {
      item: projectIntegration,
    };
  },
};
