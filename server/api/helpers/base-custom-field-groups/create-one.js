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
    request: {
      type: 'ref',
    },
  },

  async fn(inputs) {
    const { values } = inputs;

    const baseCustomFieldGroup = await BaseCustomFieldGroup.qm.createOne({
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
        'baseCustomFieldGroupCreate',
        {
          item: baseCustomFieldGroup,
        },
        inputs.request,
      );
    });

    sails.helpers.utils.sendWebhooks.with({
      event: 'baseCustomFieldGroupCreate',
      buildData: () => ({
        item: baseCustomFieldGroup,
        included: {
          projects: [values.project],
        },
      }),
      user: inputs.actorUser,
    });

    return baseCustomFieldGroup;
  },
};
