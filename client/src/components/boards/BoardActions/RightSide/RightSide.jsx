import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';

import selectors from '../../../../selectors';
import entryActions from '../../../../entry-actions';
import { BoardContexts, BoardViews } from '../../../../constants/Enums';
import { BoardContextIcons, BoardViewIcons } from '../../../../constants/Icons';
import { usePopup } from '../../../../lib/popup';
import ActionsStep from './ActionsStep';

import styles from './RightSide.module.scss';

const RightSide = React.memo(() => {
  const board = useSelector(selectors.selectCurrentBoard);
  const currentProject = useSelector(selectors.selectCurrentProject);
  const isMessageSending = useSelector(selectors.selectWhatsAppMessageIsSending);
  const messageError = useSelector(selectors.selectWhatsAppMessageError);
  const dispatch = useDispatch();

  const handleSelectViewClick = useCallback(
    ({ currentTarget: { value: view } }) => {
      dispatch(entryActions.updateViewInCurrentBoard(view));
    },
    [dispatch],
  );

  const handleSendNotification = useCallback(() => {
    if (currentProject?.whatsappTarget) {
      if (messageError) {
        dispatch(entryActions.clearWhatsAppMessageError());
      }

      const message = `🔔 Nova atualização no Sistema de Marketing\n\nUma nova arte foi concluída. Acesse o sistema para verificar as atualizações.`;

      const messageData = {
        number: currentProject.whatsappTarget,
        text: message,
      };

      dispatch(entryActions.sendWhatsAppMessage(messageData));
    }
  }, [currentProject, dispatch, messageError]);

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
      {board.name === 'Artes' && currentProject?.whatsappTarget && (
        <div className={styles.action}>
          <button
            type="button"
            className={styles.button}
            onClick={handleSendNotification}
            disabled={isMessageSending}
            title="Notificar Cliente"
          >
            <Icon fitted name={isMessageSending ? 'spinner' : 'bell'} loading={isMessageSending} />
          </button>
        </div>
      )}
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
