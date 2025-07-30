import React from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import IntegrationCard from './IntegrationCard';

const ActiveIntegrationsList = React.memo(
  ({ integrations, loading, error, onToggleIntegration, onDeleteIntegration }) => {
    const [t] = useTranslation();

    if (loading) {
      return (
        <Message info>
          <Message.Header>{t('common.loading')}</Message.Header>
          <p>{t('common.loadingActiveIntegrations')}</p>
        </Message>
      );
    }

    if (error) {
      return (
        <Message negative>
          <Message.Header>{t('common.error')}</Message.Header>
          <p>{error.message || t('common.errorLoadingActiveIntegrations')}</p>
        </Message>
      );
    }

    if (integrations && integrations.length > 0) {
      return (
        <div>
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onToggle={onToggleIntegration}
              onDelete={onDeleteIntegration}
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
  },
);

ActiveIntegrationsList.propTypes = {
  integrations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      disabled: PropTypes.bool.isRequired,
      integrationType: PropTypes.string,
      config: PropTypes.shape({
        name: PropTypes.string,
        picture: PropTypes.string,
        profile: PropTypes.string,
        publishSettings: PropTypes.shape({
          enableFeed: PropTypes.bool,
          enableReels: PropTypes.bool,
          enableStory: PropTypes.bool,
        }),
      }),
    }),
  ),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onToggleIntegration: PropTypes.func.isRequired,
  onDeleteIntegration: PropTypes.func.isRequired,
};

ActiveIntegrationsList.defaultProps = {
  integrations: null,
  error: null,
};

export default ActiveIntegrationsList;
