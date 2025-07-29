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

    console.log('Integração selecionada:', {
      id: selectedIntegrationData.value,
      text: selectedIntegrationData.text,
      description: selectedIntegrationData.description,
      projectId: project?.id,
    });

    setData(DEFAULT_DATA);

    // TODO: Implementar salvamento real da integração
  }, [selectedIntegrationData, project?.id, setData]);

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
          <Message.Header>Erro</Message.Header>
          <p>{postizIntegrationsError.message || 'Erro ao carregar integrações do Postiz'}</p>
        </Message>
      )}

      <Form>
        <Form.Dropdown
          fluid
          search
          selection
          loading={postizIntegrationsIsFetching}
          label="Selecionar Integração do Postiz"
          name="selectedIntegration"
          value={data.selectedIntegration}
          onChange={handleIntegrationChange}
          options={integrationOptions}
          placeholder={
            postizIntegrationsIsFetching
              ? 'Carregando integrações...'
              : 'Digite para buscar uma integração...'
          }
          clearable
          noResultsMessage="Nenhuma integração encontrada"
          disabled={postizIntegrationsIsFetching || integrationOptions.length === 0}
        />

        {selectedIntegrationData && (
          <div className={styles.selectedIntegration}>
            <Header as="h5">Integração Selecionada:</Header>
            <p>
              <strong>Nome:</strong> {selectedIntegrationData.text}
            </p>
            {selectedIntegrationData.description && (
              <p>
                <strong>Descrição:</strong> {selectedIntegrationData.description}
              </p>
            )}
          </div>
        )}

        <Form.Field style={{ textAlign: 'right', marginTop: '20px' }}>
          <Button
            positive
            content="Salvar Integração"
            disabled={!selectedIntegrationData || postizIntegrationsIsFetching}
            onClick={handleSave}
          />
        </Form.Field>
      </Form>

      <Divider horizontal>
        <Header as="h4">Integrações Ativas</Header>
      </Divider>

      <div className={styles.activeIntegrations}>
        <p>Nenhuma integração ativa no momento.</p>
      </div>
    </Tab.Pane>
  );
});

export default IntegrationsPane;
