module.exports = {
  inputs: {
    values: {
      type: 'ref',
      required: true,
    },
    actorUser: {
      type: 'ref',
      required: true,
    },
    requestId: {
      type: 'string',
    },
    request: {
      type: 'ref',
    },
  },

  async fn(inputs) {
    const { values } = inputs;

    const backgroundImage = await BackgroundImage.qm.createOne({
      ...values,
      projectId: values.project.id,
    });

    const scoper = sails.helpers.projects.makeScoper.with({
      record: values.project,
    });

    const projectRelatedUserIds = await scoper.getProjectRelatedUserIds();

    projectRelatedUserIds.forEach((userId) => {
      sails.sockets.broadcast(
        `user:${userId}`,
        'backgroundImageCreate',
        {
          item: sails.helpers.backgroundImages.presentOne(backgroundImage),
          requestId: inputs.requestId,
        },
        inputs.request,
      );
    });

    sails.helpers.utils.sendWebhooks.with({
      event: 'backgroundImageCreate',
      buildData: () => ({
        item: sails.helpers.backgroundImages.presentOne(backgroundImage),
        included: {
          projects: [values.project],
        },
      }),
      user: inputs.actorUser,
    });

    await sails.helpers.projects.updateOne.with({
      scoper,
      record: values.project,
      values: {
        backgroundImage,
        backgroundType: Project.BackgroundTypes.IMAGE,
      },
      actorUser: inputs.actorUser,
    });

    return backgroundImage;
  },
};
