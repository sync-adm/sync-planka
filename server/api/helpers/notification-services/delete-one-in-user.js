module.exports = {
  inputs: {
    record: {
      type: 'ref',
      required: true,
    },
    user: {
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
      sails.sockets.broadcast(
        `user:${notificationService.userId}`,
        'notificationServiceDelete',
        {
          item: notificationService,
        },
        inputs.request,
      );

      sails.helpers.utils.sendWebhooks.with({
        event: 'notificationServiceDelete',
        buildData: () => ({
          item: notificationService,
          included: {
            users: [inputs.user],
          },
        }),
        user: inputs.actorUser,
      });
    }

    return notificationService;
  },
};
