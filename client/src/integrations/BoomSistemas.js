import decryptAesCsharp from '../utils/crypto';
import { slugify } from '../utils/urlHelpers';

/**
 * Monta a URL de um veículo para integração Boom Sistemas,
 * descriptografando vehicle.id antes de montar.
 *
 * @param {{ id: string, version: string }} vehicle
 * @param {string} domain
 * @returns {string}
 */
export function buildBoomUrl(vehicle, domain) {
  // Constantes idênticas ao C#
  const KEY_HEX = 'e272b75673ed5041';
  const IV_HEX = 'a46a36f1r1f08d80';

  // Descriptografa o próprio vehicle.id
  const decryptedId = decryptAesCsharp(vehicle.id, KEY_HEX, IV_HEX);

  // Monta a URL final
  return `https://${domain}/veiculo/${decryptedId}/${slugify(vehicle.version)}`;
}
export default buildBoomUrl;
