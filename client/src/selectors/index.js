import router from './router';
import common from './common';
import core from './core';
import modals from './modals';
import positioning from './positioning';
import users from './users';
import projects from './projects';
import projectManagers from './project-managers';
import backgroundImages from './background-images';
import baseCustomFieldGroups from './base-custom-field-groups';
import boards from './boards';
import boardMemberships from './board-memberships';
import labels from './labels';
import lists from './lists';
import cards from './cards';
import taskLists from './task-lists';
import tasks from './tasks';
import attachments from './attachments';
import customFieldGroups from './custom-field-groups';
import customFields from './custom-fields';
import customFieldValues from './custom-field-values';
import comments from './comments';
import activities from './activities';
import notifications from './notifications';
import notificationServices from './notification-services';
import marketing from './marketing';
import design from './design';
import inventory from './inventory';
import postizIntegrations from './postiz-integrations';
import projectIntegrations from './project-integrations';

export default {
  ...router,
  ...common,
  ...core,
  ...modals,
  ...positioning,
  ...users,
  ...projects,
  ...projectManagers,
  ...backgroundImages,
  ...baseCustomFieldGroups,
  ...boards,
  ...boardMemberships,
  ...labels,
  ...lists,
  ...cards,
  ...taskLists,
  ...tasks,
  ...attachments,
  ...customFieldGroups,
  ...customFields,
  ...customFieldValues,
  ...comments,
  ...activities,
  ...notifications,
  ...notificationServices,
  ...marketing,
  ...design,
  ...inventory,
  ...postizIntegrations,
  ...projectIntegrations,
};
