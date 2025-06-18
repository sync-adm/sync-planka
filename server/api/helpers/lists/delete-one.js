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
    const trashList = await List.qm.getOneTrashByBoardId(inputs.board.id);

    const cards = await Card.qm.update(
      {
        listId: inputs.record.id,
      },
      {
        listId: trashList.id,
        position: null,
        listChangedAt: new Date().toISOString(),
      },
    );

    // TODO: create actions and notifications

    const list = await List.qm.deleteOne(inputs.record.id);

    if (list) {
      sails.sockets.broadcast(
        `board:${list.boardId}`,
        'listDelete',
        {
          item: list,
          included: {
            cards,
          },
        },
        inputs.request,
      );

      sails.helpers.utils.sendWebhooks.with({
        event: 'listDelete',
        buildData: () => ({
          item: list,
          included: {
            projects: [inputs.project],
            boards: [inputs.board],
          },
        }),
        user: inputs.actorUser,
      });
    }

    return { list, cards };
  },
};
