/**
 * Monta a URL de um veículo para integração Sync.
 * @param {{ id: string|number }} vehicle
 * @param {string} domain - Domínio do projeto
 * @returns {string}
 */
function buildSyncUrl(vehicle, domain) {
  return `https://${domain}/stock/${vehicle.id}`;
}

export default buildSyncUrl;
