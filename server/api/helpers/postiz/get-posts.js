module.exports = {
  friendlyName: 'Get Posts',

  description: 'Fetch available posts from Postiz API.',

  inputs: {
    integrationId: {
      type: 'string',
      required: true,
      description: 'Integration ID to get posts from',
    },
  },

  async fn(inputs) {
    const { integrationId } = inputs;

    if (!integrationId) {
      throw new Error('Integration ID not found');
    }

    const postizBaseUrl = process.env.POSTIZ_BASE_ADDRESS;
    const postizToken = process.env.POSTIZ_API_KEY;

    try {
      const response = await fetch(
        `${postizBaseUrl}/api/public/v1/integration?integrationId=${integrationId}&limit=20`,
        {
          method: 'GET',
          headers: {
            Authorization: postizToken,
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      sails.log.error('Error fetching posts:', error);
      throw new Error(`Failed to fetch posts from Postiz: ${error.message}`);
    }
  },
};
