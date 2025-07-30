module.exports = {
  inputs: {
    cardDescription: {
      type: 'string',
      description: 'Card description containing potential vehicle ID',
      required: false,
    },
  },

  exits: {
    success: {
      description: 'Extracted vehicle ID or null if not found',
    },
  },

  sync: true,

  fn(inputs) {
    const { cardDescription } = inputs;

    if (!cardDescription) {
      sails.log.info('No card description available for vehicle ID extraction');
      return null;
    }

    const vehicleIdMatch = cardDescription.match(
      /ID:\s*([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\s*$/m,
    );

    let vehicleId = null;

    if (!vehicleIdMatch) {
      sails.log.info(
        'No vehicle ID found in card description. Expected format: "ID: {vehicleId}" where vehicleId is a UUID',
      );
      vehicleId =
        cardDescription.split('ID: ')[1] !== undefined
          ? cardDescription.split('ID: ')[1].trim()
          : null;
    }

    vehicleId = vehicleIdMatch && vehicleIdMatch[1] !== undefined ? vehicleIdMatch[1] : vehicleId;
    sails.log.info(`Extracted vehicle ID: ${vehicleId} from description`);
    return vehicleId;
  },
};
