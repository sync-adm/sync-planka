import React from 'react';
import classNames from 'classnames';

import styles from './Design.module.scss';
import Fixed from '../Fixed';

const Content = React.memo(() => {
  return (
    <div className={classNames(styles.wrapper, styles.fullHeight)}>
      <Fixed />
      <div className={styles.container}>
        <p>TELA DO CHRISTIAN</p>
      </div>
    </div>
  );
});

export default Content;
