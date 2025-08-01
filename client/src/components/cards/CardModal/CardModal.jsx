import React, { useCallback, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { push } from '../../../lib/redux-router';

import selectors from '../../../selectors';
import entryActions from '../../../entry-actions';
import { useClosableModal } from '../../../hooks';
import { isListArchiveOrTrash } from '../../../utils/record-helpers';
import { isActiveTextElement } from '../../../utils/element-helpers';
import Paths from '../../../constants/Paths';
import { BoardMembershipRoles, CardTypes } from '../../../constants/Enums';
import ProjectContent from './ProjectContent';
import StoryContent from './StoryContent';
import AddAttachmentZone from './AddAttachmentZone';

import styles from './CardModal.module.scss';

const DIRECTION_BY_KEY = {
  ArrowLeft: -1,
  ArrowRight: 1,
};

const CardModal = React.memo(() => {
  const selectListById = useMemo(() => selectors.makeSelectListById(), []);

  const card = useSelector(selectors.selectCurrentCard);

  const canEdit = useSelector((state) => {
    const list = selectListById(state, card.listId);

    if (isListArchiveOrTrash(list)) {
      return false;
    }

    const boardMembership = selectors.selectCurrentUserMembershipForCurrentBoard(state);
    return !!boardMembership && boardMembership.role === BoardMembershipRoles.EDITOR;
  });

  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(push(Paths.BOARDS.replace(':id', card.boardId)));
  }, [card.boardId, dispatch]);

  const [ClosableModal, isClosableActiveRef] = useClosableModal();

  const navigationState = useMemo(() => {
    const referrer = document.referrer || '';
    const isFromMarketing = referrer.includes('/marketing');
    const isFromDesign = referrer.includes('/design');

    let from = null;
    if (isFromMarketing) {
      from = '/marketing';
    } else if (isFromDesign) {
      from = '/design';
    }

    return {
      from,
      showBackButton: isFromMarketing || isFromDesign,
    };
  }, []);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (isClosableActiveRef.current) {
        return;
      }

      if (isActiveTextElement(event.target)) {
        return;
      }

      if (!Object.keys(DIRECTION_BY_KEY).includes(event.key)) {
        return;
      }

      event.preventDefault();
      dispatch(entryActions.goToAdjacentCard(DIRECTION_BY_KEY[event.key]));
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [card, dispatch, isClosableActiveRef]);

  let Content;
  switch (card.type) {
    case CardTypes.PROJECT:
      Content = ProjectContent;

      break;
    case CardTypes.STORY:
      Content = StoryContent;

      break;
    default:
  }

  return (
    <ClosableModal
      closeIcon
      centered={false}
      className={classNames(styles.wrapper, card.type === CardTypes.STORY && styles.wrapperStory)}
      onClose={handleClose}
    >
      {canEdit ? (
        <AddAttachmentZone>
          <Content onClose={handleClose} navigationState={navigationState} />
        </AddAttachmentZone>
      ) : (
        <Content onClose={handleClose} navigationState={navigationState} />
      )}
    </ClosableModal>
  );
});

export default CardModal;
