import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';

import selectors from '../../../../selectors';
import entryActions from '../../../../entry-actions';
import { BoardContexts, BoardViews, UserRoles } from '../../../../constants/Enums';
import { BoardContextIcons, BoardViewIcons } from '../../../../constants/Icons';
import { usePopup } from '../../../../lib/popup';
import ActionsStep from './ActionsStep';
import NotificationButton from './NotificationButton';
import styles from './RightSide.module.scss';

const RightSide = React.memo(() => {
  const board = useSelector(selectors.selectCurrentBoard);
  const currentUser = useSelector(selectors.selectCurrentUser);
  const dispatch = useDispatch();

  const isAdmin = currentUser?.role === UserRoles.ADMIN;

  const handleSelectViewClick = useCallback(
    ({ currentTarget: { value: view } }) => {
      dispatch(entryActions.updateViewInCurrentBoard(view));
    },
    [dispatch],
  );

  const ActionsPopup = usePopup(ActionsStep);

  const views = [BoardViews.GRID, BoardViews.LIST];
  if (board.context === BoardContexts.BOARD) {
    views.unshift(BoardViews.KANBAN);
  }

  return (
    <>
      <div className={styles.action}>
        <div className={styles.buttonGroup}>
          {views.map((view) => (
            <button
              key={view}
              type="button"
              value={view}
              disabled={view === board.view}
              className={styles.button}
              onClick={handleSelectViewClick}
            >
              <Icon fitted name={BoardViewIcons[view]} />
            </button>
          ))}
        </div>
      </div>
      {isAdmin && <NotificationButton board={board} />}
      <div className={styles.action}>
        <ActionsPopup>
          <button type="button" className={styles.button}>
            <Icon fitted name={BoardContextIcons[board.context]} />
          </button>
        </ActionsPopup>
      </div>
    </>
  );
});

export default RightSide;
