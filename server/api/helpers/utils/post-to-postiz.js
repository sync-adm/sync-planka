module.exports = {
  inputs: {
    imageUrl: {
      type: 'string',
      description: 'URL of the image to post',
      required: true,
    },
    content: {
      type: 'string',
      description: 'Text content for the post',
      required: true,
    },
    postType: {
      type: 'string',
      description: 'Type of post (post, story)',
      isIn: ['post', 'story'],
      defaultsTo: 'post',
    },
    integrationId: {
      type: 'string',
      description: 'Postiz integration ID',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Postiz API response',
    },
  },

  sync: false,

  async fn(inputs) {
    const postizApiKey = process.env.POSTIZ_API_KEY;
    // const postizApiUrl = `${process.env.POSTIZ_BASE_ADDRESS}/api/public/v1/posts`;
    const teste = 'https://n8n.sync.com.br/webhook/5159895e-c5ed-40c6-8c24-841b9f459837';

    const payload = {
      type: 'now',
      shortLink: false,
      date: new Date().toISOString(),
      tags: [],
      posts: [
        {
          integration: {
            id: inputs.integrationId,
          },
          value: [
            {
              content: inputs.content,
              image: [
                {
                  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  path: inputs.imageUrl,
                },
              ],
            },
          ],
          group: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          settings: {
            post_type: inputs.postType,
          },
        },
      ],
    };

    try {
      const response = await fetch(teste, {
        method: 'POST',
        headers: {
          Authorization: postizApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return { success: true, data: result };
    } catch (error) {
      sails.log.error('Erro ao postar no Postiz:', error);
      return { success: false, error: error.message };
    }
  },
};
