/**
 * ProjectIntegration.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const IntegrationTypes = {
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  TIKTOK: 'tiktok',
};

module.exports = {
  IntegrationTypes,

  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    integrationType: {
      type: 'string',
      isIn: Object.values(IntegrationTypes),
      required: true,
      columnName: 'integration_type',
      description: 'Tipo de integração de rede social',
    },
    disabled: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Se a integração está desabilitada',
    },
    config: {
      type: 'json',
      defaultsTo: {},
      description: 'Configurações específicas da integração',
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    projectId: {
      model: 'Project',
      required: true,
      columnName: 'project_id',
      description: 'Projeto ao qual a integração pertence',
    },
  },

  tableName: 'project_integrations',

  createdAt: {
    type: 'number',
    autoCreatedAt: true,
    columnName: 'created_at',
  },
  updatedAt: {
    type: 'number',
    autoUpdatedAt: true,
    columnName: 'updated_at',
  },
};
