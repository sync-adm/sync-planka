module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const projectIntegration = await sails.helpers.projectIntegrations.getOne.with({
      id: inputs.id,
      actorUser: this.req.me,
    });

    return {
      item: projectIntegration,
    };
  },
};
