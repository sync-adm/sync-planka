import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Divider, Form, Header, Tab, Message, Confirm } from 'semantic-ui-react';

import selectors from '../../../../selectors';
import entryActions from '../../../../entry-actions';
import actions from '../../../../actions';
import { useForm } from '../../../../hooks';
import IntegrationSelector from './IntegrationSelector';
import IntegrationSettings from './IntegrationSettings';
import ActiveIntegrationsList from './ActiveIntegrationsList';
import styles from './IntegrationsPane.module.scss';

const DEFAULT_DATA = {
  selectedIntegration: '',
  enableFeed: true,
  enableReels: true,
  enableStory: true,
};

const IntegrationsPane = React.memo(() => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const [data, , setData] = useForm(DEFAULT_DATA);
  const [integrationOptions, setIntegrationOptions] = useState([]);
  const [selectedIntegrationData, setSelectedIntegrationData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const selectProjectById = useMemo(() => selectors.makeSelectProjectById(), []);
  const currentProject = useSelector(selectors.selectCurrentProject);
  const project = useSelector((state) =>
    currentProject ? selectProjectById(state, currentProject.id) : null,
  );

  const postizIntegrations = useSelector(selectors.selectPostizIntegrationsData);
  const postizIntegrationsIsFetching = useSelector(selectors.selectPostizIntegrationsIsFetching);
  const postizIntegrationsError = useSelector(selectors.selectPostizIntegrationsError);

  const projectIntegrations = useSelector(selectors.selectProjectIntegrations);
  const projectIntegrationsLoading = useSelector(selectors.selectIsProjectIntegrationsLoading);
  const projectIntegrationsError = useSelector(selectors.selectProjectIntegrationsError);
  const projectIntegrationCreateError = useSelector(selectors.selectProjectIntegrationCreateError);

  useEffect(() => {
    if (project?.id) {
      dispatch(entryActions.fetchPostizIntegrations(project.id));
      dispatch(entryActions.fetchProjectIntegrations(project.id));
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

    if (projectIntegrationCreateError) {
      dispatch(actions.clearProjectIntegrationCreateError());
    }

    const integration = postizIntegrations.find((i) => i.id === selectedIntegrationData.value);

    const integrationData = {
      config: {
        ...integration,
        publishSettings: {
          enableFeed: data.enableFeed,
          enableReels: data.enableReels,
          enableStory: data.enableStory,
        },
      },
      integrationType: selectedIntegrationData.label || 'instagram',
      disabled: false,
    };

    dispatch(entryActions.createProjectIntegration(currentProject?.id, integrationData));

    setData(DEFAULT_DATA);
  }, [
    selectedIntegrationData,
    postizIntegrations,
    dispatch,
    currentProject?.id,
    setData,
    projectIntegrationCreateError,
    data.enableFeed,
    data.enableReels,
    data.enableStory,
  ]);

  const handleIntegrationChange = useCallback(
    (name, value) => {
      setData((prev) => ({ ...prev, [name]: value }));
    },
    [setData],
  );

  const handleCheckboxChange = useCallback(
    (name, checked) => {
      setData((prev) => ({ ...prev, [name]: checked }));
    },
    [setData],
  );

  const handleDeleteIntegration = useCallback((integration) => {
    setConfirmDelete(integration);
  }, []);

  const confirmDeleteIntegration = useCallback(() => {
    if (confirmDelete) {
      dispatch(entryActions.deleteProjectIntegration(confirmDelete.id));
      setConfirmDelete(null);
    }
  }, [confirmDelete, dispatch]);

  const handleToggleIntegration = useCallback(
    (integration) => {
      const updatedData = {
        disabled: !integration.disabled,
      };
      dispatch(entryActions.updateProjectIntegration(integration.id, updatedData));
    },
    [dispatch],
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
        <IntegrationSelector
          loading={postizIntegrationsIsFetching}
          value={data.selectedIntegration}
          options={integrationOptions}
          error={projectIntegrationCreateError}
          disabled={postizIntegrationsIsFetching || integrationOptions.length === 0}
          onChange={handleIntegrationChange}
        />

        <IntegrationSettings
          selectedIntegration={selectedIntegrationData}
          data={data}
          disabled={!selectedIntegrationData || postizIntegrationsIsFetching}
          onCheckboxChange={handleCheckboxChange}
          onSave={handleSave}
        />
      </Form>

      <Divider horizontal>
        <Header as="h4">{t('common.activeIntegrations')}</Header>
      </Divider>

      <div className={styles.activeIntegrations}>
        <ActiveIntegrationsList
          integrations={projectIntegrations}
          loading={projectIntegrationsLoading}
          error={projectIntegrationsError}
          onToggleIntegration={handleToggleIntegration}
          onDeleteIntegration={handleDeleteIntegration}
        />
      </div>

      <Confirm
        open={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteIntegration}
        header={t('common.deleteIntegration')}
        content={
          confirmDelete &&
          t('common.deleteIntegrationConfirmation', {
            name: confirmDelete.config?.name || t('common.unknownIntegration'),
          })
        }
        confirmButton={t('common.delete')}
        cancelButton={t('common.cancel')}
      />
    </Tab.Pane>
  );
});

export default IntegrationsPane;
