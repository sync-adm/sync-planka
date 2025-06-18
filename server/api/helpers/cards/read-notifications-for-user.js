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
    // TODO: add actorUser as well?
    request: {
      type: 'ref',
    },
  },

  async fn(inputs) {
    const notifications = await Notification.qm.update(
      {
        userId: inputs.user.id,
        cardId: inputs.record.id,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    notifications.forEach((notification) => {
      sails.sockets.broadcast(
        `user:${notification.userId}`,
        'notificationUpdate',
        {
          item: notification,
        },
        inputs.request,
      );

      // TODO: with prevData?
      sails.helpers.utils.sendWebhooks.with({
        event: 'notificationUpdate',
        buildData: () => ({
          item: notification,
        }),
        user: inputs.user,
      });
    });

    return notifications;
  },
};
