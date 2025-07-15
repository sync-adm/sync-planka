import React, { useCallback, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Modal, Checkbox } from 'semantic-ui-react';

import { useForm } from '../../../../hooks';
import selectors from '../../../../selectors';
import styles from './ArtModal.module.scss';
import formatBRL from '../../../../utils/parse-currency';
import entryActions from '../../../../entry-actions';

const DEFAULT_DATA = {
  entryAmount: '',
  installmentValue: '',
  conditions: '',
  selectedVehicle: '',
};

const ArtModal = React.memo(({ open, onClose, onCreate }) => {
  const dispatch = useDispatch();

  const [data, handleFieldChange, setData] = useForm(DEFAULT_DATA);
  const [modeEntry, setModeEntry] = useState(true);

  const [vehicleOptions, setVehicleOptions] = useState([]);

  const selectProjectById = useMemo(() => selectors.makeSelectProjectById(), []);
  const currentProject = useSelector(selectors.selectCurrentProject);
  const project = useSelector((state) =>
    currentProject ? selectProjectById(state, currentProject.id) : null,
  );

  const inventory = useSelector(selectors.selectInventoryData);

  useEffect(() => {
    if (currentProject?.subdomain) {
      dispatch(entryActions.fetchInventory(currentProject.subdomain));
    }
  }, [currentProject?.subdomain, dispatch]);

  useEffect(() => {
    if (
      inventory &&
      inventory.body &&
      inventory.body.data &&
      Array.isArray(inventory.body.data) &&
      inventory.body.data.length > 0
    ) {
      const options = inventory.body.data.map((item) => ({
        text: `${item.plate ?? '*'} - ${item.make} ${item.model} ${item.version} | ${item.modelYear}`,
        value: item.id,
      }));

      setVehicleOptions(options);
    }
  }, [inventory]);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      entryAmount: '',
      installmentValue: '',
      conditions: '',
    }));
  }, [modeEntry, setData]);

  const submit = useCallback(() => {
    if (
      inventory &&
      inventory.body &&
      inventory.body.data &&
      Array.isArray(inventory.body.data) &&
      inventory.body.data.length > 0
    ) {
      const selectedVehicle = inventory.body.data.find((item) => item.id === data.selectedVehicle);
      const vehicleImages = selectedVehicle?.images.split(',') || [];

      const name = `${selectedVehicle.plate} - ${selectedVehicle.model} - ${selectedVehicle.modelYear}`;

      const description = `
https://www.sync.com.br

${
  modeEntry
    ? `Entrada: ${data.entryAmount}
Parcela: ${data.installmentValue}`
    : `Condições: ${data.conditions}`
}

Imagens:
${vehicleImages
  .slice(0, 3)
  .map((image) => `![Image](${image})`)
  .join('\n \n')}
`;

      const payload = {
        name,
        description,
        type: 'project',
      };

      onCreate(payload, true);

      setData(DEFAULT_DATA);
      onClose();
    }
  }, [
    inventory,
    modeEntry,
    data.entryAmount,
    data.installmentValue,
    data.conditions,
    data.selectedVehicle,
    onCreate,
    setData,
    onClose,
  ]);

  const handleSubmit = useCallback(() => {
    submit();
  }, [submit]);

  const handleCurrencyChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setData((prev) => ({
        ...prev,
        [name]: formatBRL(value),
      }));
    },
    [setData],
  );

  return (
    <Modal closeIcon open={open} onClose={onClose} className={styles.wrapper}>
      <Modal.Content className={styles.content}>
        <Modal.Header className={styles.modal_header}>
          Solicitar Nova Arte{project ? ` - ${project.name}` : ''}
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Form.Dropdown
            fluid
            search
            selection
            label="Selecionar Veículo"
            name="selectedVehicle"
            value={data.selectedVehicle}
            onChange={(_, { name, value }) => setData((prev) => ({ ...prev, [name]: value }))}
            options={vehicleOptions}
            placeholder="Digite para buscar um veículo..."
            clearable
            noResultsMessage="Nenhum veículo encontrado"
          />

          <Form.Field>
            <Checkbox
              toggle
              checked={modeEntry}
              onChange={(_, { checked }) => setModeEntry(checked)}
              label={modeEntry ? 'Entrada + Parcela' : 'Condição'}
            />
          </Form.Field>

          {modeEntry ? (
            <Form.Group widths="equal">
              <Form.Input
                label="Valor Entrada"
                name="entryAmount"
                value={data.entryAmount}
                onChange={handleCurrencyChange}
                placeholder="0,00"
                input={{ required: true }}
                helper="Digite apenas números; vírgula e ponto são opcionais."
              />

              <Form.Input
                label="Valor Parcela"
                name="installmentValue"
                value={data.installmentValue}
                onChange={handleCurrencyChange}
                placeholder="0,00"
                input={{ required: true }}
                helper="Digite apenas números; vírgula e ponto são opcionais."
              />
            </Form.Group>
          ) : (
            <Form.Input
              fluid
              label="Condições"
              name="conditions"
              value={data.conditions}
              onChange={handleFieldChange}
              placeholder="Descreva as condições"
              input={{ required: true }}
            />
          )}

          <Form.Field style={{ textAlign: 'right' }}>
            <Button positive content="Salvar" type="submit" />
          </Form.Field>
        </Form>
      </Modal.Content>
    </Modal>
  );
});

ArtModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default ArtModal;
