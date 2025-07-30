module.exports = {
  inputs: {
    cardName: {
      type: 'string',
      description: 'Card name with vehicle plate',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Vehicle name without plate',
    },
  },

  sync: true,

  fn(inputs) {
    return inputs.cardName.replace(/^[^-]+-\s*/, '').trim();
  },
};
