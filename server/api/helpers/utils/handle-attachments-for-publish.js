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
    postizIntegrationId: {
      type: 'string',
      description: 'Postiz integration ID to use for publishing',
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
    const { card, postizIntegrationId } = inputs;

    const cardNameWithoutPlate = sails.helpers.utils.formatVehicleName(card.name);

    const { instagramFeedAttachment, instagramStoryAttachment } =
      sails.helpers.utils.filterAttachmentsBySize(inputs.attachments);

    const results = [];

    if (!postizIntegrationId) {
      sails.log.warn('No Postiz integration ID found for project:', project.id);
      return { success: false, error: 'No integration configured' };
    }

    if (instagramFeedAttachment) {
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

    if (instagramStoryAttachment) {
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

    if (instagramStoryAttachment) {
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
