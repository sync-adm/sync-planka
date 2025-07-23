import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon, Message } from 'semantic-ui-react';
import { toast } from 'react-hot-toast';

import styles from './EmptyTrashToast.module.scss';

const WhatsAppMessageSuccessToast = React.memo(({ id }) => {
  const handleCloseClick = useCallback(() => {
    toast.dismiss(id);
  }, [id]);

  return (
    <Message positive className={styles.wrapper}>
      <Message.Header>
        <Icon name="check circle" />
        Mensagem enviada!
        <Icon name="times" className={styles.closeIcon} onClick={handleCloseClick} />
      </Message.Header>
      <p>A notificação foi enviada via WhatsApp com sucesso.</p>
    </Message>
  );
});

WhatsAppMessageSuccessToast.propTypes = {
  id: PropTypes.string.isRequired,
};

export default WhatsAppMessageSuccessToast;
