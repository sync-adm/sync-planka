import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Divider, Header, Tab, Message, Confirm } from 'semantic-ui-react';

import selectors from '../../../../selectors';
import entryActions from '../../../../entry-actions';
import actions from '../../../../actions';
import { useForm } from '../../../../hooks';
import styles from './IntegrationsPane.module.scss';

// Componentes
import IntegrationForm from './IntegrationForm';
import ActiveIntegrationsList from './ActiveIntegrationsList';

const DEFAULT_DATA = {
  selectedIntegration: '',
  enableFeed: true,
  enableReels: true,
  enableStory: true,
  defaultDescription: '',
};

const IntegrationsPane = React.memo(() => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const [data, , setData] = useForm(DEFAULT_DATA);
  const [integrationOptions, setIntegrationOptions] = useState([]);
  const [selectedIntegrationData, setSelectedIntegrationData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const descriptionRef = useRef(null);

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
          defaultDescription: data.defaultDescription.trim() || null,
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
    data.defaultDescription,
  ]);

  const handleIntegrationChange = useCallback(
    (_, { name, value }) => {
      setData((prev) => ({ ...prev, [name]: value }));
      if (projectIntegrationCreateError) {
        dispatch(actions.clearProjectIntegrationCreateError());
      }
    },
    [setData, projectIntegrationCreateError, dispatch],
  );

  const handleCheckboxChange = useCallback(
    (_, { name, checked }) => {
      setData((prev) => ({ ...prev, [name]: checked }));
    },
    [setData],
  );

  const insertVariable = useCallback(
    (variable) => {
      const textarea = descriptionRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = data.defaultDescription;
        const newValue = `${currentValue.substring(0, start)}[${variable}]${currentValue.substring(end)}`;

        setData((prev) => ({ ...prev, defaultDescription: newValue }));

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + variable.length + 2, start + variable.length + 2);
        }, 0);
      }
    },
    [data.defaultDescription, setData],
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

      <IntegrationForm
        data={data}
        integrationOptions={integrationOptions}
        selectedIntegrationData={selectedIntegrationData}
        postizIntegrationsIsFetching={postizIntegrationsIsFetching}
        projectIntegrationCreateError={projectIntegrationCreateError}
        onIntegrationChange={handleIntegrationChange}
        onCheckboxChange={handleCheckboxChange}
        onSave={handleSave}
        descriptionRef={descriptionRef}
        onInsertVariable={insertVariable}
      />

      <Divider horizontal>
        <Header as="h4">{t('common.activeIntegrations')}</Header>
      </Divider>

      <div className={styles.activeIntegrations}>
        {projectIntegrationsError && (
          <Message negative>
            <Message.Header>{t('common.error')}</Message.Header>
            <p>{projectIntegrationsError.message || t('common.errorLoadingActiveIntegrations')}</p>
          </Message>
        )}

        <ActiveIntegrationsList
          projectIntegrations={projectIntegrations}
          projectIntegrationsLoading={projectIntegrationsLoading}
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
