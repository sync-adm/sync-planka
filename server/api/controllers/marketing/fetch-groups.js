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

      const urlString = `${evolutionBaseAddress}/group/fetchAllGroups/${evolutionInstance}?getParticipants=${inputs.getParticipants}`;

      sails.log.info(`Buscando grupos da Evolution API: ${urlString}`);

      const response = await fetch(urlString, {
        method: 'GET',
        headers: {
          apikey: evolutionApiKey,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        const errorData = await response.text();
        let parsedErrorData;

        try {
          parsedErrorData = JSON.parse(errorData);
        } catch (e) {
          parsedErrorData = errorData;
        }

        const errorObj = new Error(`HTTP Error: ${response.status}`);
        errorObj.response = {
          status: response.status,
          data: parsedErrorData,
        };
        throw errorObj;
      }

      const responseData = await response.json();

      sails.log.info(`Grupos encontrados: ${responseData ? responseData.length : 0}`);

      return exits.success({
        groups: responseData || [],
        total: responseData ? responseData.length : 0,
        instance: evolutionInstance,
      });
    } catch (error) {
      sails.log.error('Erro ao buscar grupos da Evolution API:', error);

      if (
        error.name === 'AbortError' ||
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
