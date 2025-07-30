module.exports = {
  inputs: {
    attachments: {
      type: 'ref',
      description: 'Array of attachment records',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Filtered attachments by Instagram dimensions',
    },
  },

  sync: true,

  fn(inputs) {
    const instagramFeedHeight = 1350;
    const instagramReelsAndStoryHeight = 1920;

    const instagramFeedAttachment = inputs.attachments.find(
      (attachment) =>
        attachment.type === Attachment.Types.FILE &&
        attachment.data &&
        attachment.data.image &&
        attachment.data.image.height === instagramFeedHeight,
    );

    const instagramStoryAttachment = inputs.attachments.find(
      (attachment) =>
        attachment.type === Attachment.Types.FILE &&
        attachment.data &&
        attachment.data.image &&
        attachment.data.image.height === instagramReelsAndStoryHeight,
    );

    return {
      instagramFeedAttachment,
      instagramStoryAttachment,
    };
  },
};
