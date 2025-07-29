module.exports = {
  inputs: {
    projectId: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const projectIntegrations = await sails.helpers.projectIntegrations.getMany.with({
      projectId: inputs.projectId,
      actorUser: this.req.me,
    });

    return {
      items: projectIntegrations,
    };
  },
};
