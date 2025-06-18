import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'semantic-ui-react';
import { Popup } from '../../lib/custom-ui';

import entryActions from '../../entry-actions';
import { useForm } from '../../hooks';
import TaskListEditor from './TaskListEditor';

const AddTaskListStep = React.memo(({ onClose }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const [data, handleFieldChange] = useForm({
    name: t('common.taskList', {
      context: 'title',
    }),
    showOnFrontOfCard: true,
  });

  const taskListEditorRef = useRef(null);

  const handleSubmit = useCallback(() => {
    const cleanData = {
      ...data,
      name: data.name.trim(),
    };

    if (!cleanData.name) {
      taskListEditorRef.current.selectNameField();
      return;
    }

    dispatch(entryActions.createTaskListInCurrentCard(cleanData));

    onClose();
  }, [onClose, dispatch, data, taskListEditorRef]);

  return (
    <>
      <Popup.Header>
        {t('common.addTaskList', {
          context: 'title',
        })}
      </Popup.Header>
      <Popup.Content>
        <Form onSubmit={handleSubmit}>
          <TaskListEditor ref={taskListEditorRef} data={data} onFieldChange={handleFieldChange} />
          <Button positive content={t('action.addTaskList')} />
        </Form>
      </Popup.Content>
    </>
  );
});

AddTaskListStep.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddTaskListStep;
