import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Message, Header, Button } from 'semantic-ui-react';

import InstagramSettings from './InstagramSettings';
import styles from '../IntegrationsPane.module.scss';

function IntegrationForm({
  data,
  integrationOptions,
  selectedIntegrationData,
  postizIntegrationsIsFetching,
  projectIntegrationCreateError,
  onIntegrationChange,
  onCheckboxChange,
  onSave,
  descriptionRef,
  onInsertVariable,
}) {
  const [t] = useTranslation();

  return (
    <Form>
      <Form.Dropdown
        fluid
        search
        selection
        loading={postizIntegrationsIsFetching}
        label={t('common.selectPostizIntegration')}
        name="selectedIntegration"
        value={data.selectedIntegration}
        onChange={onIntegrationChange}
        options={integrationOptions}
        placeholder={
          postizIntegrationsIsFetching
            ? t('common.loadingIntegrations')
            : t('common.searchIntegration')
        }
        clearable
        noResultsMessage={t('common.noIntegrationsFound')}
        disabled={postizIntegrationsIsFetching || integrationOptions.length === 0}
      />

      {projectIntegrationCreateError && (
        <Message negative style={{ marginTop: '10px' }}>
          <Message.Header>{t('common.error')}</Message.Header>
          <p>
            {projectIntegrationCreateError.message === 'Integration already exists for this project'
              ? t('common.integrationAlreadyExists')
              : projectIntegrationCreateError.message || t('common.errorCreatingIntegration')}
          </p>
        </Message>
      )}

      {selectedIntegrationData && (
        <div className={styles.selectedIntegration}>
          <Header as="h5">{t('common.integrationSelected')}</Header>
          <p>
            <strong>{t('common.name')}:</strong> {selectedIntegrationData.text}
          </p>
          {selectedIntegrationData.description && (
            <p>
              <strong>{t('common.description')}:</strong> {selectedIntegrationData.description}
            </p>
          )}

          {selectedIntegrationData.label === 'instagram' && (
            <InstagramSettings
              data={data}
              onCheckboxChange={onCheckboxChange}
              onIntegrationChange={onIntegrationChange}
              descriptionRef={descriptionRef}
              onInsertVariable={onInsertVariable}
            />
          )}
        </div>
      )}

      <Form.Field style={{ textAlign: 'right', marginTop: '20px' }}>
        <Button
          positive
          content={t('common.saveIntegration')}
          disabled={!selectedIntegrationData || postizIntegrationsIsFetching}
          onClick={onSave}
        />
      </Form.Field>
    </Form>
  );
}

export default IntegrationForm;
