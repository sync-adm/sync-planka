module.exports = {
  inputs: {
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
    const { values } = inputs;

    const tasks = await Task.qm.getByTaskListId(values.taskList.id);

    const { position, repositions } = sails.helpers.utils.insertToPositionables(
      values.position,
      tasks,
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const reposition of repositions) {
      // eslint-disable-next-line no-await-in-loop
      await Task.qm.updateOne(
        {
          id: reposition.record.id,
          taskListId: reposition.record.taskListId,
        },
        {
          position: reposition.position,
        },
      );

      sails.sockets.broadcast(`board:${inputs.board.id}`, 'taskUpdate', {
        item: {
          id: reposition.record.id,
          position: reposition.position,
        },
      });

      // TODO: send webhooks
    }

    const task = await Task.qm.createOne({
      ...values,
      position,
      taskListId: values.taskList.id,
    });

    sails.sockets.broadcast(
      `board:${inputs.board.id}`,
      'taskCreate',
      {
        item: task,
      },
      inputs.request,
    );

    sails.helpers.utils.sendWebhooks.with({
      event: 'taskCreate',
      buildData: () => ({
        item: task,
        included: {
          projects: [inputs.project],
          boards: [inputs.board],
          lists: [inputs.list],
          cards: [inputs.card],
          taskLists: [values.taskList],
        },
      }),
      user: inputs.actorUser,
    });

    return task;
  },
};
