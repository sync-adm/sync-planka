const { v4: uuid } = require('uuid');

const normalizeValues = require('../../../utils/normalize-values');

module.exports = {
  inputs: {
    record: {
      type: 'ref',
      required: true,
    },
    values: {
      type: 'json',
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
    const { values } = inputs;

    const normalizedValues = normalizeValues(
      {
        ...BoardMembership.SHARED_RULES,
        ...BoardMembership.RULES_BY_ROLE[values.role || inputs.record.role],
      },
      values,
      inputs.record,
    );

    const boardMembership = await BoardMembership.qm.updateOne(inputs.record.id, normalizedValues);

    if (boardMembership) {
      sails.sockets.broadcast(
        `user:${boardMembership.userId}`,
        'boardMembershipUpdate',
        {
          item: boardMembership,
        },
        inputs.request,
      );

      const tempRoom = uuid();

      sails.sockets.addRoomMembersToRooms(`board:${boardMembership.boardId}`, tempRoom, () => {
        sails.sockets.removeRoomMembersFromRooms(`user:${boardMembership.userId}`, tempRoom, () => {
          sails.sockets.broadcast(
            tempRoom,
            'boardMembershipUpdate',
            {
              item: boardMembership,
            },
            inputs.request,
          );

          sails.sockets.removeRoomMembersFromRooms(tempRoom, tempRoom);
        });
      });

      sails.helpers.utils.sendWebhooks.with({
        event: 'boardMembershipUpdate',
        buildData: () => ({
          item: boardMembership,
          included: {
            projects: [inputs.project],
            boards: [inputs.board],
          },
        }),
        buildPrevData: () => ({
          item: inputs.record,
        }),
        user: inputs.actorUser,
      });
    }

    return boardMembership;
  },
};
