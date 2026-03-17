/**
 * Mock API Layer - Activity Log Domain
 * Mirrors: ActivityLogController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { ActivityLog, CreateActivityLog } from '../../types/dto';

// GET /api/activitylog
export async function getActivityLogs(params?: {
  entityType?: string;
  entityId?: number;
  userId?: number;
  action?: string;
  limit?: number;
}): Promise<ApiResult<ActivityLog[]>> {
  return mockApiCall(() => {
    let filtered = [...appStore.activityLogs];
    if (params?.entityType) filtered = filtered.filter(l => l.entityType === params.entityType);
    if (params?.entityId) filtered = filtered.filter(l => l.entityId === params.entityId);
    if (params?.userId) filtered = filtered.filter(l => l.userId === params.userId);
    if (params?.action) filtered = filtered.filter(l => l.action === params.action);
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (params?.limit) filtered = filtered.slice(0, params.limit);
    return filtered;
  });
}

// POST /api/activitylog (fire-and-forget side effect)
export async function addActivityLog(data: CreateActivityLog): Promise<ApiResult<ActivityLog>> {
  return mockApiCall(() => appStore.addActivityLog(data));
}