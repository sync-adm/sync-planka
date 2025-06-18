import EntryActionTypes from '../constants/EntryActionTypes';

const deleteAllNotifications = () => ({
  type: EntryActionTypes.ALL_NOTIFICATIONS_DELETE,
  payload: {},
});

const handleNotificationCreate = (notification, users) => ({
  type: EntryActionTypes.NOTIFICATION_CREATE_HANDLE,
  payload: {
    notification,
    users,
  },
});

const deleteNotification = (id) => ({
  type: EntryActionTypes.NOTIFICATION_DELETE,
  payload: {
    id,
  },
});

const handleNotificationDelete = (notification) => ({
  type: EntryActionTypes.NOTIFICATION_DELETE_HANDLE,
  payload: {
    notification,
  },
});

export default {
  deleteAllNotifications,
  handleNotificationCreate,
  deleteNotification,
  handleNotificationDelete,
};
