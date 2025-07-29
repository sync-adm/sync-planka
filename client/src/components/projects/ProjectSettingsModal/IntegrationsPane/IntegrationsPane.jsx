import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Form, Header, Tab, Message } from 'semantic-ui-react';

import selectors from '../../../../selectors';
import entryActions from '../../../../entry-actions';
import { useForm } from '../../../../hooks';
import styles from './IntegrationsPane.module.scss';

const DEFAULT_DATA = {
  selectedIntegration: '',
};

const IntegrationsPane = React.memo(() => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const [data, , setData] = useForm(DEFAULT_DATA);
  const [integrationOptions, setIntegrationOptions] = useState([]);
  const [selectedIntegrationData, setSelectedIntegrationData] = useState(null);

  const selectProjectById = useMemo(() => selectors.makeSelectProjectById(), []);
  const currentProject = useSelector(selectors.selectCurrentProject);
  const project = useSelector((state) =>
    currentProject ? selectProjectById(state, currentProject.id) : null,
  );

  const postizIntegrations = useSelector(selectors.selectPostizIntegrationsData);
  const postizIntegrationsIsFetching = useSelector(selectors.selectPostizIntegrationsIsFetching);
  const postizIntegrationsError = useSelector(selectors.selectPostizIntegrationsError);

  useEffect(() => {
    if (project?.id) {
      dispatch(entryActions.fetchPostizIntegrations(project.id));
    }
  }, [project?.id, dispatch]);

  useEffect(() => {
    if (postizIntegrations && Array.isArray(postizIntegrations)) {
      const options = postizIntegrations.map((integration) => ({
        text: `${integration.name} (@${integration.profile})`,
        value: integration.id,
        label: integration.identifier?.split('-')[0] || undefined,
        image: integration.picture
          ? {
              avatar: true,
              src: integration.picture,
            }
          : {
              avatar: true,
              src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDEzLjVDOS4zNDUxIDEzLjUgNCAxNC44MjI1IDQgMTcuNVYyMEgyMFYxNy41QzIwIDE0LjgyMjUgMTQuNjU0OSAxMy41IDEyIDEzLjVaIiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=',
            },
      }));

      setIntegrationOptions(options);
    }
  }, [postizIntegrations]);

  useEffect(() => {
    if (data.selectedIntegration && integrationOptions.length > 0) {
      const selected = integrationOptions.find(
        (option) => option.value === data.selectedIntegration,
      );
      setSelectedIntegrationData(selected);
    } else {
      setSelectedIntegrationData(null);
    }
  }, [data.selectedIntegration, integrationOptions]);

  const handleSave = useCallback(() => {
    if (!selectedIntegrationData) {
      return;
    }

    setData(DEFAULT_DATA);

    // TODO: Implementar salvamento real da integração
  }, [selectedIntegrationData, setData]);

  const handleIntegrationChange = useCallback(
    (_, { name, value }) => {
      setData((prev) => ({ ...prev, [name]: value }));
    },
    [setData],
  );

  return (
    <Tab.Pane attached={false} className={styles.wrapper}>
      <Divider horizontal className={styles.firstDivider}>
        <Header as="h4">
          {t('common.socialNetworks', {
            context: 'title',
          })}
        </Header>
      </Divider>

      {postizIntegrationsError && (
        <Message negative>
          <Message.Header>{t('common.error')}</Message.Header>
          <p>{postizIntegrationsError.message || t('common.errorLoadingIntegrations')}</p>
        </Message>
      )}

      <Form>
        <Form.Dropdown
          fluid
          search
          selection
          loading={postizIntegrationsIsFetching}
          label={t('common.selectPostizIntegration')}
          name="selectedIntegration"
          value={data.selectedIntegration}
          onChange={handleIntegrationChange}
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
          </div>
        )}

        <Form.Field style={{ textAlign: 'right', marginTop: '20px' }}>
          <Button
            positive
            content={t('common.saveIntegration')}
            disabled={!selectedIntegrationData || postizIntegrationsIsFetching}
            onClick={handleSave}
          />
        </Form.Field>
      </Form>

      <Divider horizontal>
        <Header as="h4">{t('common.activeIntegrations')}</Header>
      </Divider>

      <div className={styles.activeIntegrations}>
        <p>{t('common.noActiveIntegrations')}</p>
      </div>
    </Tab.Pane>
  );
});

export default IntegrationsPane;
