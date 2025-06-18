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

    const notification = await Notification.qm.updateOne(inputs.record.id, values);

    if (notification) {
      sails.sockets.broadcast(
        `user:${notification.userId}`,
        'notificationUpdate',
        {
          item: notification,
        },
        inputs.request,
      );

      sails.helpers.utils.sendWebhooks.with({
        event: 'notificationUpdate',
        buildData: () => ({
          item: notification,
        }),
        buildPrevData: () => ({
          item: inputs.record,
        }),
        user: inputs.actorUser,
      });
    }

    return notification;
  },
};
