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
    await sails.helpers.labels.deleteRelated(inputs.record);

    const label = await Label.qm.deleteOne(inputs.record.id);

    if (label) {
      sails.sockets.broadcast(
        `board:${label.boardId}`,
        'labelDelete',
        {
          item: label,
        },
        inputs.request,
      );

      sails.helpers.utils.sendWebhooks.with({
        event: 'labelDelete',
        buildData: () => ({
          item: label,
          included: {
            projects: [inputs.project],
            boards: [inputs.board],
          },
        }),
        user: inputs.actorUser,
      });
    }

    return label;
  },
};
