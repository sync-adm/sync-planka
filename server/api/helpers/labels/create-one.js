module.exports = {
  inputs: {
    values: {
      type: 'ref',
      required: true,
    },
    project: {
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

    const labels = await Label.qm.getByBoardId(values.board.id);

    const { position, repositions } = sails.helpers.utils.insertToPositionables(
      values.position,
      labels,
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const reposition of repositions) {
      // eslint-disable-next-line no-await-in-loop
      await Label.qm.updateOne(
        {
          id: reposition.record.id,
          boardId: reposition.record.boardId,
        },
        {
          position: reposition.position,
        },
      );

      sails.sockets.broadcast(`board:${values.board.id}`, 'labelUpdate', {
        item: {
          id: reposition.record.id,
          position: reposition.position,
        },
      });

      // TODO: send webhooks
    }

    const label = await Label.qm.createOne({
      ...values,
      position,
      boardId: values.board.id,
    });

    sails.sockets.broadcast(
      `board:${label.boardId}`,
      'labelCreate',
      {
        item: label,
      },
      inputs.request,
    );

    sails.helpers.utils.sendWebhooks.with({
      event: 'labelCreate',
      buildData: () => ({
        item: label,
        included: {
          projects: [inputs.project],
          boards: [values.board],
        },
      }),
      user: inputs.actorUser,
    });

    return label;
  },
};
