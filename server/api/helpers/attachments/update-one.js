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

    const attachment = await Attachment.qm.updateOne(inputs.record.id, values);

    if (attachment) {
      sails.sockets.broadcast(
        `board:${inputs.board.id}`,
        'attachmentUpdate',
        {
          item: sails.helpers.attachments.presentOne(attachment),
        },
        inputs.request,
      );

      sails.helpers.utils.sendWebhooks.with({
        event: 'attachmentUpdate',
        buildData: () => ({
          item: sails.helpers.attachments.presentOne(attachment),
          included: {
            projects: [inputs.project],
            boards: [inputs.board],
            lists: [inputs.list],
            cards: [inputs.card],
          },
        }),
        buildPrevData: () => ({
          item: sails.helpers.attachments.presentOne(inputs.record),
        }),
        user: inputs.actorUser,
      });
    }

    return attachment;
  },
};
