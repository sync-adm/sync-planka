import React from 'react';
import { useSelector } from 'react-redux';

import { useLocation } from 'react-router-dom';
import selectors from '../../../selectors';
import Header from '../Header';
import Favorites from '../Favorites';
import HomeActions from '../HomeActions';
import Project from '../../projects/Project';
import BoardActions from '../../boards/BoardActions';

import styles from './Fixed.module.scss';

const Fixed = React.memo(() => {
  const { projectId } = useSelector(selectors.selectPath);
  const board = useSelector(selectors.selectCurrentBoard);
  const location = useLocation();

  return (
    <div className={styles.wrapper}>
      <Header />
      <Favorites />
      {projectId === undefined &&
        !location.pathname.includes('marketing') &&
        !location.pathname.includes('design') && <HomeActions />}
      {projectId && <Project />}
      {board && !board.isFetching && <BoardActions />}
    </div>
  );
});

export default Fixed;
