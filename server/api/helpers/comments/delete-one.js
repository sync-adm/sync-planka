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
    const comment = await Comment.qm.deleteOne(inputs.record.id);

    if (comment) {
      sails.sockets.broadcast(
        `board:${inputs.board.id}`,
        'commentDelete',
        {
          item: comment,
        },
        inputs.request,
      );

      sails.helpers.utils.sendWebhooks.with({
        event: 'commentDelete',
        buildData: () => ({
          item: comment,
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

    return comment;
  },
};
