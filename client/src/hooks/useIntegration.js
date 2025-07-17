import { useMemo } from 'react';
import { buildVehicleUrl } from '../services/IntegrationFactory';

/**
 * Hook para obter a URL de um veículo baseado em integração.
 * @param {{ id: string|number }} vehicle
 * @param {string} integrationType
 * @param {string} domain
 */
export default function useIntegration(vehicle, integrationType, domain) {
  const url = useMemo(() => {
    if (!vehicle || !integrationType || !domain) {
      return '';
    }
    return buildVehicleUrl(vehicle, integrationType, domain);
  }, [vehicle, integrationType, domain]);

  return url;
}
