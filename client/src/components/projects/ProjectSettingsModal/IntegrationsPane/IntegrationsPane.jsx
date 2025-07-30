import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Divider,
  Form,
  Header,
  Tab,
  Message,
  Card,
  Image,
  Confirm,
} from 'semantic-ui-react';

import selectors from '../../../../selectors';
import entryActions from '../../../../entry-actions';
import actions from '../../../../actions';
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

    // Limpar erro anterior antes de tentar criar
    if (projectIntegrationCreateError) {
      dispatch(actions.clearProjectIntegrationCreateError());
    }

    const integration = postizIntegrations.find((i) => i.id === selectedIntegrationData.value);

    const integrationData = {
      config: {
        ...integration,
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
  ]);

  const handleIntegrationChange = useCallback(
    (_, { name, value }) => {
      setData((prev) => ({ ...prev, [name]: value }));
      // Limpar erro de criação quando o usuário muda a seleção
      if (projectIntegrationCreateError) {
        dispatch(actions.clearProjectIntegrationCreateError());
      }
    },
    [setData, projectIntegrationCreateError, dispatch],
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

  const renderActiveIntegrations = () => {
    if (projectIntegrationsLoading) {
      return (
        <Message info>
          <Message.Header>{t('common.loading')}</Message.Header>
          <p>{t('common.loadingActiveIntegrations')}</p>
        </Message>
      );
    }

    if (projectIntegrations && projectIntegrations.length > 0) {
      return (
        <div>
          {projectIntegrations.map((integration) => (
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
                <Card.Header>
                  {integration.config?.name || t('common.unknownIntegration')}
                </Card.Header>
                <Card.Meta>
                  <span className="category">
                    {integration.integrationType?.toUpperCase()} •{' '}
                    {integration.config?.profile ? `@${integration.config.profile}` : ''}
                  </span>
                </Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <div className="ui two buttons">
                  <Button
                    basic
                    color={integration.disabled ? 'green' : 'orange'}
                    onClick={() => handleToggleIntegration(integration)}
                  >
                    {integration.disabled ? 'Enable' : 'Disable'}
                  </Button>
                  <Button basic color="red" onClick={() => handleDeleteIntegration(integration)}>
                    Delete
                  </Button>
                </div>
              </Card.Content>
            </Card>
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
  };

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

        {projectIntegrationCreateError && (
          <Message negative style={{ marginTop: '10px' }}>
            <Message.Header>{t('common.error')}</Message.Header>
            <p>
              {projectIntegrationCreateError.message ===
              'Integration already exists for this project'
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
        {projectIntegrationsError && (
          <Message negative>
            <Message.Header>{t('common.error')}</Message.Header>
            <p>{projectIntegrationsError.message || t('common.errorLoadingActiveIntegrations')}</p>
          </Message>
        )}

        {renderActiveIntegrations()}
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
