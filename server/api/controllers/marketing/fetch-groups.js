const https = require('https');
const { URL } = require('url');

module.exports = {
  friendlyName: 'Fetch Evolution API Groups',

  description: 'Busca todos os grupos da instância Evolution API configurada.',

  inputs: {
    getParticipants: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Se deve incluir os participantes dos grupos',
    },
  },

  exits: {
    success: {
      description: 'Grupos foram buscados com sucesso.',
    },
    serverError: {
      description: 'Erro interno do servidor.',
    },
    badRequest: {
      description: 'Parâmetros inválidos ou configuração incompleta.',
    },
  },

  fn: async function fetchGroups(inputs, exits) {
    try {
      // Verificar se as variáveis de ambiente estão configuradas
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

      // Montar a URL da API
      const urlString = `${evolutionBaseAddress}/group/fetchAllGroups/${evolutionInstance}?getParticipants=${inputs.getParticipants}`;
      const url = new URL(urlString);

      sails.log.info(`Buscando grupos da Evolution API: ${urlString}`);

      // Fazer a requisição usando https nativo
      const responseData = await new Promise((resolve, reject) => {
        const options = {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname + url.search,
          method: 'GET',
          headers: {
            apikey: evolutionApiKey,
            'Content-Type': 'application/json',
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

        req.end();
      });

      sails.log.info(`Grupos encontrados: ${responseData.data ? responseData.data.length : 0}`);

      return exits.success({
        groups: responseData.data || [],
        total: responseData.data ? responseData.data.length : 0,
        instance: evolutionInstance,
      });
    } catch (error) {
      sails.log.error('Erro ao buscar grupos da Evolution API:', error);

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

        return exits.serverError({
          message: 'Erro na Evolution API.',
          error: 'API_ERROR',
          status,
          details: data,
        });
      }

      return exits.serverError({
        message: 'Erro interno ao buscar grupos.',
        error: 'INTERNAL_ERROR',
        details: error.message,
      });
    }
  },
};
