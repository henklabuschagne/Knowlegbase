/**
 * Mock API Layer - Attachments Domain
 * Mirrors: AttachmentController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { AttachmentDto } from '../../types/dto';

// GET /api/attachment/article/:articleId
export async function getArticleAttachments(articleId: number, includeDeleted = false): Promise<ApiResult<AttachmentDto[]>> {
  return mockApiCall(() => appStore.getArticleAttachments(articleId, includeDeleted));
}

// POST /api/attachment
export async function addAttachment(data: Partial<AttachmentDto> & { articleId: number; fileName: string }): Promise<ApiResult<AttachmentDto>> {
  if (!data.fileName?.trim()) {
    return errorResponse('VALIDATION_ERROR', 'File name is required');
  }
  return mockApiCall(() => appStore.addAttachment(data));
}

// DELETE /api/attachment/:id
export async function deleteAttachment(attachmentId: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteAttachment(attachmentId);
    if (!result) throw new Error(`Attachment ${attachmentId} not found`);
    return result;
  });
}