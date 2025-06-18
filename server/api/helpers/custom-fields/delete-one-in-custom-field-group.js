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
    },
    card: {
      type: 'ref',
    },
    customFieldGroup: {
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

  exits: {
    listMustBePresent: {},
    cardMustBePresent: {},
  },

  async fn(inputs) {
    if (inputs.customFieldGroup.cardId) {
      if (!inputs.list) {
        throw 'listMustBePresent';
      }

      if (!inputs.card) {
        throw 'cardMustBePresent';
      }
    }

    await sails.helpers.customFields.deleteRelated(inputs.record);

    const customField = await CustomField.qm.deleteOne(inputs.record.id);

    if (customField) {
      sails.sockets.broadcast(
        `board:${inputs.board.id}`,
        'customFieldDelete',
        {
          item: customField,
        },
        inputs.request,
      );

      sails.helpers.utils.sendWebhooks.with({
        event: 'customFieldDelete',
        buildData: () => ({
          item: customField,
          included: {
            projects: [inputs.project],
            boards: [inputs.board],
            customFieldGroups: [inputs.customFieldGroup],
            ...(inputs.list && {
              lists: [inputs.list],
            }),
            ...(inputs.card && {
              cards: [inputs.card],
            }),
          },
        }),
        user: inputs.actorUser,
      });
    }

    return customField;
  },
};
