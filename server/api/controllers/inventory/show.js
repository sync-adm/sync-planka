const Errors = {
  INVENTORY_NOT_FOUND: {
    inventoryNotFound: 'Inventory not found',
  },
};

module.exports = {
  inputs: {
    subdomain: {
      required: true,
      type: 'string',
      description: 'The subdomain for which to retrieve inventory data',
    },
  },

  exits: {
    projectNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    try {
      const inventory = await sails.helpers.utils.fetchInventoryData(inputs.subdomain);

      return {
        status: 200,
        body: {
          message: 'Inventory data for subdomain',
          subdomain: inputs.subdomain,
          data: inventory,
        },
      };
    } catch (error) {
      sails.log.error('Failed to fetch inventory:', error);
      throw Errors.INVENTORY_NOT_FOUND;
    }
  },
};
