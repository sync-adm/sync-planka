const NOTIFICATION_COOLDOWN_PREFIX = 'notification_cooldown_board_';
const COOLDOWN_DURATION = 5 * 60 * 1000;

export const setNotificationCooldown = (boardId) => {
  const expirationTime = Date.now() + COOLDOWN_DURATION;
  localStorage.setItem(`${NOTIFICATION_COOLDOWN_PREFIX}${boardId}`, expirationTime.toString());
};

export const isNotificationOnCooldown = (boardId) => {
  const storedTime = localStorage.getItem(`${NOTIFICATION_COOLDOWN_PREFIX}${boardId}`);

  if (!storedTime) {
    return false;
  }

  const expirationTime = parseInt(storedTime, 10);
  const now = Date.now();

  if (now >= expirationTime) {
    localStorage.removeItem(`${NOTIFICATION_COOLDOWN_PREFIX}${boardId}`);
    return false;
  }

  return true;
};

export const getRemainingCooldownTime = (boardId) => {
  const storedTime = localStorage.getItem(`${NOTIFICATION_COOLDOWN_PREFIX}${boardId}`);

  if (!storedTime) {
    return 0;
  }

  const expirationTime = parseInt(storedTime, 10);
  const now = Date.now();
  const remaining = expirationTime - now;

  return remaining > 0 ? remaining : 0;
};

export const formatCooldownTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
};

export const clearNotificationCooldown = (boardId) => {
  localStorage.removeItem(`${NOTIFICATION_COOLDOWN_PREFIX}${boardId}`);
};
