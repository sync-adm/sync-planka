import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Message } from 'semantic-ui-react';

import IntegrationCard from './IntegrationCard';

function ActiveIntegrationsList({
  projectIntegrations,
  projectIntegrationsLoading,
  onToggleIntegration,
  onDeleteIntegration,
}) {
  const [t] = useTranslation();

  if (projectIntegrationsLoading) {
    return (
      <Message info>
        <Message.Header>{t('common.loading')}</Message.Header>
        <p>{t('common.loadingActiveIntegrations')}</p>
      </Message>
    );
  }

  if (projectIntegrations && projectIntegrations.length > 0) {
    return (
      <div>
        {projectIntegrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onToggle={() => onToggleIntegration(integration)}
            onDelete={() => onDeleteIntegration(integration)}
          />
        ))}
      </div>
    );
  }

  return (
    <Message info>
      <Message.Header>{t('common.noActiveIntegrations')}</Message.Header>
      <p>{t('common.noActiveIntegrationsDescription')}</p>
    </Message>
  );
}

ActiveIntegrationsList.propTypes = {
  projectIntegrations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ),
  projectIntegrationsLoading: PropTypes.bool.isRequired,
  onToggleIntegration: PropTypes.func.isRequired,
  onDeleteIntegration: PropTypes.func.isRequired,
};

ActiveIntegrationsList.defaultProps = {
  projectIntegrations: null,
};

export default ActiveIntegrationsList;
