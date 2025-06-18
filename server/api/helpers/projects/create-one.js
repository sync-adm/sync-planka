module.exports = {
  inputs: {
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
    const { values } = inputs;

    const { project, projectManager } = await Project.qm.createOne(values, {
      user: inputs.actorUser,
    });

    const scoper = sails.helpers.projects.makeScoper.with({
      record: project,
    });

    scoper.projectManagerUserIds = [projectManager.userId];
    const userIdsWithFullProjectVisibility = await scoper.getUserIdsWithFullProjectVisibility();

    userIdsWithFullProjectVisibility.forEach((userId) => {
      // TODO: send projectManager in included
      sails.sockets.broadcast(
        `user:${userId}`,
        'projectCreate',
        {
          item: project,
        },
        inputs.request,
      );
    });

    sails.helpers.utils.sendWebhooks.with({
      event: 'projectCreate',
      buildData: () => ({
        item: project,
      }),
      user: inputs.actorUser,
    });

    return {
      project,
      projectManager,
    };
  },
};
