module.exports = {
  friendlyName: 'Update project integration',

  description: 'Update a project integration and broadcast it.',

  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    values: {
      type: 'json',
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
    const { id, values, actorUser, request } = inputs;

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

    const updatedIntegration = await ProjectIntegration.updateOne({ id }).set({
      config: values.config !== undefined ? values.config : projectIntegration.config,
      disabled: values.disabled !== undefined ? values.disabled : projectIntegration.disabled,
    });

    const project = await Project.findOne({ id: projectIntegration.projectId });

    const scoper = sails.helpers.projects.makeScoper.with({
      record: project,
    });

    const userIdsWithFullProjectVisibility = await scoper.getUserIdsWithFullProjectVisibility();

    userIdsWithFullProjectVisibility.forEach((userId) => {
      sails.sockets.broadcast(
        `user:${userId}`,
        'projectIntegrationUpdate',
        {
          item: updatedIntegration,
          projectId: projectIntegration.projectId,
        },
        request,
      );
    });

    sails.helpers.utils.sendWebhooks.with({
      event: 'projectIntegrationUpdate',
      buildData: () => ({
        item: updatedIntegration,
        project,
      }),
      user: actorUser,
    });

    return updatedIntegration;
  },
};
