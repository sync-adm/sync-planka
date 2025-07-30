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
    project: {
      type: 'ref',
      description: 'Project record for logging purposes',
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
    const { card, postizIntegration, project } = inputs;

    if (!postizIntegration || !postizIntegration.config || !postizIntegration.config.id) {
      sails.log.warn('No valid Postiz integration found for project:', project.id);
      return { success: false, error: 'No integration configured' };
    }

    const postizIntegrationId = postizIntegration.config.id;
    const publishSettings = postizIntegration.config.publishSettings || {
      enableFeed: true,
      enableReels: true,
      enableStory: true,
    };

    const vehicleId = sails.helpers.utils.extractVehicleId(card.description);

    let vehicleData = null;
    if (vehicleId && project.subdomain) {
      vehicleData = await sails.helpers.utils.fetchVehicleData(vehicleId, project.subdomain);
    } else if (!project.subdomain) {
      sails.log.warn('No project subdomain available for inventory lookup');
    }

    let baseDescription = publishSettings.defaultDescription
      ? publishSettings.defaultDescription.trim()
      : sails.helpers.utils.formatVehicleName(card.name);

    if (publishSettings.defaultDescription) {
      baseDescription = sails.helpers.utils.replaceVehicleVariables(baseDescription, vehicleData);
    }

    const publishResults = await sails.helpers.utils.publishToInstagram.with({
      attachments: inputs.attachments,
      baseDescription,
      publishSettings,
      postizIntegrationId,
      card,
    });

    return {
      card: baseDescription,
      ...publishResults,
    };
  },
};
