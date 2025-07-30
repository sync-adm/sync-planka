module.exports = {
  inputs: {
    attachments: {
      type: 'ref',
      description: 'Array of attachment records',
      required: true,
    },
    baseDescription: {
      type: 'string',
      description: 'Base description for the posts',
      required: true,
    },
    publishSettings: {
      type: 'ref',
      description: 'Instagram publish settings configuration',
      required: true,
    },
    postizIntegrationId: {
      type: 'string',
      description: 'Postiz integration ID',
      required: true,
    },
    card: {
      type: 'ref',
      description: 'Card record for reel creation',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Instagram publishing results',
    },
  },

  sync: false,

  async fn(inputs) {
    const { attachments, baseDescription, publishSettings, postizIntegrationId, card } = inputs;
    const { instagramFeedAttachment, instagramStoryAttachment } =
      sails.helpers.utils.filterAttachmentsBySize(attachments);

    const results = [];

    if (instagramFeedAttachment && publishSettings.enableFeed) {
      const feedImageUrl = sails.helpers.utils.buildStorjUrl(instagramFeedAttachment);
      if (feedImageUrl) {
        const feedResult = await sails.helpers.utils.postToPostiz(
          feedImageUrl,
          `${baseDescription} #veiculos #carros #automoveis`,
          'post',
          postizIntegrationId,
        );
        results.push({ type: 'feed', ...feedResult });
      }
    }

    if (instagramStoryAttachment && publishSettings.enableStory) {
      const storyImageUrl = sails.helpers.utils.buildStorjUrl(instagramStoryAttachment);
      if (storyImageUrl) {
        const storyResult = await sails.helpers.utils.postToPostiz(
          storyImageUrl,
          `${baseDescription} #veiculos #carros #automoveis`,
          'story',
          postizIntegrationId,
        );
        results.push({ type: 'story', ...storyResult });
      }
    }

    let reelVideoAttachment = null;
    let reelImageUrl = null;

    if (instagramStoryAttachment && publishSettings.enableReels) {
      try {
        reelVideoAttachment = await sails.helpers.utils.convertImageToReel(
          instagramStoryAttachment,
          card,
        );

        if (reelVideoAttachment) {
          const reelVideoUrl = sails.helpers.utils.buildStorjUrl(reelVideoAttachment);

          if (reelVideoUrl) {
            const reelResult = await sails.helpers.utils.postToPostiz(
              reelVideoUrl,
              `${baseDescription} #veiculos #carros #automoveis #reels`,
              'post',
              postizIntegrationId,
            );
            results.push({ type: 'reel', ...reelResult });
            reelImageUrl = reelVideoUrl;
          }
        }
      } catch (error) {
        sails.log.error('Erro ao criar/postar reel:', error);
        results.push({
          type: 'reel',
          success: false,
          error: `Failed to create reel: ${error.message}`,
        });
      }
    }

    return {
      results,
      instagramFeedAttachment,
      instagramStoryAttachment,
      instagramReelAttachment: reelVideoAttachment,
      instagramFeedImageUrl: sails.helpers.utils.buildStorjUrl(instagramFeedAttachment),
      instagramStoryImageUrl: sails.helpers.utils.buildStorjUrl(instagramStoryAttachment),
      instagramReelVideoUrl: reelImageUrl,
    };
  },
};
