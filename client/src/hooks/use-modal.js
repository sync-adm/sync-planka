import { useCallback, useState } from 'react';

// TODO: rename?
export default (initialParams) => {
  const [modal, setModal] = useState(() => initialParams);

  const open = useCallback((params) => {
    setModal(params);
  }, []);

  const handleClose = useCallback(() => {
    setModal(null);
  }, []);

  return [modal, open, handleClose];
};
