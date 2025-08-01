/**
 * Project.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const Types = {
  PRIVATE: 'private',
  SHARED: 'shared',
};

const BackgroundTypes = {
  GRADIENT: 'gradient',
  IMAGE: 'image',
};

const BACKGROUND_GRADIENTS = [
  'old-lime',
  'ocean-dive',
  'tzepesch-style',
  'jungle-mesh',
  'strawberry-dust',
  'purple-rose',
  'sun-scream',
  'warm-rust',
  'sky-change',
  'green-eyes',
  'blue-xchange',
  'blood-orange',
  'sour-peel',
  'green-ninja',
  'algae-green',
  'coral-reef',
  'steel-grey',
  'heat-waves',
  'velvet-lounge',
  'purple-rain',
  'blue-steel',
  'blueish-curve',
  'prism-light',
  'green-mist',
  'red-curtain',
];

module.exports = {
  Types,
  BackgroundTypes,
  BACKGROUND_GRADIENTS,

  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      isNotEmptyString: true,
      allowNull: true,
    },
    subdomain: {
      type: 'string',
      isNotEmptyString: true,
      allowNull: true,
      required: false,
    },
    domain: {
      type: 'string',
      required: true,
      description: 'Domínio personalizado do site',
    },
    integrationType: {
      type: 'string',
      isIn: ['Sync', 'Boom Sistemas'],
      required: true,
      description: 'Tipo de integração',
      columnName: 'integration_type',
    },
    whatsappTarget: {
      type: 'string',
      columnName: 'whatsapp_target',
      allowNull: true,
      description: 'Número de WhatsApp para direcionar mensagens',
    },
    monthlyArtLimit: {
      type: 'number',
      columnName: 'monthly_art_limit',
      allowNull: true,
      description: 'Limite mensal de artes',
    },
    backgroundType: {
      type: 'string',
      isIn: Object.values(BackgroundTypes),
      allowNull: true,
      columnName: 'background_type',
    },
    backgroundGradient: {
      type: 'string',
      isIn: BACKGROUND_GRADIENTS,
      allowNull: true,
      columnName: 'background_gradient',
    },
    isHidden: {
      type: 'boolean',
      defaultsTo: false, // TODO: implement via normalizeValues?
      columnName: 'is_hidden',
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    ownerProjectManagerId: {
      model: 'ProjectManager',
      columnName: 'owner_project_manager_id',
    },
    backgroundImageId: {
      model: 'BackgroundImage',
      columnName: 'background_image_id',
    },
    managerUsers: {
      collection: 'User',
      via: 'projectId',
      through: 'ProjectManager',
    },
    boards: {
      collection: 'Board',
      via: 'projectId',
    },
    integrations: {
      collection: 'ProjectIntegration',
      via: 'projectId',
    },
  },
};
