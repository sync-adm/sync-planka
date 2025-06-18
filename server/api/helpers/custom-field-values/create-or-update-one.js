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

    const customFieldValue = await CustomFieldValue.qm.createOrUpdateOne({
      ...values,
      cardId: values.card.id,
      customFieldGroupId: values.customFieldGroup.id,
      customFieldId: values.customField.id,
    });

    sails.sockets.broadcast(
      `board:${inputs.board.id}`,
      'customFieldValueUpdate',
      {
        item: customFieldValue,
      },
      inputs.request,
    );

    // TODO: with prevData?
    sails.helpers.utils.sendWebhooks.with({
      event: 'customFieldValueUpdate',
      buildData: () => ({
        item: customFieldValue,
        included: {
          projects: [inputs.project],
          boards: [inputs.board],
          lists: [inputs.list],
          cards: [values.card],
          customFieldGroups: [values.customFieldGroup],
          customFields: [values.customField],
        },
      }),
      user: inputs.actorUser,
    });

    return customFieldValue;
  },
};
