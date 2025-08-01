module.exports = {
  friendlyName: 'Index design',

  description: 'List all requests with pagination.',

  inputs: {
    page: {
      type: 'number',
      defaultsTo: 1,
      description: 'Página atual',
    },
    limit: {
      type: 'number',
      defaultsTo: 20,
      description: 'Número de itens por página',
    },
    listNameContains: {
      type: 'string',
      defaultsTo: 'Solici',
      description: 'Substring para buscar nos nomes das listas',
    },
    includeAllFields: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Se deve incluir todos os campos na resposta',
    },
  },

  exits: {
    success: {
      description: 'Lista de pedidos recuperada com sucesso',
    },
  },

  async fn(inputs, exits) {
    const page = Math.max(1, inputs.page || 1);
    const limit = Math.max(1, Math.min(100, inputs.limit || 20));
    const listNameContains = inputs.listNameContains || 'Solici';
    const includeAllFields = inputs.includeAllFields || false;

    const response = await sails.helpers.syncInternal.findCardsByListName(
      listNameContains,
      page,
      limit,
      includeAllFields,
    );

    return exits.success(response);
  },
};
