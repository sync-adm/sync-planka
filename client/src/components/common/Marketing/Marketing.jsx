import React from 'react';
import { useSelector } from 'react-redux';
import { Loader } from 'semantic-ui-react';

import selectors from '../../../selectors';
import Content from './Content';

const Marketing = React.memo(() => {
  const isInitializing = useSelector(selectors.selectIsInitializing);

  return isInitializing ? <Loader active size="massive" /> : <Content />;
});

export default Marketing;
