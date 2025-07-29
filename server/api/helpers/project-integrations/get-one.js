module.exports = {
  friendlyName: 'Get project integration',

  description: 'Get a single project integration.',

  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    actorUser: {
      type: 'ref',
      required: true,
    },
  },

  async fn(inputs) {
    const { id, actorUser } = inputs;

    const projectIntegration = await ProjectIntegration.findOne({ id });

    if (!projectIntegration) {
      throw new Error('Project integration not found');
    }

    const projectManager = await ProjectManager.findOne({
      projectId: projectIntegration.projectId,
      userId: actorUser.id,
    });

    if (!projectManager) {
      throw new Error('User is not a manager of this project');
    }

    return projectIntegration;
  },
};
