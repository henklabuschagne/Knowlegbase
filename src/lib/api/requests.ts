/**
 * Mock API Layer - Article Requests Domain
 * Mirrors: ArticleRequestController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { ArticleRequestDto, CreateRequestDto, UpdateRequestDto } from '../../types/dto';

// GET /api/articlerequest
export async function getRequests(params?: {
  statusId?: number;
  requestedByUserId?: number;
  assignedToUserId?: number;
  priority?: number;
}): Promise<ApiResult<ArticleRequestDto[]>> {
  return mockApiCall(() => {
    let filtered = [...appStore.requests];
    if (params?.statusId) filtered = filtered.filter(r => r.statusId === params.statusId);
    if (params?.requestedByUserId) filtered = filtered.filter(r => r.requestedByUserId === params.requestedByUserId);
    if (params?.assignedToUserId) filtered = filtered.filter(r => r.assignedToUserId === params.assignedToUserId);
    if (params?.priority) filtered = filtered.filter(r => r.priority === params.priority);
    return filtered;
  });
}

// GET /api/articlerequest/:id
export async function getRequestById(id: number): Promise<ApiResult<ArticleRequestDto>> {
  return mockApiCall(() => {
    const req = appStore.requests.find(r => r.requestId === id);
    if (!req) throw new Error(`Request ${id} not found`);
    return req;
  });
}

// POST /api/articlerequest
export async function createRequest(data: CreateRequestDto): Promise<ApiResult<ArticleRequestDto>> {
  if (!data.title?.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Request title is required');
  }
  return mockApiCall(() => appStore.createRequest(data));
}

// PUT /api/articlerequest/:id
export async function updateRequest(id: number, data: UpdateRequestDto): Promise<ApiResult<ArticleRequestDto>> {
  return mockApiCall(() => {
    const result = appStore.updateRequest(id, data);
    if (!result) throw new Error(`Request ${id} not found`);
    return result;
  });
}

// DELETE /api/articlerequest/:id
export async function deleteRequest(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteRequest(id);
    if (!result) throw new Error(`Request ${id} not found`);
    return result;
  });
}