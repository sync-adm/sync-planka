module.exports = {
  inputs: {
    attachment: {
      type: 'ref',
      description: 'Attachment record',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Storj URL for attachment',
    },
  },

  sync: true,

  fn(inputs) {
    const { attachment } = inputs;

    if (
      !attachment ||
      !attachment.data ||
      !attachment.data.fileReferenceId ||
      !attachment.data.filename
    ) {
      return null;
    }

    const STORJ_ENDPOINT = 'https://link.storjshare.io/raw/jxtj5fknleuwxtn5w4iriuuxcena';
    const S3_BUCKET = 'planka-marketing';

    return `${STORJ_ENDPOINT}/${S3_BUCKET}/private/attachments/${attachment.data.fileReferenceId}/${attachment.data.filename}`;
  },
};
