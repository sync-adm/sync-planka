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

  exits: {
    limitReached: {},
  },

  async fn(inputs) {
    const { values } = inputs;

    const notificationServicesTotal = await sails.helpers.users.getNotificationServicesTotal(
      values.user.id,
    );

    // TODO: move to config?
    if (notificationServicesTotal >= 5) {
      throw 'limitReached';
    }

    const notificationService = await NotificationService.qm.createOne({
      ...values,
      userId: values.user.id,
    });

    sails.sockets.broadcast(
      `user:${notificationService.userId}`,
      'notificationServiceCreate',
      {
        item: notificationService,
      },
      inputs.request,
    );

    sails.helpers.utils.sendWebhooks.with({
      event: 'notificationServiceCreate',
      buildData: () => ({
        item: notificationService,
        included: {
          users: [values.user],
        },
      }),
      user: inputs.actorUser,
    });

    return notificationService;
  },
};
