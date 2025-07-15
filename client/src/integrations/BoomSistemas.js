/**
 * Monta a URL de um veículo para integração Boom Sistemas.
 * @param {{ id: string|number }} vehicle
 * @param {string} domain - Domínio do projeto
 * @returns {string}
 */
function buildBoomUrl(vehicle, domain) {
  return `https://${domain}/inventory/${vehicle.id}`;
}

export default buildBoomUrl;
