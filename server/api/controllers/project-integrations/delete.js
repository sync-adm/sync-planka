module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const projectIntegration = await sails.helpers.projectIntegrations.deleteOne.with({
      id: inputs.id,
      actorUser: this.req.me,
      request: this.req,
    });

    return {
      item: projectIntegration,
    };
  },
};
