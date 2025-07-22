const https = require('https');
const { URL } = require('url');

module.exports = {
  friendlyName: 'Send text message via Evolution API',

  description: 'Envia uma mensagem de texto usando a Evolution API configurada.',

  inputs: {
    number: {
      type: 'string',
      required: true,
      description: 'Número do WhatsApp (com código do país, sem símbolos)',
      example: '5511950784802',
    },
    text: {
      type: 'string',
      required: true,
      description: 'Texto da mensagem a ser enviada',
      maxLength: 4096,
    },
  },

  exits: {
    success: {
      description: 'Mensagem enviada com sucesso.',
    },
    serverError: {
      description: 'Erro interno do servidor.',
    },
    badRequest: {
      description: 'Parâmetros inválidos ou configuração incompleta.',
    },
  },

  fn: async function sendTextMessage(inputs, exits) {
    try {
      const evolutionInstance = process.env.EVOLUTION_INSTANCE;
      const evolutionApiKey = process.env.EVOLUTION_API_KEY;
      const evolutionBaseAddress = process.env.EVOLUTION_BASE_ADDRESS;

      if (!evolutionInstance || !evolutionApiKey || !evolutionBaseAddress) {
        return exits.badRequest({
          message: 'Configuração da Evolution API incompleta. Verifique as variáveis de ambiente.',
          missingVars: {
            instance: !evolutionInstance,
            apiKey: !evolutionApiKey,
            baseAddress: !evolutionBaseAddress,
          },
        });
      }

      const cleanNumber = inputs.number.replace(/\D/g, '');
      if (!cleanNumber || cleanNumber.length < 10) {
        return exits.badRequest({
          message: 'Número de telefone inválido. Deve conter pelo menos 10 dígitos.',
          provided: inputs.number,
          cleaned: cleanNumber,
        });
      }

      const messageData = {
        number: `55${cleanNumber}`,
        text: inputs.text.trim(),
      };

      const urlString = `${evolutionBaseAddress}/message/sendText/${evolutionInstance}`;
      const url = new URL(urlString);

      sails.log.info(`Enviando mensagem via Evolution API para: ${cleanNumber}`);

      const responseData = await new Promise((resolve, reject) => {
        const postData = JSON.stringify(messageData);

        const options = {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            apikey: evolutionApiKey,
          },
          timeout: 30000,
        };

        const req = https.request(options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            try {
              if (res.statusCode >= 200 && res.statusCode < 300) {
                resolve({
                  data: JSON.parse(data),
                  statusCode: res.statusCode,
                });
              } else {
                const errorObj = new Error(`HTTP Error: ${res.statusCode}`);
                errorObj.response = {
                  status: res.statusCode,
                  data: JSON.parse(data),
                };
                reject(errorObj);
              }
            } catch (parseError) {
              const errorObj = new Error(`Parse Error: ${parseError.message}`);
              errorObj.response = {
                status: res.statusCode,
                data,
              };
              reject(errorObj);
            }
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });

        req.write(postData);
        req.end();
      });

      sails.log.info('Mensagem enviada com sucesso via Evolution API');

      return exits.success({
        success: true,
        message: 'Mensagem enviada com sucesso',
        data: responseData.data,
        sentTo: cleanNumber,
        instance: evolutionInstance,
      });
    } catch (error) {
      sails.log.error('Erro ao enviar mensagem via Evolution API:', error);

      // Tratar diferentes tipos de erro
      if (
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.message === 'Request timeout'
      ) {
        return exits.serverError({
          message: 'Não foi possível conectar com a Evolution API.',
          error: 'CONNECTION_ERROR',
          details: error.message,
        });
      }

      if (error.response) {
        // Erro de resposta da API
        const { status, data } = error.response;

        if (status === 401) {
          return exits.badRequest({
            message: 'API Key inválida para a Evolution API.',
            error: 'UNAUTHORIZED',
            details: data,
          });
        }

        if (status === 404) {
          return exits.badRequest({
            message: 'Instância não encontrada na Evolution API.',
            error: 'INSTANCE_NOT_FOUND',
            details: data,
          });
        }

        if (status === 400) {
          return exits.badRequest({
            message: 'Dados da mensagem inválidos.',
            error: 'INVALID_MESSAGE_DATA',
            details: data,
          });
        }

        return exits.serverError({
          message: 'Erro na Evolution API.',
          error: 'API_ERROR',
          status,
          details: data,
        });
      }

      // Erro genérico
      return exits.serverError({
        message: 'Erro interno ao enviar mensagem.',
        error: 'INTERNAL_ERROR',
        details: error.message,
      });
    }
  },
};
