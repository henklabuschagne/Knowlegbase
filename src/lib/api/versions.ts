/**
 * Mock API Layer - Article Versions Domain
 * Mirrors: ArticleVersionsController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { StoredArticleVersion } from '../appStore';

// GET /api/articleversions/:articleId
export async function getArticleVersions(articleId: number): Promise<ApiResult<StoredArticleVersion[]>> {
  return mockApiCall(() => appStore.getArticleVersions(articleId));
}

// GET /api/articleversions/version/:versionId
export async function getVersionById(versionId: number): Promise<ApiResult<StoredArticleVersion>> {
  return mockApiCall(() => {
    const version = appStore.getVersionById(versionId);
    if (!version) throw new Error(`Version ${versionId} not found`);
    return version;
  });
}

// POST /api/articleversions/:articleId/restore/:versionId
export async function restoreVersion(articleId: number, versionId: number): Promise<ApiResult<any>> {
  return mockApiCall(() => {
    const result = appStore.restoreVersion(articleId, versionId);
    if (!result) throw new Error(`Version ${versionId} not found for article ${articleId}`);
    return result;
  });
}
