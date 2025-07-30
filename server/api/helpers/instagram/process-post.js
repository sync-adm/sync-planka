module.exports = {
  friendlyName: 'Process Instagram post',

  description: 'Process a single Instagram post from webhook data',

  inputs: {
    postData: {
      type: 'ref',
      description: 'The Instagram post data object',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Post processed successfully',
    },
    serverError: {
      statusCode: 500,
      description: 'Server error occurred',
    },
  },

  async fn(inputs) {
    try {
      const { postData } = inputs;
      const { id, content, publishDate, releaseURL, state, integration } = postData;

      // Aqui podemos implementar a lógica específica para processar cada post
      // Por exemplo:
      // - Atualizar status de cards relacionadas
      // - Salvar informações de publicação no banco
      // - Notificar usuários sobre publicações bem-sucedidas
      // - Integrar com outros sistemas

      // eslint-disable-next-line no-console
      console.log('Instagram post processed successfully:', {
        postId: id,
        content: content && content.length > 100 ? `${content.substring(0, 100)}...` : content,
        publishDate,
        releaseURL,
        state,
        integrationName: integration && integration.name,
      });

      return {
        success: true,
        postId: id,
        message: 'Post processed successfully',
      };
    } catch (error) {
      return exits.serverError({
        error: 'Internal server error',
        message: error.message,
      });
    }
  },
};
