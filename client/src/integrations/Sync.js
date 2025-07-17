import { slugify } from '../utils/urlHelpers';

/**
 * Monta a URL de um veículo para integração Sync.
 * @param {{ id: string|number }} vehicle
 * @param {string} domain - Domínio do projeto
 * @returns {string}
 */
function buildSyncUrl(vehicle, domain) {
  if (!vehicle || !domain) return '/';
  const base = 'estoque';
  const inventoryType = 'carro-e-moto';
  const region = 'brasil';

  const vehicleMake = vehicle.make;
  const vehicleModel = vehicle.model;
  const vehicleVersion = vehicle.version;
  const vehicleTransmission = vehicle.transmission;
  const vehicleModelYear = vehicle.modelYear;
  const vehicleColor = vehicle.color;
  const vehicleId = vehicle.id;

  const slug = `${vehicleMake}-${vehicleModel}-${vehicleVersion}-${vehicleTransmission}-${vehicleModelYear}-${vehicleColor}`;

  const formatedSlug = slugify(slug, { lower: true });
  return `https://${domain}/${base}/${inventoryType}/${region}/${formatedSlug}:${vehicleId}`;
}

export default buildSyncUrl;
