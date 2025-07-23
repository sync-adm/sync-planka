import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';

import selectors from '../../../../../selectors';
import entryActions from '../../../../../entry-actions';
import {
  setNotificationCooldown,
  isNotificationOnCooldown,
  getRemainingCooldownTime,
  formatCooldownTime,
} from '../../../../../utils/notificationCooldown';
import { createNaturalMessage } from '../../../../../utils/naturalMessages';

import styles from '../RightSide.module.scss';

const NotificationButton = React.memo(({ board }) => {
  const currentProject = useSelector(selectors.selectCurrentProject);

  const isMessageSending = useSelector(selectors.selectWhatsAppMessageIsSending);
  const messageError = useSelector(selectors.selectWhatsAppMessageError);
  const dispatch = useDispatch();

  const [cooldownTime, setCooldownTime] = useState(0);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  useEffect(() => {
    if (board?.id) {
      const onCooldown = isNotificationOnCooldown(board.id);
      setIsOnCooldown(onCooldown);

      if (onCooldown) {
        setCooldownTime(getRemainingCooldownTime(board.id));
      }
    }
  }, [board?.id]);

  useEffect(() => {
    let interval;

    if (isOnCooldown && cooldownTime > 0) {
      interval = setInterval(() => {
        const remaining = getRemainingCooldownTime(board?.id);

        if (remaining <= 0) {
          setIsOnCooldown(false);
          setCooldownTime(0);
        } else {
          setCooldownTime(remaining);
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOnCooldown, cooldownTime, board?.id]);

  const handleSendNotification = useCallback(async () => {
    const isGroup = currentProject.whatsappTarget.includes('@g.us');

    if (currentProject?.whatsappTarget && board?.id && !isOnCooldown) {
      if (messageError) {
        dispatch(entryActions.clearWhatsAppMessageError());
      }

      const message = createNaturalMessage(currentProject.name, isGroup);

      const messageData = {
        number: currentProject.whatsappTarget,
        text: message,
      };

      dispatch(entryActions.sendWhatsAppMessage(messageData));

      setNotificationCooldown(board.id);
      setIsOnCooldown(true);
      setCooldownTime(5 * 60 * 1000);
    }
  }, [currentProject, dispatch, messageError, board?.id, isOnCooldown]);

  const getButtonTitle = () => {
    if (isOnCooldown) {
      return `Aguarde ${formatCooldownTime(cooldownTime)} para notificar novamente`;
    }
    if (isMessageSending) {
      return 'Enviando notificação...';
    }
    return 'Notificar Cliente via WhatsApp';
  };

  const getButtonIcon = () => {
    if (isMessageSending) {
      return 'spinner';
    }
    if (isOnCooldown) {
      return 'clock';
    }
    return 'bell';
  };

  if (board?.name !== 'Artes' || !currentProject?.whatsappTarget) {
    return null;
  }

  return (
    <div className={styles.action}>
      <button
        type="button"
        className={styles.button}
        onClick={handleSendNotification}
        disabled={isMessageSending || isOnCooldown}
        title={getButtonTitle()}
        style={{
          opacity: isOnCooldown ? 0.5 : 1,
        }}
      >
        <Icon fitted name={getButtonIcon()} loading={isMessageSending} />
      </button>
    </div>
  );
});

NotificationButton.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  currentProject: PropTypes.shape({
    whatsappTarget: PropTypes.string,
  }),
};

NotificationButton.defaultProps = {
  board: null,
  currentProject: null,
};

export default NotificationButton;
