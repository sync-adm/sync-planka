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
    const BUCKET_NAME = 'sync-platforms';
    const REGION = 'sa-east-1';

    const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${inputs.subdomain}/inventory/data.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const inventory = await res.json();

    if (!inventory) {
      throw Errors.INVENTORY_NOT_FOUND;
    }

    return {
      status: 200,
      body: {
        message: 'Inventory data for subdomain',
        subdomain: inputs.subdomain,
        data: inventory,
      },
    };
  },
};
