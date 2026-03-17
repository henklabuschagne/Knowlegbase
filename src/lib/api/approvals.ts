/**
 * Mock API Layer - Approvals Domain
 * Mirrors: ApprovalController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { ApprovalDto } from '../../types/dto';

// GET /api/approval/pending
export async function getPendingApprovals(): Promise<ApiResult<ApprovalDto[]>> {
  return mockApiCall(() => appStore.pendingApprovals);
}

// GET /api/approval
export async function getAllApprovals(): Promise<ApiResult<ApprovalDto[]>> {
  return mockApiCall(() => appStore.approvals);
}

// POST /api/approval/submit
export async function submitForApproval(articleId: number, comments?: string): Promise<ApiResult<ApprovalDto>> {
  if (!articleId) {
    return errorResponse('VALIDATION_ERROR', 'Article ID is required');
  }
  return mockApiCall(() => appStore.submitForApproval(articleId, comments));
}

// PUT /api/approval/:id/approve
export async function approveArticle(approvalId: number, comments?: string): Promise<ApiResult<ApprovalDto>> {
  return mockApiCall(() => {
    const result = appStore.approveArticle(approvalId, comments);
    if (!result) throw new Error(`Approval ${approvalId} not found`);
    return result;
  });
}

// PUT /api/approval/:id/reject
export async function rejectApproval(approvalId: number, reason?: string): Promise<ApiResult<ApprovalDto>> {
  return mockApiCall(() => {
    const result = appStore.rejectApproval(approvalId, reason);
    if (!result) throw new Error(`Approval ${approvalId} not found`);
    return result;
  });
}