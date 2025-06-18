module.exports = {
  sync: true,

  inputs: {
    language: {
      type: 'string',
      allowNull: true,
    },
  },

  fn(inputs) {
    const i18n = _.cloneDeep(sails.hooks.i18n);
    i18n.setLocale(inputs.language || sails.config.i18n.defaultLocale);

    return i18n.__.bind(i18n); // eslint-disable-line no-underscore-dangle
  },
};
