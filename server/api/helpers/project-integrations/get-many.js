module.exports = {
  friendlyName: 'Get project integrations',

  description: 'Get all integrations for a project.',

  inputs: {
    projectId: {
      type: 'string',
      required: true,
    },
    actorUser: {
      type: 'ref',
      required: true,
    },
  },

  async fn(inputs) {
    const { projectId, actorUser } = inputs;

    const projectManager = await ProjectManager.findOne({
      projectId,
      userId: actorUser.id,
    });

    if (!projectManager) {
      throw new Error('User is not a manager of this project');
    }

    const projectIntegrations = await ProjectIntegration.find({
      projectId,
    }).sort('createdAt ASC');

    return projectIntegrations;
  },
};
