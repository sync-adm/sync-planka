module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const projectIntegration = await sails.helpers.projectIntegrations.getOne.with({
      id: inputs.id,
      actorUser: currentUser,
    });

    return {
      item: projectIntegration,
    };
  },
};
