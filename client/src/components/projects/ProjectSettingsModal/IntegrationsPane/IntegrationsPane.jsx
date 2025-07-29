import React from 'react';
import { Tab } from 'semantic-ui-react';

import styles from './IntegrationsPane.module.scss';

const IntegrationsPane = React.memo(() => {
  return (
    <Tab.Pane attached={false} className={styles.wrapper}>
      <h3>Integrações</h3>
      <p>Tab de integrações funcionando!</p>
    </Tab.Pane>
  );
});

export default IntegrationsPane;
