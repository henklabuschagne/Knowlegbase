/**
 * Mock API Layer - Articles Domain
 * Mirrors: ArticleController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { ArticleDto, CreateArticleRequest, UpdateArticleRequest } from '../../types/dto';

// POST /api/articles
export async function createArticle(data: CreateArticleRequest): Promise<ApiResult<ArticleDto>> {
  if (!data.title?.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Article title is required');
  }
  return mockApiCall(() => appStore.createArticle(data));
}

// PUT /api/articles/:id
export async function updateArticle(id: number, data: Partial<ArticleDto> & { tagIds?: number[]; changeDescription?: string }): Promise<ApiResult<ArticleDto>> {
  return mockApiCall(() => {
    const result = appStore.updateArticle(id, data);
    if (!result) throw new Error(`Article ${id} not found`);
    return result;
  });
}

// DELETE /api/articles/:id
export async function deleteArticle(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteArticle(id);
    if (!result) throw new Error(`Article ${id} not found`);
    return result;
  });
}

// GET /api/articles
export async function getArticles(params?: {
  searchTerm?: string;
  statusId?: number;
  isPublished?: boolean;
  isInternal?: boolean;
  tagIds?: number[];
  clientId?: number;
  createdBy?: number;
  page?: number;
  pageSize?: number;
}): Promise<ApiResult<{ data: ArticleDto[]; total: number }>> {
  return mockApiCall(() => appStore.getArticlesFiltered(params));
}

// GET /api/articles/:id
export async function getArticleById(id: number): Promise<ApiResult<ArticleDto>> {
  return mockApiCall(() => {
    const article = appStore.getArticleById(id);
    if (!article) throw new Error(`Article ${id} not found`);
    return article;
  });
}

// PUT /api/articles/:id/publish
export async function publishArticle(id: number): Promise<ApiResult<ArticleDto>> {
  return mockApiCall(() => {
    const result = appStore.publishArticle(id);
    if (!result) throw new Error(`Article ${id} not found`);
    return result;
  });
}

// POST /api/articles/:id/view
export async function trackArticleView(id: number): Promise<ApiResult<void>> {
  return mockApiCall(() => {
    appStore.incrementArticleViews(id);
  });
}