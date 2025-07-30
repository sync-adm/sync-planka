import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'semantic-ui-react';

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
    <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
      {availableVariables.map((variable) => (
        <Button
          key={variable}
          size="mini"
          basic
          color="blue"
          onClick={() => onInsertVariable(variable)}
          style={{ margin: '0px', padding: '3px 5px', minHeight: '10px' }}
        >
          {t(`common.variables.${variable}`).split(' (')[0]}
        </Button>
      ))}
    </div>
  );
}

export default VariableButtons;
