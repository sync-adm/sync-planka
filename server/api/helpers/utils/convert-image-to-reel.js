const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

module.exports = {
  inputs: {
    attachment: {
      type: 'ref',
      description: 'Image attachment to convert to video',
      required: true,
    },
    card: {
      type: 'ref',
      description: 'Card record for context',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'New video attachment created',
    },
    error: {
      description: 'Error converting image to video',
    },
  },

  sync: false,

  async fn(inputs) {
    const { attachment, card } = inputs;

    if (!attachment || !attachment.data || !attachment.data.fileReferenceId) {
      throw new Error('Invalid attachment provided');
    }

    try {
      const imageUrl = sails.helpers.utils.buildStorjUrl(attachment);

      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
      }

      const imageBuffer = Buffer.from(await response.arrayBuffer());

      const tempDir = path.join(__dirname, '../../../private/temp');
      await fs.promises.mkdir(tempDir, { recursive: true });

      const inputImagePath = path.join(tempDir, `input_${Date.now()}.png`);
      const outputVideoPath = path.join(tempDir, `output_${Date.now()}.mp4`);

      await fs.promises.writeFile(inputImagePath, imageBuffer);

      await new Promise((resolve, reject) => {
        ffmpeg(inputImagePath)
          .inputOptions(['-loop 1', '-t 5'])
          .outputOptions(['-c:v libx264', '-pix_fmt yuv420p', '-r 30', '-shortest'])
          .output(outputVideoPath)
          .on('end', () => {
            resolve();
          })
          .on('error', (err) => {
            sails.log.error('Erro no FFmpeg:', err);
            reject(err);
          })
          .run();
      });

      const videoBuffer = await fs.promises.readFile(outputVideoPath);

      let videoFilename;
      if (attachment.data.filename && typeof attachment.data.filename === 'string') {
        videoFilename = `${attachment.data.filename.split('.')[0]}_reel.mp4`;
      } else {
        videoFilename = `reel_${Date.now()}.mp4`;
      }

      const fileObject = {
        fd: outputVideoPath,
        filename: videoFilename,
        size: videoBuffer.length,
      };

      const videoAttachment = await sails.helpers.attachments.processUploadedFile(fileObject);

      const { list, board, project } = await sails.helpers.cards
        .getPathToProjectById(card.id)
        .intercept('pathNotFound', () => new Error('Card not found'));

      const creatorUser = await User.findOne({ id: card.creatorUserId });
      if (!creatorUser) {
        throw new Error('Creator user not found');
      }

      const newAttachment = await sails.helpers.attachments.createOne.with({
        project,
        board,
        list,
        values: {
          type: 'file',
          name: videoFilename,
          data: videoAttachment,
          card,
          creatorUser,
        },
      });

      await fs.promises.unlink(inputImagePath).catch(() => {});
      await fs.promises.unlink(outputVideoPath).catch(() => {});

      return newAttachment;
    } catch (error) {
      sails.log.error('Erro ao converter imagem para vídeo:', error);
      throw new Error(`Failed to convert image to video: ${error.message}`);
    }
  },
};
