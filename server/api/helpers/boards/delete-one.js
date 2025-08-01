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
    actorUser: {
      type: 'ref',
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  async fn(inputs) {
    const { boardMemberships } = await sails.helpers.boards.deleteRelated(inputs.record);

    const board = await Board.qm.deleteOne(inputs.record.id);

    if (board) {
      const scoper = sails.helpers.projects.makeScoper.with({
        board,
        record: inputs.project,
      });

      scoper.boardMemberships = boardMemberships;
      const boardRelatedUserIds = await scoper.getBoardRelatedUserIds();

      sails.sockets.removeRoomMembersFromRooms(`board:${board.id}`, `board:${board.id}`);

      boardRelatedUserIds.forEach((userId) => {
        sails.sockets.broadcast(
          `user:${userId}`,
          'boardDelete',
          {
            item: board,
          },
          inputs.request,
        );
      });

      sails.helpers.utils.sendWebhooks.with({
        event: 'boardDelete',
        buildData: () => ({
          item: board,
          included: {
            projects: [inputs.project],
          },
        }),
        user: inputs.actorUser,
      });
    }

    return board;
  },
};
