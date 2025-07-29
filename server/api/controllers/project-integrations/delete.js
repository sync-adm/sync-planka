module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const projectIntegration = await sails.helpers.projectIntegrations.deleteOne.with({
      id: inputs.id,
      actorUser: currentUser,
      request: this.req,
    });

    return {
      item: projectIntegration,
    };
  },
};
