/**
 * Mock API Layer - Advanced Search Domain
 * Mirrors: SearchController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type {
  AdvancedSearchRequest,
  AdvancedSearchResult,
  SearchResultArticle,
  SearchFacets,
  FacetItem,
  SavedSearch,
  CreateSavedSearch,
  SearchHistoryDto,
} from '../../types/dto';

// ─── Mock saved searches store ─────────────────────────
let savedSearches: SavedSearch[] = [
  {
    savedSearchId: 1,
    userId: 1,
    searchName: 'Published Internal Articles',
    searchQuery: '',
    filterCriteria: JSON.stringify({ statusIds: [4], isInternal: true }),
    isPublic: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z',
    useCount: 5,
    createdByName: 'Admin User',
  },
  {
    savedSearchId: 2,
    userId: 1,
    searchName: 'High-rated articles',
    searchQuery: '',
    filterCriteria: JSON.stringify({ minRating: 4 }),
    isPublic: false,
    createdAt: '2024-11-10T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
    useCount: 3,
    createdByName: 'Admin User',
  },
];

let nextSavedSearchId = 100;

// POST /api/search/advanced
export async function advancedSearch(request: AdvancedSearchRequest): Promise<ApiResult<AdvancedSearchResult>> {
  return mockApiCall(() => {
    let filtered = [...appStore.articles];

    // Text search
    if (request.searchQuery) {
      const q = request.searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary?.toLowerCase().includes(q) ||
        a.content?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (request.statusIds?.length) {
      filtered = filtered.filter(a => request.statusIds!.includes(a.statusId));
    }

    // Tag filter
    if (request.tagIds?.length) {
      filtered = filtered.filter(a =>
        request.tagIds!.some(tid => a.tags?.some(t => t.tagId === tid))
      );
    }

    // Author filter
    if (request.authorId) {
      filtered = filtered.filter(a => a.createdBy === request.authorId);
    }

    // Visibility filters
    if (request.isInternal !== undefined) {
      filtered = filtered.filter(a => a.isInternal === request.isInternal);
    }
    if (request.isExternal !== undefined && request.isExternal) {
      filtered = filtered.filter(a => !a.isInternal);
    }

    // Date filters
    if (request.createdAfter) {
      const after = new Date(request.createdAfter).getTime();
      filtered = filtered.filter(a => new Date(a.createdAt).getTime() >= after);
    }
    if (request.createdBefore) {
      const before = new Date(request.createdBefore).getTime();
      filtered = filtered.filter(a => new Date(a.createdAt).getTime() <= before);
    }

    // Rating filter
    if (request.minRating) {
      const allFeedback = appStore.feedback;
      filtered = filtered.filter(a => {
        const articleFb = allFeedback.filter(f => f.articleId === a.articleId);
        if (articleFb.length === 0) return false;
        const avg = articleFb.reduce((sum, f) => sum + f.rating, 0) / articleFb.length;
        return avg >= request.minRating!;
      });
    }

    // View count filter
    if (request.minViewCount) {
      filtered = filtered.filter(a => (a.viewCount || 0) >= request.minViewCount!);
    }

    // Sort
    const sortBy = request.sortBy || 'CreatedAt';
    const sortOrder = request.sortOrder === 'ASC' ? 1 : -1;
    filtered.sort((a, b) => {
      const aVal = sortBy === 'Title' ? a.title : sortBy === 'ViewCount' ? a.viewCount : a.createdAt;
      const bVal = sortBy === 'Title' ? b.title : sortBy === 'ViewCount' ? b.viewCount : b.createdAt;
      if (typeof aVal === 'string' && typeof bVal === 'string') return aVal.localeCompare(bVal) * sortOrder;
      return ((aVal as number) - (bVal as number)) * sortOrder;
    });

    const totalCount = filtered.length;
    const pageSize = request.pageSize || 20;
    const pageNumber = request.pageNumber || 1;
    const totalPages = Math.ceil(totalCount / pageSize);
    const start = (pageNumber - 1) * pageSize;

    const allFeedback = appStore.feedback;
    const articles: SearchResultArticle[] = filtered.slice(start, start + pageSize).map(a => {
      const articleFb = allFeedback.filter(f => f.articleId === a.articleId);
      const avgRating = articleFb.length > 0
        ? articleFb.reduce((sum, f) => sum + f.rating, 0) / articleFb.length
        : undefined;
      return {
        articleId: a.articleId,
        title: a.title,
        summary: a.summary,
        statusId: a.statusId,
        statusName: a.statusName,
        authorId: a.createdBy,
        authorName: a.createdByName,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        publishedAt: a.publishedAt,
        isInternal: a.isInternal,
        versionNumber: a.versionNumber,
        viewCount: a.viewCount,
        averageRating: avgRating,
        totalFeedback: articleFb.length,
        relevanceScore: request.searchQuery ? 1 : undefined,
      };
    });

    return { articles, totalCount, pageNumber, pageSize, totalPages };
  });
}

// GET /api/search/facets
export async function getSearchFacets(searchQuery?: string): Promise<ApiResult<SearchFacets>> {
  return mockApiCall(() => {
    const articles = appStore.articles;

    // Status facets
    const statusMap = new Map<number, { name: string; count: number }>();
    articles.forEach(a => {
      const existing = statusMap.get(a.statusId);
      if (existing) existing.count++;
      else statusMap.set(a.statusId, { name: a.statusName, count: 1 });
    });
    const statuses: FacetItem[] = Array.from(statusMap.entries()).map(([id, v]) => ({
      id, name: v.name, count: v.count,
    }));

    // Tag facets
    const tagMap = new Map<number, { name: string; count: number; colorCode?: string }>();
    articles.forEach(a => {
      a.tags?.forEach(t => {
        const existing = tagMap.get(t.tagId);
        if (existing) existing.count++;
        else tagMap.set(t.tagId, { name: t.tagName, count: 1, colorCode: t.colorCode });
      });
    });
    const tags: FacetItem[] = Array.from(tagMap.entries()).map(([id, v]) => ({
      id, name: v.name, count: v.count, colorCode: v.colorCode,
    }));

    // Author facets
    const authorMap = new Map<number, { name: string; count: number }>();
    articles.forEach(a => {
      const existing = authorMap.get(a.createdBy);
      if (existing) existing.count++;
      else authorMap.set(a.createdBy, { name: a.createdByName, count: 1 });
    });
    const authors: FacetItem[] = Array.from(authorMap.entries()).map(([id, v]) => ({
      id, name: v.name, count: v.count,
    }));

    // Visibility facets
    const internalCount = articles.filter(a => a.isInternal).length;
    const externalCount = articles.filter(a => !a.isInternal).length;
    const visibility: FacetItem[] = [
      { name: 'Internal', count: internalCount },
      { name: 'External', count: externalCount },
    ];

    const dateRanges: FacetItem[] = [
      { name: 'Last 7 days', count: articles.filter(a => Date.now() - new Date(a.createdAt).getTime() < 7 * 86400000).length },
      { name: 'Last 30 days', count: articles.filter(a => Date.now() - new Date(a.createdAt).getTime() < 30 * 86400000).length },
      { name: 'Last 90 days', count: articles.filter(a => Date.now() - new Date(a.createdAt).getTime() < 90 * 86400000).length },
    ];

    return { statuses, tags, authors, visibility, dateRanges };
  });
}

// POST /api/search/saved
export async function saveSearch(data: CreateSavedSearch): Promise<ApiResult<number>> {
  return mockApiCall(() => {
    const currentUser = appStore.currentUser;
    const id = ++nextSavedSearchId;
    savedSearches.push({
      savedSearchId: id,
      userId: currentUser?.userId || 0,
      searchName: data.searchName,
      searchQuery: data.searchQuery,
      filterCriteria: JSON.stringify(data.filterCriteria),
      isPublic: data.isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      useCount: 0,
      createdByName: currentUser?.fullName,
    });
    return id;
  });
}

// GET /api/search/saved
export async function getSavedSearches(): Promise<ApiResult<SavedSearch[]>> {
  return mockApiCall(() => {
    const currentUser = appStore.currentUser;
    return savedSearches.filter(s =>
      s.isPublic || s.userId === (currentUser?.userId || 0)
    );
  });
}

// POST /api/search/saved/:id/use
export async function useSavedSearch(savedSearchId: number): Promise<ApiResult<void>> {
  return mockApiCall(() => {
    const search = savedSearches.find(s => s.savedSearchId === savedSearchId);
    if (search) {
      search.useCount++;
      search.lastUsedAt = new Date().toISOString();
    }
  });
}

// DELETE /api/search/saved/:id
export async function deleteSavedSearch(savedSearchId: number): Promise<ApiResult<void>> {
  return mockApiCall(() => {
    savedSearches = savedSearches.filter(s => s.savedSearchId !== savedSearchId);
  });
}

// GET /api/search/history
export async function getSearchHistory(limit = 20): Promise<ApiResult<SearchHistoryDto[]>> {
  return mockApiCall(() => {
    const recent = appStore.getRecentSearches(limit);
    return recent.map((s, i) => ({
      historyId: i + 1,
      userId: s.userId,
      searchQuery: s.query,
      resultsCount: s.resultCount,
      searchedAt: s.timestamp,
    }));
  });
}
