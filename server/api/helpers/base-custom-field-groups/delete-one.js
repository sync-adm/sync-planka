module.exports = {
  inputs: {
    record: {
      type: 'ref',
      required: true,
    },
    project: {
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
    await sails.helpers.baseCustomFieldGroups.deleteRelated(inputs.record);

    const baseCustomFieldGroup = await BaseCustomFieldGroup.qm.deleteOne(inputs.record.id);

    if (baseCustomFieldGroup) {
      const scoper = sails.helpers.projects.makeScoper.with({
        record: inputs.project,
      });

      const projectRelatedUserIds = await scoper.getProjectRelatedUserIds();

      projectRelatedUserIds.forEach((userId) => {
        sails.sockets.broadcast(
          `user:${userId}`,
          'baseCustomFieldGroupDelete',
          {
            item: baseCustomFieldGroup,
          },
          inputs.request,
        );
      });

      sails.helpers.utils.sendWebhooks.with({
        event: 'baseCustomFieldGroupDelete',
        buildData: () => ({
          item: baseCustomFieldGroup,
          included: {
            projects: [inputs.project],
          },
        }),
        user: inputs.actorUser,
      });
    }

    return baseCustomFieldGroup;
  },
};
