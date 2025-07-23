import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon, Message } from 'semantic-ui-react';
import { toast } from 'react-hot-toast';

import styles from './EmptyTrashToast.module.scss';

const GenericToast = React.memo(({ id, type, title, message, details, icon }) => {
  const handleCloseClick = useCallback(() => {
    toast.dismiss(id);
  }, [id]);

  return (
    <Message
      positive={type === 'success'}
      negative={type === 'error'}
      warning={type === 'warning'}
      info={type === 'info'}
      className={styles.wrapper}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <Message.Header style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            {icon && <Icon name={icon} style={{ marginRight: '8px' }} />}
            {title}
          </Message.Header>
          <p style={{ margin: 0 }}>{message}</p>
          {details && (
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9em', opacity: 0.8 }}>{details}</p>
          )}
        </div>
        <Icon
          name="times"
          style={{
            cursor: 'pointer',
            marginLeft: '12px',
            opacity: 0.6,
            fontSize: '1.1em',
          }}
          onClick={handleCloseClick}
        />
      </div>
    </Message>
  );
});

GenericToast.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  details: PropTypes.string,
  icon: PropTypes.string,
};

GenericToast.defaultProps = {
  details: null,
  icon: null,
};

export default GenericToast;
