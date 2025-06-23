import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Checkbox } from 'semantic-ui-react';

import { useForm } from '../../../../hooks';
import styles from './ArtModal.module.scss';
import formatBRL from '../../../../utils/parse-currency';

const DEFAULT_DATA = {
  vehicleLicensePlate: '',
  vehicleModel: '',
  vehicleModelYear: '',
  websiteLink: '',
  entryAmount: '',
  installmentValue: '',
  conditions: '',
};

const ArtModal = React.memo(({ open, onClose, onCreate }) => {
  const [data, handleFieldChange, setData] = useForm(DEFAULT_DATA);
  const [modeEntry, setModeEntry] = useState(true);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      entryAmount: '',
      installmentValue: '',
      conditions: '',
    }));
  }, [modeEntry, setData]);

  const submit = useCallback(() => {
    const name = `${data.vehicleLicensePlate} - ${data.vehicleModel} - ${data.vehicleModelYear}`;

    const description = `
${data.websiteLink}

${
  modeEntry
    ? `Entrada: ${data.entryAmount}
Parcela: ${data.installmentValue}`
    : `Condições: ${data.conditions}`
}
`;

    const payload = {
      name,
      description,
      type: 'project',
    };

    onCreate(payload, false);

    setData(DEFAULT_DATA);
    onClose();
  }, [data, modeEntry, setData, onClose, onCreate]);

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
      <Modal.Content>
        <Modal.Header className={styles.modal_header}>Solicitar Nova Arte</Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Form.Group widths="equal">
            <Form.Input
              label="Placa"
              name="vehicleLicensePlate"
              value={data.vehicleLicensePlate}
              onChange={handleFieldChange}
              placeholder="Digite a placa"
              input={{ required: true }}
            />

            <Form.Input
              label="Modelo"
              name="vehicleModel"
              value={data.vehicleModel}
              onChange={handleFieldChange}
              placeholder="Digite o modelo"
              input={{ required: true }}
            />

            <Form.Input
              label="Ano Modelo"
              name="vehicleModelYear"
              value={data.vehicleModelYear}
              onChange={handleFieldChange}
              placeholder="Digite o ano modelo"
              input={{ required: true }}
            />
          </Form.Group>

          <Form.Input
            fluid
            label="Link do Site"
            name="websiteLink"
            value={data.websiteLink}
            onChange={handleFieldChange}
            placeholder="Digite o link do site"
            input={{ required: true }}
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
