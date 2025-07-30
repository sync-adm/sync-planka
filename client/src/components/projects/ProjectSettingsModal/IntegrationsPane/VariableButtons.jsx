import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button } from 'semantic-ui-react';

import styles from './VariableButtons.module.scss';

const availableVariables = [
  'marca',
  'modelo',
  'versao',
  'cor',
  'combustivel',
  'transmissao',
  'portas',
  'km',
  'quilometragem',
  'preco',
  'categoria',
  'ano',
  'anoModelo',
  'anoFabricacao',
  'blindado',
  'chaveReserva',
  'manual',
];

function VariableButtons({ onInsertVariable }) {
  const [t] = useTranslation();

  return (
    <div className={styles.container}>
      {availableVariables.map((variable) => (
        <Button
          key={variable}
          size="mini"
          basic
          color="blue"
          onClick={() => onInsertVariable(variable)}
          className={styles.variableButton}
        >
          {t(`common.variables.${variable}`).split(' (')[0]}
        </Button>
      ))}
    </div>
  );
}

VariableButtons.propTypes = {
  onInsertVariable: PropTypes.func.isRequired,
};

export default VariableButtons;
