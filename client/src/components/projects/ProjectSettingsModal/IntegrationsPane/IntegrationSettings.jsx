import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Header, Checkbox } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import styles from './IntegrationsPane.module.scss';

const IntegrationSettings = React.memo(
  ({ selectedIntegration, data, disabled, onCheckboxChange, onSave }) => {
    const [t] = useTranslation();

    const handleCheckboxChange = useCallback(
      (_, { name, checked }) => {
        onCheckboxChange(name, checked);
      },
      [onCheckboxChange],
    );

    if (!selectedIntegration) {
      return null;
    }

    return (
      <div className={styles.selectedIntegration}>
        <Header as="h5">{t('common.integrationSelected')}</Header>
        <p>
          <strong>{t('common.name')}:</strong> {selectedIntegration.text}
        </p>
        {selectedIntegration.description && (
          <p>
            <strong>{t('common.description')}:</strong> {selectedIntegration.description}
          </p>
        )}

        {selectedIntegration.label === 'instagram' && (
          <div style={{ marginTop: '15px' }}>
            <Header as="h6">{t('common.automaticPublishingSettings')}</Header>
            <Form.Field>
              <Checkbox
                name="enableFeed"
                label={t('common.enableFeedPosts')}
                checked={data.enableFeed}
                onChange={handleCheckboxChange}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                name="enableReels"
                label={t('common.enableReelsPosts')}
                checked={data.enableReels}
                onChange={handleCheckboxChange}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                name="enableStory"
                label={t('common.enableStoryPosts')}
                checked={data.enableStory}
                onChange={handleCheckboxChange}
              />
            </Form.Field>
          </div>
        )}

        <Form.Field style={{ textAlign: 'right', marginTop: '20px' }}>
          <Button
            positive
            content={t('common.saveIntegration')}
            disabled={disabled}
            onClick={onSave}
          />
        </Form.Field>
      </div>
    );
  },
);

IntegrationSettings.propTypes = {
  selectedIntegration: PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string,
    description: PropTypes.string,
  }),
  data: PropTypes.shape({
    enableFeed: PropTypes.bool.isRequired,
    enableReels: PropTypes.bool.isRequired,
    enableStory: PropTypes.bool.isRequired,
  }).isRequired,
  disabled: PropTypes.bool.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

IntegrationSettings.defaultProps = {
  selectedIntegration: null,
};

export default IntegrationSettings;
