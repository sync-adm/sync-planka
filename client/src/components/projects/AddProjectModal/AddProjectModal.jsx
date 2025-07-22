import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TextareaAutosize from 'react-textarea-autosize';
import { Button, Checkbox, Form, Header, Icon, TextArea } from 'semantic-ui-react';
import { usePopup } from '../../../lib/popup';
import { Input } from '../../../lib/custom-ui';

import selectors from '../../../selectors';
import entryActions from '../../../entry-actions';
import { useClosableModal, useForm, useNestedRef } from '../../../hooks';
import { isModifierKeyPressed } from '../../../utils/event-helpers';
import maskPhone from '../../../utils/input-masks';
import { ProjectTypes } from '../../../constants/Enums';
import { ProjectTypeIcons } from '../../../constants/Icons';
import SelectTypeStep from './SelectTypeStep';

import styles from './AddProjectModal.module.scss';
import grupsMock from './groupsMock';

const AddProjectModal = React.memo(() => {
  const [contactViaGroup, setContactViaGroup] = useState(true);
  const defaultType = useSelector(
    (state) => selectors.selectCurrentModal(state).params.defaultType,
  );

  const { data: defaultData, isSubmitting } = useSelector(selectors.selectProjectCreateForm);

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const [data, handleFieldChange, setData] = useForm(() => ({
    name: '',
    description: '',
    subdomain: '',
    domain: '',
    integrationType: 'Sync',
    whatsappTarget: null,
    monthlyArtLimit: null,
    type: ProjectTypes.PRIVATE,
    ...defaultData,
    ...(defaultType && {
      type: defaultType,
    }),
  }));

  const [nameFieldRef, handleNameFieldRef] = useNestedRef('inputRef');

  const submit = useCallback(() => {
    const cleanData = {
      ...data,
      name: data.name.trim(),
      description: data.description.trim() || null,
      subdomain: data.subdomain.trim() || null,
      domain: data.domain.trim(),
      integrationType: data.integrationType,
      whatsappTarget: data.whatsappTarget ? data.whatsappTarget.replace(/\D/g, '') : null,
    };

    if (!cleanData.name) {
      nameFieldRef.current.select();
      return;
    }

    if (!cleanData.domain) {
      return;
    }

    dispatch(entryActions.createProject(cleanData));
  }, [dispatch, data, nameFieldRef]);

  const handleClose = useCallback(() => {
    dispatch(entryActions.closeModal());
  }, [dispatch]);

  const handleSubmit = useCallback(() => {
    submit();
  }, [submit]);

  const handleDescriptionKeyDown = useCallback(
    (event) => {
      if (isModifierKeyPressed(event) && event.key === 'Enter') {
        submit();
      }
    },
    [submit],
  );

  const handleSubdomainKeyDown = useCallback(
    (event) => {
      if (isModifierKeyPressed(event) && event.key === 'Enter') {
        submit();
      }
    },
    [submit],
  );

  const handleTypeSelect = useCallback(
    (type) => {
      setData((prevData) => ({
        ...prevData,
        type,
      }));
    },
    [setData],
  );

  const [ClosableModal, , activateClosable, deactivateClosable] = useClosableModal();

  const handleSelectTypeClose = useCallback(() => {
    deactivateClosable();
    nameFieldRef.current.focus();
  }, [deactivateClosable, nameFieldRef]);

  const handlePhoneChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      const maskedValue = maskPhone(value);
      setData((prev) => ({ ...prev, [name]: maskedValue }));
    },
    [setData],
  );

  useEffect(() => {
    nameFieldRef.current.focus();
  }, [nameFieldRef]);

  const SelectTypePopup = usePopup(SelectTypeStep, {
    onOpen: activateClosable,
    onClose: handleSelectTypeClose,
  });

  const handleChangeContactMode = (checked) => {
    setContactViaGroup(checked);
    setData((prev) => ({
      ...prev,
      whatsappTarget: null,
    }));
  };

  return (
    <ClosableModal closeIcon size="tiny" onClose={handleClose}>
      <ClosableModal.Content>
        <Header size="huge">
          {t('common.createProject', {
            context: 'title',
          })}
        </Header>
        <Form onSubmit={handleSubmit}>
          <div className={styles.text}>{t('common.title')}</div>
          <Input
            fluid
            inverted
            ref={handleNameFieldRef}
            name="name"
            value={data.name}
            maxLength={128}
            readOnly={isSubmitting}
            className={styles.field}
            onChange={handleFieldChange}
          />
          <div className={styles.text}>{t('common.description')}</div>
          <TextArea
            as={TextareaAutosize}
            name="description"
            value={data.description}
            maxLength={1024}
            minRows={2}
            spellCheck={false}
            className={styles.field}
            onKeyDown={handleDescriptionKeyDown}
            onChange={handleFieldChange}
          />

          <Form.Group widths="equal">
            <Form.Field>
              <div className={styles.text}>Código do Estoque</div>
              <Input
                fluid
                inverted
                name="subdomain"
                value={data.subdomain}
                placeholder="Digite o código do estoque..."
                maxLength={64}
                readOnly={isSubmitting}
                onKeyDown={handleSubdomainKeyDown}
                onChange={handleFieldChange}
              />
            </Form.Field>
            <Form.Field>
              <div className={styles.text}>Domínio Personalizado *</div>
              <Input
                fluid
                inverted
                name="domain"
                value={data.domain}
                placeholder="Digite o domínio personalizado..."
                maxLength={255}
                readOnly={isSubmitting}
                required
                onChange={handleFieldChange}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field>
              <div className={styles.text}>Artes Mensais</div>
              <Input
                type="number"
                fluid
                inverted
                name="monthlyArtLimit"
                value={data.monthlyArtLimit}
                placeholder="Quantidade de artes mensais..."
                maxLength={3}
                readOnly={isSubmitting}
                onChange={handleFieldChange}
              />
            </Form.Field>
            <Form.Field>
              <div className={styles.text}>Provedor do Site *</div>
              <Form.Select
                fluid
                inverted
                name="integrationType"
                value={data.integrationType}
                options={[
                  { key: 'sync', value: 'Sync', text: 'Sync' },
                  { key: 'boom', value: 'Boom Sistemas', text: 'Boom Sistemas' },
                ]}
                readOnly={isSubmitting}
                className={styles.field}
                onChange={(_, { name, value }) => setData((prev) => ({ ...prev, [name]: value }))}
              />
            </Form.Field>
          </Form.Group>

          <Header as="h4" dividing>
            Configurações de Notificação
          </Header>

          <Form.Field className={styles.toggleContactType}>
            <Checkbox
              toggle
              checked={contactViaGroup}
              onChange={(_, { checked }) => handleChangeContactMode(checked)}
              label={contactViaGroup ? 'Notificar via grupo' : 'Notificar via chat'}
            />
          </Form.Field>

          {contactViaGroup ? (
            <Form.Dropdown
              fluid
              search
              selection
              label="Selecione o grupo"
              name="whatsappTarget"
              value={data.whatsappTarget}
              onChange={(_, { name, value }) => setData((prev) => ({ ...prev, [name]: value }))}
              options={grupsMock.map((group) => ({
                key: group.id,
                value: group.id,
                text: group.subject,
                image: group.pictureUrl
                  ? {
                      avatar: true,
                      src: group.pictureUrl,
                    }
                  : {
                      avatar: true,
                      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaTTEyIDEzLjVDOS4zNDUxIDEzLjUgNCAxNC44MjI1IDQgMTcuNVYyMEgyMFYxNy41QzIwIDE0LjgyMjUgMTQuNjU0OSAxMy41IDEyIDEzLjVaIiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=',
                    },
              }))}
              placeholder="Digite para buscar um grupo..."
              clearable
              noResultsMessage="Nenhum grupo encontrado"
            />
          ) : (
            <Form.Input
              fluid
              label="Adicione o numero do WhatsApp"
              name="whatsappTarget"
              value={data.whatsappTarget}
              onChange={handlePhoneChange}
              placeholder="Digite o número do WhatsApp..."
              input={{ required: true, maxLength: 15 }}
            />
          )}

          <Button
            inverted
            color="green"
            icon="checkmark"
            content={t('action.createProject')}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
          <SelectTypePopup value={data.type} onSelect={handleTypeSelect}>
            <Button type="button" className={styles.selectTypeButton}>
              <Icon name={ProjectTypeIcons[data.type]} className={styles.selectTypeButtonIcon} />
              {t(`common.${data.type}`)}
            </Button>
          </SelectTypePopup>
        </Form>
      </ClosableModal.Content>
    </ClosableModal>
  );
});

export default AddProjectModal;
