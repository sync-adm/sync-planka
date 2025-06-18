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
    actorUser: {
      type: 'ref',
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  async fn(inputs) {
    await sails.helpers.customFieldGroups.deleteRelated(inputs.record);

    const customFieldGroup = await CustomFieldGroup.qm.deleteOne(inputs.record.id);

    if (customFieldGroup) {
      sails.sockets.broadcast(
        `board:${inputs.board.id}`,
        'customFieldGroupDelete',
        {
          item: customFieldGroup,
        },
        inputs.request,
      );

      sails.helpers.utils.sendWebhooks.with({
        event: 'customFieldGroupDelete',
        buildData: () => ({
          item: customFieldGroup,
          included: {
            projects: [inputs.project],
            boards: [inputs.board],
            lists: [inputs.list],
            cards: [inputs.card],
          },
        }),
        user: inputs.actorUser,
      });
    }

    return customFieldGroup;
  },
};
