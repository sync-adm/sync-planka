module.exports = {
  inputs: {
    attachments: {
      type: 'ref',
      description: 'Array of attachment records to filter',
      required: true,
    },
    card: {
      type: 'ref',
      description: 'Card record to associate with the attachments',
      required: true,
    },
    postizIntegration: {
      type: 'ref',
      description: 'ProjectIntegration record with Postiz configuration',
      required: true,
    },
    projectId: {
      type: 'string',
      description: 'Project ID for logging purposes',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Result of publishing images to Instagram',
    },
  },

  sync: false,

  async fn(inputs) {
    const { card, postizIntegration, projectId } = inputs;

    const cardNameWithoutPlate = sails.helpers.utils.formatVehicleName(card.name);

    const { instagramFeedAttachment, instagramStoryAttachment } =
      sails.helpers.utils.filterAttachmentsBySize(inputs.attachments);

    const results = [];

    if (!postizIntegration || !postizIntegration.config || !postizIntegration.config.id) {
      sails.log.warn('No valid Postiz integration found for project:', projectId);
      return { success: false, error: 'No integration configured' };
    }

    const postizIntegrationId = postizIntegration.config.id;
    const publishSettings = postizIntegration.config.publishSettings || {
      enableFeed: true,
      enableReels: true,
      enableStory: true,
    };

    if (instagramFeedAttachment && publishSettings.enableFeed) {
      const feedImageUrl = sails.helpers.utils.buildStorjUrl(instagramFeedAttachment);
      if (feedImageUrl) {
        const feedResult = await sails.helpers.utils.postToPostiz(
          feedImageUrl,
          `${cardNameWithoutPlate} #veiculos #carros #automoveis`,
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
          `${cardNameWithoutPlate} #veiculos #carros #automoveis`,
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
              `${cardNameWithoutPlate} #veiculos #carros #automoveis #reels`,
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
      card: cardNameWithoutPlate,
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
