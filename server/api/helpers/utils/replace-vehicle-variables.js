module.exports = {
  inputs: {
    description: {
      type: 'string',
      description: 'Description containing variables to replace',
      required: true,
    },
    vehicleData: {
      type: 'ref',
      description: 'Vehicle data object containing replacement values',
      required: false,
    },
  },

  exits: {
    success: {
      description: 'Description with variables replaced',
    },
  },

  sync: true,

  fn(inputs) {
    const { description, vehicleData } = inputs;

    if (!vehicleData) {
      sails.log.info('No vehicle data available for variable replacement');
      return description;
    }

    const formatKilometers = (km) => {
      if (!km) return '';
      return km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const originalDescription = description;
    const replacedDescription = description
      .replace(/\[marca\]/gi, vehicleData.make || '')
      .replace(/\[modelo\]/gi, vehicleData.model || '')
      .replace(/\[versao\]/gi, vehicleData.version || '')
      .replace(/\[versão\]/gi, vehicleData.version || '')
      .replace(/\[cor\]/gi, vehicleData.color || '')
      .replace(/\[combustivel\]/gi, vehicleData.fuel || '')
      .replace(/\[combustível\]/gi, vehicleData.fuel || '')
      .replace(/\[transmissao\]/gi, vehicleData.transmission || '')
      .replace(/\[transmissão\]/gi, vehicleData.transmission || '')
      .replace(/\[portas\]/gi, vehicleData.doors ? vehicleData.doors.toString() : '')
      .replace(/\[km\]/gi, formatKilometers(vehicleData.kilometers))
      .replace(/\[quilometragem\]/gi, formatKilometers(vehicleData.kilometers))
      .replace(/\[preco\]/gi, vehicleData.price ? vehicleData.price.toString() : '')
      .replace(/\[preço\]/gi, vehicleData.price ? vehicleData.price.toString() : '')
      .replace(/\[categoria\]/gi, vehicleData.category || '')
      .replace(/\[ano\]/gi, vehicleData.modelYear ? vehicleData.modelYear.toString() : '')
      .replace(/\[anoModelo\]/gi, vehicleData.modelYear ? vehicleData.modelYear.toString() : '')
      .replace(
        /\[anoFabricacao\]/gi,
        vehicleData.manufactureYear ? vehicleData.manufactureYear.toString() : '',
      )
      .replace(
        /\[anoFabricação\]/gi,
        vehicleData.manufactureYear ? vehicleData.manufactureYear.toString() : '',
      )
      .replace(/\[blindado\]/gi, vehicleData.isArmored ? 'Sim' : 'Não')
      .replace(/\[chaveReserva\]/gi, vehicleData.hasExtraKey ? 'Sim' : 'Não')
      .replace(/\[manual\]/gi, vehicleData.hasManual ? 'Sim' : 'Não');

    if (originalDescription !== replacedDescription) {
      sails.log.info('Variables replaced in description:', {
        original: originalDescription,
        replaced: replacedDescription,
      });
    }

    return replacedDescription;
  },
};
