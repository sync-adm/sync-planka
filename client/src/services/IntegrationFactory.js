import integrations from '../integrations';

/**
 * Retorna a função de build de URL correspondente ao tipo.
 * @param {string} integrationType
 * @returns {function(object, string): string}
 */
function getIntegrationStrategy(integrationType) {
  const strategy = integrations[integrationType];
  if (!strategy) {
    throw new Error(`Tipo de integração desconhecido: ${integrationType}`);
  }
  return strategy;
}

/**
 * Gera a URL do veículo baseado no tipo de integração.
 * @param {{ id: string|number }} vehicle
 * @param {string} integrationType
 * @param {string} domain - Domínio do projeto
 * @returns {string}
 */
export function buildVehicleUrl(vehicle, integrationType, domain) {
  const strategy = getIntegrationStrategy(integrationType);
  return strategy(vehicle, domain);
}

export { getIntegrationStrategy };
