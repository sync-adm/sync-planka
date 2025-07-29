import { combineReducers } from 'redux';

import router from './router';
import socket from './socket';
import orm from './orm';
import common from './common';
import auth from './auth';
import core from './core';
import ui from './ui';
import marketing from './marketing';
import design from './design';
import inventory from './inventory';
import postizIntegrations from './postiz-integrations';
import projectIntegrations from './project-integrations';

export default combineReducers({
  router,
  socket,
  orm,
  common,
  auth,
  core,
  ui,
  marketing,
  design,
  inventory,
  postizIntegrations,
  projectIntegrations,
});
