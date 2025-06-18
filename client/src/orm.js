import { ORM } from 'redux-orm';

import {
  Activity,
  Attachment,
  BackgroundImage,
  BaseCustomFieldGroup,
  Board,
  BoardMembership,
  Card,
  Comment,
  CustomField,
  CustomFieldGroup,
  CustomFieldValue,
  Label,
  List,
  Notification,
  NotificationService,
  Project,
  ProjectManager,
  Task,
  TaskList,
  User,
} from './models';

const orm = new ORM({
  stateSelector: (state) => state.orm,
});

orm.register(
  User,
  Project,
  ProjectManager,
  BackgroundImage,
  BaseCustomFieldGroup,
  Board,
  BoardMembership,
  Label,
  List,
  Card,
  TaskList,
  Task,
  Attachment,
  CustomFieldGroup,
  CustomField,
  CustomFieldValue,
  Comment,
  Activity,
  Notification,
  NotificationService,
);

export default orm;
