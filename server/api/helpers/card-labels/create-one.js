module.exports = {
  inputs: {
    values: {
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
    actorUser: {
      type: 'ref',
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  exits: {
    labelAlreadyInCard: {},
  },

  async fn(inputs) {
    const { values } = inputs;

    let cardLabel;
    try {
      cardLabel = await CardLabel.qm.createOne({
        ...values,
        cardId: values.card.id,
        labelId: values.label.id,
      });
    } catch (error) {
      if (error.code === 'E_UNIQUE') {
        throw 'labelAlreadyInCard';
      }

      throw error;
    }

    sails.sockets.broadcast(
      `board:${inputs.board.id}`,
      'cardLabelCreate',
      {
        item: cardLabel,
      },
      inputs.request,
    );

    sails.helpers.utils.sendWebhooks.with({
      event: 'cardLabelCreate',
      buildData: () => ({
        item: cardLabel,
        included: {
          projects: [inputs.project],
          boards: [inputs.board],
          labels: [values.label],
          lists: [inputs.list],
          cards: [values.card],
        },
      }),
      user: inputs.actorUser,
    });

    return cardLabel;
  },
};
