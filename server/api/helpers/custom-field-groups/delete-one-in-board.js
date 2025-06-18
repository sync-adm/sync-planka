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
    await sails.helpers.customFieldGroups.deleteRelated(inputs.record);

    const customFieldGroup = await CustomFieldGroup.qm.deleteOne(inputs.record.id);

    if (customFieldGroup) {
      sails.sockets.broadcast(
        `board:${customFieldGroup.boardId}`,
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
          },
        }),
        user: inputs.actorUser,
      });
    }

    return customFieldGroup;
  },
};
