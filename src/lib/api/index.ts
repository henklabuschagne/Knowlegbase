/**
 * API Barrel Export
 * 
 * Single import point for all API domain functions.
 * Components use: import { api } from '../lib/api'
 */

import * as articles from './articles';
import * as users from './users';
import * as tags from './tags';
import * as requests from './requests';
import * as notifications from './notifications';
import * as feedback from './feedback';
import * as approvals from './approvals';
import * as attachments from './attachments';
import * as templates from './templates';
import * as versions from './versions';
import * as activity from './activity';
import * as search from './search';
import * as advancedSearch from './advancedSearch';
import * as analytics from './analytics';
import * as exportImport from './exportImport';

export const api = {
  articles,
  users,
  tags,
  requests,
  notifications,
  feedback,
  approvals,
  attachments,
  templates,
  versions,
  activity,
  search,
  advancedSearch,
  analytics,
  exportImport,
};

export type { ApiResult, ApiError, PaginatedResult } from './types';
export { apiConfig } from './config';