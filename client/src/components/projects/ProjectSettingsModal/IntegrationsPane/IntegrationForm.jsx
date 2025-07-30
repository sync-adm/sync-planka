import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Form, Message, Header, Button } from 'semantic-ui-react';

import InstagramSettings from './InstagramSettings';
import integrationsStyles from './IntegrationsPane.module.scss';
import styles from './IntegrationForm.module.scss';

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
        <Message negative className={styles.errorMessage}>
          <Message.Header>{t('common.error')}</Message.Header>
          <p>
            {projectIntegrationCreateError.message === 'Integration already exists for this project'
              ? t('common.integrationAlreadyExists')
              : projectIntegrationCreateError.message || t('common.errorCreatingIntegration')}
          </p>
        </Message>
      )}

      {selectedIntegrationData && (
        <div className={integrationsStyles.selectedIntegration}>
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

      <Form.Field className={styles.formActions}>
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

IntegrationForm.propTypes = {
  data: PropTypes.shape({
    selectedIntegration: PropTypes.string,
  }).isRequired,
  integrationOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      text: PropTypes.string,
    }),
  ).isRequired,
  selectedIntegrationData: PropTypes.shape({
    text: PropTypes.string,
    description: PropTypes.string,
    label: PropTypes.string,
  }),
  postizIntegrationsIsFetching: PropTypes.bool.isRequired,
  projectIntegrationCreateError: PropTypes.shape({
    message: PropTypes.string,
  }),
  onIntegrationChange: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  descriptionRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  onInsertVariable: PropTypes.func.isRequired,
};

IntegrationForm.defaultProps = {
  selectedIntegrationData: null,
  projectIntegrationCreateError: null,
};

export default IntegrationForm;
