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
    list: {
      type: 'ref',
      required: true,
    },
    card: {
      type: 'ref',
      required: true,
    },
    customFieldGroup: {
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
    const customFieldValue = await CustomFieldValue.qm.deleteOne(inputs.record.id);

    if (customFieldValue) {
      sails.sockets.broadcast(
        `board:${inputs.board.id}`,
        'customFieldValueDelete',
        {
          item: customFieldValue,
        },
        inputs.request,
      );

      sails.helpers.utils.sendWebhooks.with({
        event: 'customFieldValueDelete',
        buildData: () => ({
          item: customFieldValue,
          included: {
            projects: [inputs.project],
            boards: [inputs.board],
            lists: [inputs.list],
            cards: [inputs.card],
            customFieldGroups: [inputs.customFieldGroup],
          },
        }),
        user: inputs.actorUser,
      });
    }

    return customFieldValue;
  },
};
