module.exports = {
  inputs: {
    subdomain: {
      type: 'string',
      description: 'Project subdomain for AWS S3 inventory lookup',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Inventory data fetched successfully',
    },
    fetchError: {
      description: 'Failed to fetch inventory data',
    },
  },

  sync: false,

  async fn(inputs) {
    const { subdomain } = inputs;

    const BUCKET_NAME = 'sync-platforms';
    const REGION = 'sa-east-1';
    const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${subdomain}/inventory/data.json`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const inventory = await res.json();

      if (!inventory) {
        throw new Error('Empty inventory data');
      }

      sails.log.info(`Successfully fetched inventory data for subdomain: ${subdomain}`);
      return inventory;
    } catch (error) {
      sails.log.error(`Failed to fetch inventory for subdomain ${subdomain}:`, error);
      throw { fetchError: error.message };
    }
  },
};
