module.exports = {
  friendlyName: 'Create project integration',

  description: 'Create a project integration and broadcast it.',

  inputs: {
    values: {
      type: 'json',
      required: true,
    },
    projectId: {
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
    const { values, projectId, actorUser, request } = inputs;

    const projectManager = await ProjectManager.findOne({
      projectId,
      userId: actorUser.id,
    });

    if (!projectManager) {
      throw new Error('User is not a manager of this project');
    }

    const existingIntegration = await ProjectIntegration.findOne({
      projectId,
      integrationType: values.integrationType,
    });

    if (existingIntegration) {
      throw new Error(
        `Integration of type '${values.integrationType}' already exists for this project`,
      );
    }

    const projectIntegration = await ProjectIntegration.create({
      projectId,
      integrationType: values.integrationType,
      config: values.config || {},
      disabled: values.disabled || false,
    }).fetch();

    const project = await Project.findOne({ id: projectId });

    const scoper = sails.helpers.projects.makeScoper.with({
      record: project,
    });

    const userIdsWithFullProjectVisibility = await scoper.getUserIdsWithFullProjectVisibility();

    userIdsWithFullProjectVisibility.forEach((userId) => {
      sails.sockets.broadcast(
        `user:${userId}`,
        'projectIntegrationCreate',
        {
          item: projectIntegration,
          projectId,
        },
        request,
      );
    });

    return projectIntegration;
  },
};
