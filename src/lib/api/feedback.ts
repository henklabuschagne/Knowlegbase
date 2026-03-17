/**
 * Mock API Layer - Feedback Domain
 * Mirrors: FeedbackController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { FeedbackDto, SubmitFeedbackDto, ResolveFeedbackDto } from '../../types/dto';

// GET /api/feedback
export async function getAllFeedback(params?: {
  articleId?: number;
  userId?: number;
  rating?: number;
  category?: string;
  isResolved?: boolean;
}): Promise<ApiResult<FeedbackDto[]>> {
  return mockApiCall(() => {
    let filtered = [...appStore.feedback];
    if (params?.articleId) filtered = filtered.filter(f => f.articleId === params.articleId);
    if (params?.userId) filtered = filtered.filter(f => f.userId === params.userId);
    if (params?.rating) filtered = filtered.filter(f => f.rating === params.rating);
    if (params?.category) filtered = filtered.filter(f => f.category === params.category);
    if (params?.isResolved !== undefined) filtered = filtered.filter(f => f.isResolved === params.isResolved);
    return filtered;
  });
}

// POST /api/feedback/article/:articleId
export async function submitFeedback(articleId: number, data: SubmitFeedbackDto): Promise<ApiResult<FeedbackDto>> {
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    return errorResponse('VALIDATION_ERROR', 'Rating must be between 1 and 5');
  }
  return mockApiCall(() => appStore.submitFeedback(articleId, data));
}

// PUT /api/feedback/:id/resolve
export async function resolveFeedback(feedbackId: number, data: ResolveFeedbackDto): Promise<ApiResult<FeedbackDto>> {
  return mockApiCall(() => {
    const result = appStore.resolveFeedback(feedbackId, data);
    if (!result) throw new Error(`Feedback ${feedbackId} not found`);
    return result;
  });
}

// PUT /api/feedback/:id/unresolve
export async function unresolveFeedback(feedbackId: number): Promise<ApiResult<FeedbackDto>> {
  return mockApiCall(() => {
    const result = appStore.unresolveFeedback(feedbackId);
    if (!result) throw new Error(`Feedback ${feedbackId} not found`);
    return result;
  });
}

// DELETE /api/feedback/:id
export async function deleteFeedback(feedbackId: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteFeedback(feedbackId);
    if (!result) throw new Error(`Feedback ${feedbackId} not found`);
    return result;
  });
}

// GET /api/feedback/article/:articleId/metrics
export async function getArticleMetrics(articleId: number): Promise<ApiResult<ReturnType<typeof appStore.getArticleMetrics>>> {
  return mockApiCall(() => appStore.getArticleMetrics(articleId));
}