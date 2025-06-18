module.exports = {
  inputs: {
    record: {
      type: 'ref',
      required: true,
    },
    values: {
      type: 'json',
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
    const { values } = inputs;

    const notificationService = await NotificationService.qm.updateOne(inputs.record.id, values);

    if (notificationService) {
      sails.sockets.broadcast(
        `user:${notificationService.userId}`,
        'notificationServiceUpdate',
        {
          item: notificationService,
        },
        inputs.request,
      );

      sails.helpers.utils.sendWebhooks.with({
        event: 'notificationServiceUpdate',
        buildData: () => ({
          item: notificationService,
          included: {
            users: [inputs.user],
          },
        }),
        buildPrevData: () => ({
          item: inputs.record,
        }),
        user: inputs.actorUser,
      });
    }

    return notificationService;
  },
};
