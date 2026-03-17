/**
 * Mock API Layer - Analytics Domain
 * Mirrors: AnalyticsController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type {
  DashboardAnalyticsDto,
  OverallStatsDto,
  ViewTrendDto,
  SearchTrendDto,
  TopArticleDto,
  TopSearchQueryDto,
  ActivitySummaryDto,
  FeedbackSummaryDto,
} from '../../types/dto';

// POST /api/analytics/track/view/:articleId
export async function trackArticleView(articleId: number): Promise<ApiResult<void>> {
  return mockApiCall(() => {
    appStore.incrementArticleViews(articleId);
  });
}

// POST /api/analytics/log/search
export async function logSearch(
  searchQuery: string,
  searchType: string,
  resultsCount: number,
): Promise<ApiResult<number>> {
  return mockApiCall(() => {
    appStore.addSearchHistory(searchQuery, resultsCount);
    return Date.now(); // mock search ID
  });
}

// POST /api/analytics/log/activity
export async function logActivity(
  activityType: string,
  entityType?: string,
  entityId?: number,
  details?: string,
): Promise<ApiResult<void>> {
  return mockApiCall(() => {
    appStore.addActivityLog({
      entityType: entityType || activityType,
      entityId: entityId || 0,
      action: activityType,
      description: details,
    });
  });
}

// GET /api/analytics/dashboard
export async function getDashboardAnalytics(
  startDate?: Date,
  endDate?: Date,
): Promise<ApiResult<DashboardAnalyticsDto>> {
  return mockApiCall(() => {
    const articles = appStore.articles;
    const users = appStore.users;
    const allFeedback = appStore.feedback;
    const requests = appStore.requests;
    const approvals = appStore.approvals;
    const searchHistory = appStore.searchHistory;

    // Overall stats
    const overallStats: OverallStatsDto = {
      totalPublishedArticles: articles.filter(a => a.isPublished).length,
      totalActiveUsers: users.filter(u => u.isActive).length,
      totalViewsInPeriod: articles.reduce((sum, a) => sum + (a.viewCount || 0), 0),
      totalSearchesInPeriod: searchHistory.length,
      totalFeedbackInPeriod: allFeedback.length,
      pendingRequests: requests.filter(r => r.statusId === 1).length,
      pendingApprovals: approvals.filter(a => a.statusId === 1).length,
    };

    // View trend (mock 30 days)
    const viewTrend: ViewTrendDto[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      viewTrend.push({
        viewDate: date.toISOString().split('T')[0],
        viewCount: Math.floor(Math.random() * 50) + 10,
        uniqueUsers: Math.floor(Math.random() * 20) + 5,
      });
    }

    // Search trend (mock 30 days)
    const searchTrend: SearchTrendDto[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      searchTrend.push({
        searchDate: date.toISOString().split('T')[0],
        searchCount: Math.floor(Math.random() * 30) + 5,
        searchType: 'Standard',
        avgResultsCount: Math.floor(Math.random() * 10) + 2,
      });
    }

    // Top viewed articles
    const topViewedArticles: TopArticleDto[] = [...articles]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 10)
      .map(a => {
        const fb = allFeedback.filter(f => f.articleId === a.articleId);
        const avgRating = fb.length > 0
          ? fb.reduce((sum, f) => sum + f.rating, 0) / fb.length
          : undefined;
        return {
          articleId: a.articleId,
          title: a.title,
          summary: a.summary,
          averageRating: avgRating,
          totalFeedback: fb.length,
          helpfulCount: fb.filter(f => f.isHelpful === true).length,
          notHelpfulCount: fb.filter(f => f.isHelpful === false).length,
          totalViews: a.viewCount,
          viewCount: a.viewCount,
          uniqueViewers: Math.floor((a.viewCount || 0) * 0.7),
        };
      });

    // Top search queries
    const queryMap = new Map<string, number>();
    searchHistory.forEach(s => {
      queryMap.set(s.query, (queryMap.get(s.query) || 0) + 1);
    });
    const topSearchQueries: TopSearchQueryDto[] = Array.from(queryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({
        searchQuery: query,
        searchCount: count,
        avgResultsCount: Math.floor(Math.random() * 10) + 1,
        searchType: 'Standard',
      }));
    // Add some fallback mock queries if none exist
    if (topSearchQueries.length === 0) {
      topSearchQueries.push(
        { searchQuery: 'authentication', searchCount: 45, avgResultsCount: 8, searchType: 'Standard' },
        { searchQuery: 'rate limiting', searchCount: 32, avgResultsCount: 5, searchType: 'Standard' },
        { searchQuery: 'security', searchCount: 28, avgResultsCount: 12, searchType: 'Standard' },
        { searchQuery: 'API integration', searchCount: 21, avgResultsCount: 6, searchType: 'Standard' },
        { searchQuery: 'webhooks', searchCount: 15, avgResultsCount: 3, searchType: 'Standard' },
      );
    }

    // User activity summary
    const activityLogs = appStore.activityLogs;
    const actionMap = new Map<string, { count: number; users: Set<number> }>();
    activityLogs.forEach(log => {
      const existing = actionMap.get(log.action);
      if (existing) {
        existing.count++;
        if (log.userId) existing.users.add(log.userId);
      } else {
        const users = new Set<number>();
        if (log.userId) users.add(log.userId);
        actionMap.set(log.action, { count: 1, users });
      }
    });
    const userActivitySummary: ActivitySummaryDto[] = Array.from(actionMap.entries()).map(([action, data]) => ({
      activityType: action,
      activityCount: data.count,
      uniqueUsers: data.users.size,
    }));

    // Feedback summary
    const categoryMap = new Map<string, FeedbackSummaryDto>();
    const overallFbSummary: FeedbackSummaryDto = {
      totalFeedback: allFeedback.length,
      helpfulCount: allFeedback.filter(f => f.isHelpful === true).length,
      notHelpfulCount: allFeedback.filter(f => f.isHelpful === false).length,
      avgRating: allFeedback.length > 0
        ? allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length
        : undefined,
      resolvedCount: allFeedback.filter(f => f.isResolved).length,
    };
    const feedbackSummary: FeedbackSummaryDto[] = [overallFbSummary];

    allFeedback.forEach(f => {
      const cat = f.category || 'General';
      const existing = categoryMap.get(cat);
      if (existing) {
        existing.totalFeedback++;
        if (f.isHelpful === true) existing.helpfulCount++;
        if (f.isHelpful === false) existing.notHelpfulCount++;
        if (f.isResolved) existing.resolvedCount++;
      } else {
        categoryMap.set(cat, {
          totalFeedback: 1,
          helpfulCount: f.isHelpful === true ? 1 : 0,
          notHelpfulCount: f.isHelpful === false ? 1 : 0,
          resolvedCount: f.isResolved ? 1 : 0,
          category: cat,
        });
      }
    });
    categoryMap.forEach(v => feedbackSummary.push(v));

    return {
      overallStats,
      viewTrend,
      searchTrend,
      topViewedArticles,
      topSearchQueries,
      userActivitySummary,
      feedbackSummary,
    };
  });
}
