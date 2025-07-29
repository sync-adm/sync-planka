module.exports = {
  friendlyName: 'Receive Instagram posts',

  description: 'Webhook to receive Instagram post information after successful publication',

  exits: {
    success: {
      statusCode: 200,
      description: 'Posts received successfully',
    },
    badRequest: {
      statusCode: 400,
      description: 'Invalid request data',
    },
    serverError: {
      statusCode: 500,
      description: 'Server error occurred',
    },
  },

  async fn(inputs, exits) {
    try {
      const requestData = this.req.body;

      let posts = Array.isArray(requestData) ? requestData : [];

      if (!Array.isArray(requestData) && requestData.body && Array.isArray(requestData.body)) {
        posts = requestData.body;
      }

      if (posts.length === 0) {
        return exits.badRequest({
          error: 'No posts data found',
        });
      }

      const processPromises = posts.map(async (post) => {
        try {
          const result = await sails.helpers.instagram.processPost(post);

          return { success: true, postId: post.id, result };
        } catch (error) {
          return { success: false, postId: post.id, error: error.message };
        }
      });

      const results = await Promise.allSettled(processPromises);
      const successCount = results.filter((result) => result.status === 'fulfilled').length;

      return exits.success({
        message: 'Posts received and processed successfully',
        postsCount: posts.length,
        successCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return exits.serverError({
        error: 'Internal server error',
        message: error.message,
      });
    }
  },
};
