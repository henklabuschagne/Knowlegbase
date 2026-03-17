/**
 * Mock API Layer - Search & AI Domain
 * Mirrors: SearchController + AISearchController endpoints
 */

import { appStore } from '../appStore';
import type { AIConfig, ChatMessage, SearchHistoryEntry } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';

// POST /api/search
export async function addSearchHistory(query: string, resultCount: number): Promise<ApiResult<void>> {
  return mockApiCall(() => appStore.addSearchHistory(query, resultCount));
}

// GET /api/search/recent
export async function getRecentSearches(limit?: number): Promise<ApiResult<SearchHistoryEntry[]>> {
  return mockApiCall(() => appStore.getRecentSearches(limit));
}

// POST /api/aisearch/message
export async function addChatMessage(msg: ChatMessage): Promise<ApiResult<void>> {
  return mockApiCall(() => appStore.addChatMessage(msg));
}

// DELETE /api/aisearch/history
export async function clearChatHistory(): Promise<ApiResult<void>> {
  return mockApiCall(() => appStore.clearChatHistory());
}

// GET /api/aisearch/config
export async function getAIConfig(): Promise<ApiResult<AIConfig>> {
  return mockApiCall(() => appStore.aiConfig);
}

// PUT /api/aisearch/config
export async function updateAIConfig(updates: Partial<AIConfig>): Promise<ApiResult<AIConfig>> {
  return mockApiCall(() => {
    appStore.updateAIConfig(updates);
    return appStore.aiConfig;
  });
}
