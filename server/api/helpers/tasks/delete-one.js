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
    taskList: {
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
    const task = await Task.qm.deleteOne(inputs.record.id);

    if (task) {
      sails.sockets.broadcast(
        `board:${inputs.board.id}`,
        'taskDelete',
        {
          item: task,
        },
        inputs.request,
      );

      sails.helpers.utils.sendWebhooks.with({
        event: 'taskDelete',
        buildData: () => ({
          item: task,
          included: {
            projects: [inputs.project],
            boards: [inputs.board],
            lists: [inputs.list],
            cards: [inputs.card],
            taskLists: [inputs.taskList],
          },
        }),
        user: inputs.actorUser,
      });
    }

    return task;
  },
};
