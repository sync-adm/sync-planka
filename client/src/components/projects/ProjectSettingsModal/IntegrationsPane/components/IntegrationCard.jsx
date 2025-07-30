import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Image, Button } from 'semantic-ui-react';

import styles from '../IntegrationsPane.module.scss';

function IntegrationCard({ integration, onToggle, onDelete }) {
  const [t] = useTranslation();

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
          src={
            integration.config?.picture ||
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDEzLjVDOS4zNDUxIDEzLjUgNCAxNC44MjI1IDQgMTcuNVYyMEgyMFYxNy41QzIwIDE0LjgyMjUgMTQuNjU0OSAxMy41IDEyIDEzLjVaIiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo='
          }
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
              <strong>{t('common.enabled')}:</strong>{' '}
              {[
                integration.config.publishSettings.enableFeed && 'Feed',
                integration.config.publishSettings.enableReels && 'Reels',
                integration.config.publishSettings.enableStory && 'Story',
              ]
                .filter(Boolean)
                .join(', ') || t('common.none')}
              {integration.config.publishSettings.defaultDescription && (
                <div style={{ marginTop: '4px' }}>
                  <strong>{t('common.defaultDescription')}:</strong>{' '}
                  <em>
                    {integration.config.publishSettings.defaultDescription.length > 50
                      ? `${integration.config.publishSettings.defaultDescription.substring(0, 50)}...`
                      : integration.config.publishSettings.defaultDescription}
                  </em>
                </div>
              )}
            </div>
          )}
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <Button basic color={integration.disabled ? 'green' : 'orange'} onClick={onToggle}>
            {integration.disabled ? 'Enable' : 'Disable'}
          </Button>
          <Button basic color="red" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}

export default IntegrationCard;
