import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import styles from './IntegrationsPane.module.scss';

const IntegrationCard = React.memo(({ integration, onToggle, onDelete }) => {
  const [t] = useTranslation();

  const handleToggle = useCallback(() => {
    onToggle(integration);
  }, [integration, onToggle]);

  const handleDelete = useCallback(() => {
    onDelete(integration);
  }, [integration, onDelete]);

  const getDefaultImage = () =>
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDEzLjVDOS4zNDUxIDEzLjUgNCAxNC44MjI1IDQgMTcuNVYyMEgyMFYxNy41QzIwIDE0LjgyMjUgMTQuNjU0OSAxMy41IDEyIDEzLjVaIiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=';

  const getEnabledSettings = () => {
    if (integration.integrationType !== 'instagram' || !integration.config?.publishSettings) {
      return null;
    }

    const { publishSettings } = integration.config;
    const enabledFeatures = [
      publishSettings.enableFeed && 'Feed',
      publishSettings.enableReels && 'Reels',
      publishSettings.enableStory && 'Story',
    ]
      .filter(Boolean)
      .join(', ');

    return enabledFeatures || t('common.none');
  };

  return (
    <Card
      key={integration.id}
      className={styles.integrationCard}
      fluid
      style={{ marginBottom: '10px' }}
    >
      <Card.Content>
        <Image
          floated="left"
          size="tiny"
          src={integration.config?.picture || getDefaultImage()}
          avatar
        />
        <div
          className={styles.statusIndicator}
          style={{
            backgroundColor: integration.disabled ? '#f2711c' : '#21ba45',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            position: 'absolute',
            top: '15px',
            right: '15px',
          }}
        />
        <Card.Header>{integration.config?.name || t('common.unknownIntegration')}</Card.Header>
        <Card.Meta>
          <span className="category">
            {integration.integrationType?.toUpperCase()} •{' '}
            {integration.config?.profile ? `@${integration.config.profile}` : ''}
          </span>
          {integration.integrationType === 'instagram' && integration.config?.publishSettings && (
            <div style={{ marginTop: '8px', fontSize: '0.9em', color: '#666' }}>
              <strong>{t('common.enabled')}:</strong> {getEnabledSettings()}
            </div>
          )}
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <Button basic color={integration.disabled ? 'green' : 'orange'} onClick={handleToggle}>
            {integration.disabled ? 'Enable' : 'Disable'}
          </Button>
          <Button basic color="red" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
});

IntegrationCard.propTypes = {
  integration: PropTypes.shape({
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
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default IntegrationCard;
