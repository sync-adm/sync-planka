import http from './http';
import socket from './socket';
import config from './config';
import accessTokens from './access-tokens';
import users from './users';
import projects from './projects';
import projectManagers from './project-managers';
import projectIntegrations from './project-integrations';
import backgroundImages from './background-images';
import baseCustomFieldGroups from './base-custom-field-groups';
import boards from './boards';
import boardMemberships from './board-memberships';
import labels from './labels';
import lists from './lists';
import cards from './cards';
import cardMemberships from './card-memberships';
import cardLabels from './card-labels';
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
import postizPosts from './postiz-posts';

export { http, socket };

export default {
  ...config,
  ...accessTokens,
  ...users,
  ...projects,
  ...projectManagers,
  ...projectIntegrations,
  ...backgroundImages,
  ...baseCustomFieldGroups,
  ...boards,
  ...boardMemberships,
  ...labels,
  ...lists,
  ...cards,
  ...cardMemberships,
  ...cardLabels,
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
  ...postizPosts,
};
