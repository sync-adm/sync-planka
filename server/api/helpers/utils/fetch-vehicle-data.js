module.exports = {
  inputs: {
    vehicleId: {
      type: 'string',
      description: 'Vehicle ID to fetch from inventory',
      required: true,
    },
    subdomain: {
      type: 'string',
      description: 'Project subdomain for AWS S3 inventory lookup',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Vehicle data fetched successfully or null if not found',
    },
  },

  sync: false,

  async fn(inputs) {
    const { vehicleId, subdomain } = inputs;

    try {
      const inventory = await sails.helpers.utils.fetchInventoryData(subdomain);
      const vehicleData = inventory.find((vehicle) => vehicle.id.toString() === vehicleId);

      if (vehicleData) {
        return vehicleData;
      }

      sails.log.warn(`Vehicle ID ${vehicleId} not found in inventory`);
      return null;
    } catch (error) {
      sails.log.warn('Failed to fetch vehicle data:', error);
      return null;
    }
  },
};
