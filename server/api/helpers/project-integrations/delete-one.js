module.exports = {
  friendlyName: 'Delete project integration',

  description: 'Delete a project integration and broadcast it.',

  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    actorUser: {
      type: 'ref',
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  async fn(inputs) {
    const { id, actorUser, request } = inputs;

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

    await ProjectIntegration.destroyOne({ id });

    const project = await Project.findOne({ id: projectIntegration.projectId });

    const scoper = sails.helpers.projects.makeScoper.with({
      record: project,
    });

    const userIdsWithFullProjectVisibility = await scoper.getUserIdsWithFullProjectVisibility();

    userIdsWithFullProjectVisibility.forEach((userId) => {
      sails.sockets.broadcast(
        `user:${userId}`,
        'projectIntegrationDelete',
        {
          item: projectIntegration,
          projectId: projectIntegration.projectId,
        },
        request,
      );
    });

    sails.helpers.utils.sendWebhooks.with({
      event: 'projectIntegrationDelete',
      buildData: () => ({
        item: projectIntegration,
        project,
      }),
      user: actorUser,
    });

    return projectIntegration;
  },
};
