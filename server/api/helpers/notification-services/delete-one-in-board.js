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
    board: {
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
    const notificationService = await NotificationService.qm.deleteOne(inputs.record.id);

    if (notificationService) {
      const scoper = sails.helpers.projects.makeScoper.with({
        notificationService,
        record: inputs.project,
        board: inputs.board,
      });

      const notificationServiceRelatedUserIds = await scoper.getNotificationServiceRelatedUserIds();

      notificationServiceRelatedUserIds.forEach((userId) => {
        sails.sockets.broadcast(
          `user:${userId}`,
          'notificationServiceDelete',
          {
            item: notificationService,
          },
          inputs.request,
        );
      });

      sails.helpers.utils.sendWebhooks.with({
        event: 'notificationServiceDelete',
        buildData: () => ({
          item: notificationService,
          included: {
            projects: [inputs.project],
            boards: [inputs.board],
          },
        }),
        user: inputs.actorUser,
      });
    }

    return notificationService;
  },
};
