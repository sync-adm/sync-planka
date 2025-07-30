import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import actions from '../../../../actions';

const IntegrationSelector = React.memo(({ loading, value, options, error, disabled, onChange }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const handleChange = useCallback(
    (_, { name, value: newValue }) => {
      onChange(name, newValue);
      if (error) {
        dispatch(actions.clearProjectIntegrationCreateError());
      }
    },
    [onChange, error, dispatch],
  );

  return (
    <>
      <Form.Dropdown
        fluid
        search
        selection
        loading={loading}
        label={t('common.selectPostizIntegration')}
        name="selectedIntegration"
        value={value}
        onChange={handleChange}
        options={options}
        placeholder={loading ? t('common.loadingIntegrations') : t('common.searchIntegration')}
        clearable
        noResultsMessage={t('common.noIntegrationsFound')}
        disabled={disabled}
      />

      {error && (
        <Message negative style={{ marginTop: '10px' }}>
          <Message.Header>{t('common.error')}</Message.Header>
          <p>
            {error.message === 'Integration already exists for this project'
              ? t('common.integrationAlreadyExists')
              : error.message || t('common.errorCreatingIntegration')}
          </p>
        </Message>
      )}
    </>
  );
});

IntegrationSelector.propTypes = {
  loading: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      label: PropTypes.string,
      image: PropTypes.shape({
        avatar: PropTypes.bool,
        src: PropTypes.string,
      }),
    }),
  ).isRequired,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

IntegrationSelector.defaultProps = {
  error: null,
};

export default IntegrationSelector;
