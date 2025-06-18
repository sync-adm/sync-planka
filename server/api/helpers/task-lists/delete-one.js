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
    await sails.helpers.taskLists.deleteRelated(inputs.record);

    const taskList = await TaskList.qm.deleteOne(inputs.record.id);

    if (taskList) {
      sails.sockets.broadcast(
        `board:${inputs.board.id}`,
        'taskListDelete',
        {
          item: taskList,
        },
        inputs.request,
      );

      sails.helpers.utils.sendWebhooks.with({
        event: 'taskListDelete',
        buildData: () => ({
          item: taskList,
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

    return taskList;
  },
};
