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

    const lists = await sails.helpers.boards.getFiniteListsById(values.board.id);

    const { position, repositions } = sails.helpers.utils.insertToPositionables(
      values.position,
      lists,
    );

    if (repositions.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const reposition of repositions) {
        // eslint-disable-next-line no-await-in-loop
        await List.qm.updateOne(
          {
            id: reposition.record.id,
            boardId: reposition.record.boardId,
          },
          {
            position: reposition.position,
          },
        );

        sails.sockets.broadcast(`board:${values.board.id}`, 'listUpdate', {
          item: {
            id: reposition.record.id,
            position: reposition.position,
          },
        });

        // TODO: send webhooks
      }
    }

    const list = await List.qm.createOne({
      ...values,
      position,
      boardId: values.board.id,
    });

    sails.sockets.broadcast(
      `board:${list.boardId}`,
      'listCreate',
      {
        item: list,
      },
      inputs.request,
    );

    sails.helpers.utils.sendWebhooks.with({
      event: 'listCreate',
      buildData: () => ({
        item: list,
        included: {
          projects: [inputs.project],
          boards: [values.board],
        },
      }),
      user: inputs.actorUser,
    });

    return list;
  },
};
