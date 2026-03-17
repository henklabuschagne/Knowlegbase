/**
 * Mock API Layer - Tags Domain
 * Mirrors: TagController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { TagDto } from '../../types/dto';

// GET /api/tags
export async function getTags(tagTypeId?: number): Promise<ApiResult<TagDto[]>> {
  return mockApiCall(() => {
    if (tagTypeId) {
      return appStore.tags.filter(t => t.tagTypeId === tagTypeId);
    }
    return appStore.tags;
  });
}

// GET /api/tags/:id
export async function getTagById(id: number): Promise<ApiResult<TagDto>> {
  return mockApiCall(() => {
    const tag = appStore.tags.find(t => t.tagId === id);
    if (!tag) throw new Error(`Tag ${id} not found`);
    return tag;
  });
}

// POST /api/tags
export async function createTag(data: {
  tagTypeId: number;
  tagName: string;
  tagValue?: string;
  description?: string;
  colorCode?: string;
}): Promise<ApiResult<TagDto>> {
  if (!data.tagName?.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Tag name is required');
  }
  return mockApiCall(() => appStore.createTag(data));
}

// PUT /api/tags/:id
export async function updateTag(id: number, data: Partial<TagDto>): Promise<ApiResult<TagDto>> {
  return mockApiCall(() => {
    const result = appStore.updateTag(id, data);
    if (!result) throw new Error(`Tag ${id} not found`);
    return result;
  });
}

// DELETE /api/tags/:id
export async function deleteTag(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteTag(id);
    if (!result) throw new Error(`Tag ${id} not found`);
    return result;
  });
}

// GET /api/tags/types
export async function getTagTypes(): Promise<ApiResult<typeof appStore.tagTypes>> {
  return mockApiCall(() => appStore.tagTypes);
}