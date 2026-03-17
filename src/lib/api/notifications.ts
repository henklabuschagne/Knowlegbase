/**
 * Mock API Layer - Notifications Domain
 * Mirrors: NotificationController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { NotificationDto } from '../../types/dto';

// GET /api/notification
export async function getNotifications(userId?: number): Promise<ApiResult<NotificationDto[]>> {
  return mockApiCall(() => appStore.getNotificationsForUser(userId));
}

// GET /api/notification/unread-count
export async function getUnreadCount(userId?: number): Promise<ApiResult<number>> {
  return mockApiCall(() => appStore.getUnreadNotificationCount(userId));
}

// PUT /api/notification/:id/read
export async function markAsRead(notificationId: number): Promise<ApiResult<void>> {
  return mockApiCall(() => appStore.markNotificationAsRead(notificationId));
}

// PUT /api/notification/read-all
export async function markAllAsRead(userId?: number): Promise<ApiResult<void>> {
  return mockApiCall(() => appStore.markAllNotificationsAsRead(userId));
}

// POST /api/notification (internal - fire-and-forget)
export async function createNotification(data: Omit<NotificationDto, 'notificationId' | 'isRead' | 'createdAt'>): Promise<ApiResult<NotificationDto>> {
  return mockApiCall(() => appStore.createNotification(data));
}