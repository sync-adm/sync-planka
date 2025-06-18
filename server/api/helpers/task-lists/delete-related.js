module.exports = {
  inputs: {
    recordOrRecords: {
      type: 'ref',
      required: true,
    },
  },

  async fn(inputs) {
    let taskListIdOrIds;
    if (_.isPlainObject(inputs.recordOrRecords)) {
      ({
        recordOrRecords: { id: taskListIdOrIds },
      } = inputs);
    } else if (_.every(inputs.recordOrRecords, _.isPlainObject)) {
      taskListIdOrIds = sails.helpers.utils.mapRecords(inputs.recordOrRecords);
    }

    await Task.qm.delete({
      taskListId: taskListIdOrIds,
    });
  },
};
