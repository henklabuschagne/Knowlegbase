/**
 * Reactive Hook for Centralized Data Store
 * 
 * This is the ONLY way components should read state from the data store.
 * It subscribes to pub/sub slices and triggers re-renders when data changes.
 * 
 * Usage:
 *   const { articles, notifications, actions, reads } = useAppStore('articles', 'notifications');
 * 
 * Rules:
 * - Components NEVER import appStore directly
 * - All reads go through reactive properties or reads.*
 * - All writes go through actions.* (routed through API layer)
 */

import { useState, useEffect, useMemo } from 'react';
import { appStore, type Slice } from '../lib/appStore';
import { api } from '../lib/api';

export function useAppStore(...subscribeTo: Slice[]) {
  // Force re-render when subscribed slices change
  const [, bump] = useState(0);

  useEffect(() => {
    const unsubscribes = subscribeTo.map(slice =>
      appStore.subscribe(slice, () => bump(v => v + 1))
    );
    return () => unsubscribes.forEach(unsub => unsub());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeTo.join(',')]);

  // ─── Reactive State (re-renders on change) ───────────
  const currentUser = appStore.currentUser;
  const articles = appStore.articles;
  const users = appStore.users;
  const roles = appStore.roles;
  const teams = appStore.teams;
  const clients = appStore.clients;
  const tags = appStore.tags;
  const tagTypes = appStore.tagTypes;
  const requests = appStore.requests;
  const notifications = appStore.notifications;
  const feedback = appStore.feedback;
  const approvals = appStore.approvals;
  const attachments = appStore.attachments;
  const templates = appStore.templates;
  const articleVersions = appStore.articleVersions;
  const activityLogs = appStore.activityLogs;
  const searchHistory = appStore.searchHistory;
  const chatHistory = appStore.chatHistory;
  const aiConfig = appStore.aiConfig;

  // ─── Computed (derived from reactive state) ──────────
  const unreadNotificationCount = appStore.unreadNotificationCount;
  const pendingApprovals = appStore.pendingApprovals;
  const pendingRequestCount = appStore.pendingRequestCount;
  const publishedArticleCount = appStore.publishedArticleCount;
  const activeUserCount = appStore.activeUserCount;

  // ─── Sync Read Helpers ───────────────────────────────
  const reads = useMemo(() => ({
    getArticlesFiltered: appStore.getArticlesFiltered,
    getArticleById: appStore.getArticleById,
    getArticleAttachments: appStore.getArticleAttachments,
    getArticleVersions: appStore.getArticleVersions,
    getVersionById: appStore.getVersionById,
    getArticleMetrics: appStore.getArticleMetrics,
    getNotificationsForUser: appStore.getNotificationsForUser,
    getUnreadNotificationCount: appStore.getUnreadNotificationCount,
    getRecentSearches: appStore.getRecentSearches,
  }), []);

  // ─── Async Actions (routed through API layer) ───────
  const actions = useMemo(() => ({
    // Auth
    login: (email: string, password: string) => api.users.login(email, password),
    logout: () => api.users.logout(),

    // Articles
    createArticle: (data: Parameters<typeof api.articles.createArticle>[0]) =>
      api.articles.createArticle(data),
    updateArticle: (id: number, data: Parameters<typeof api.articles.updateArticle>[1]) =>
      api.articles.updateArticle(id, data),
    deleteArticle: (id: number) => api.articles.deleteArticle(id),
    getArticles: (params?: Parameters<typeof api.articles.getArticles>[0]) =>
      api.articles.getArticles(params),
    getArticleById: (id: number) => api.articles.getArticleById(id),
    publishArticle: (id: number) => api.articles.publishArticle(id),
    trackArticleView: (id: number) => api.articles.trackArticleView(id),

    // Users
    getUsers: () => api.users.getUsers(),
    getUserById: (id: number) => api.users.getUserById(id),
    createUser: (data: Parameters<typeof api.users.createUser>[0]) =>
      api.users.createUser(data),
    updateUser: (id: number, data: Parameters<typeof api.users.updateUser>[1]) =>
      api.users.updateUser(id, data),
    deleteUser: (id: number) => api.users.deleteUser(id),
    getRoles: () => api.users.getRoles(),
    getTeams: () => api.users.getTeams(),
    getClients: () => api.users.getClients(),

    // Tags
    getTags: (tagTypeId?: number) => api.tags.getTags(tagTypeId),
    createTag: (data: Parameters<typeof api.tags.createTag>[0]) =>
      api.tags.createTag(data),
    updateTag: (id: number, data: Parameters<typeof api.tags.updateTag>[1]) =>
      api.tags.updateTag(id, data),
    deleteTag: (id: number) => api.tags.deleteTag(id),
    getTagTypes: () => api.tags.getTagTypes(),

    // Requests
    getRequests: (params?: Parameters<typeof api.requests.getRequests>[0]) =>
      api.requests.getRequests(params),
    createRequest: (data: Parameters<typeof api.requests.createRequest>[0]) =>
      api.requests.createRequest(data),
    updateRequest: (id: number, data: Parameters<typeof api.requests.updateRequest>[1]) =>
      api.requests.updateRequest(id, data),
    deleteRequest: (id: number) => api.requests.deleteRequest(id),

    // Notifications
    getNotifications: (userId?: number) => api.notifications.getNotifications(userId),
    getUnreadCount: (userId?: number) => api.notifications.getUnreadCount(userId),
    markNotificationAsRead: (id: number) => api.notifications.markAsRead(id),
    markAllNotificationsAsRead: (userId?: number) => api.notifications.markAllAsRead(userId),

    // Feedback
    getAllFeedback: (params?: Parameters<typeof api.feedback.getAllFeedback>[0]) =>
      api.feedback.getAllFeedback(params),
    submitFeedback: (articleId: number, data: Parameters<typeof api.feedback.submitFeedback>[1]) =>
      api.feedback.submitFeedback(articleId, data),
    resolveFeedback: (id: number, data: Parameters<typeof api.feedback.resolveFeedback>[1]) =>
      api.feedback.resolveFeedback(id, data),
    unresolveFeedback: (id: number) => api.feedback.unresolveFeedback(id),
    deleteFeedback: (id: number) => api.feedback.deleteFeedback(id),
    getArticleMetrics: (articleId: number) => api.feedback.getArticleMetrics(articleId),

    // Approvals
    getPendingApprovals: () => api.approvals.getPendingApprovals(),
    getAllApprovals: () => api.approvals.getAllApprovals(),
    submitForApproval: (articleId: number, comments?: string) =>
      api.approvals.submitForApproval(articleId, comments),
    approveArticle: (approvalId: number, comments?: string) =>
      api.approvals.approveArticle(approvalId, comments),
    rejectApproval: (approvalId: number, reason?: string) =>
      api.approvals.rejectApproval(approvalId, reason),

    // Attachments
    getArticleAttachments: (articleId: number, includeDeleted?: boolean) =>
      api.attachments.getArticleAttachments(articleId, includeDeleted),
    addAttachment: (data: Parameters<typeof api.attachments.addAttachment>[0]) =>
      api.attachments.addAttachment(data),
    deleteAttachment: (id: number) => api.attachments.deleteAttachment(id),

    // Templates
    getTemplates: () => api.templates.getTemplates(),
    getTemplateById: (id: number) => api.templates.getTemplateById(id),
    createTemplate: (data: Parameters<typeof api.templates.createTemplate>[0]) =>
      api.templates.createTemplate(data),
    updateTemplate: (id: number, data: Parameters<typeof api.templates.updateTemplate>[1]) =>
      api.templates.updateTemplate(id, data),
    deleteTemplate: (id: number) => api.templates.deleteTemplate(id),

    // Versions
    getArticleVersions: (articleId: number) => api.versions.getArticleVersions(articleId),
    getVersionById: (versionId: number) => api.versions.getVersionById(versionId),
    restoreVersion: (articleId: number, versionId: number) =>
      api.versions.restoreVersion(articleId, versionId),

    // Activity Log
    getActivityLogs: (params?: Parameters<typeof api.activity.getActivityLogs>[0]) =>
      api.activity.getActivityLogs(params),
    addActivityLog: (data: Parameters<typeof api.activity.addActivityLog>[0]) =>
      api.activity.addActivityLog(data),

    // Search / AI
    addSearchHistory: (query: string, resultCount: number) =>
      api.search.addSearchHistory(query, resultCount),
    getRecentSearches: (limit?: number) => api.search.getRecentSearches(limit),
    addChatMessage: (msg: Parameters<typeof api.search.addChatMessage>[0]) =>
      api.search.addChatMessage(msg),
    clearChatHistory: () => api.search.clearChatHistory(),
    getAIConfig: () => api.search.getAIConfig(),
    updateAIConfig: (updates: Parameters<typeof api.search.updateAIConfig>[0]) =>
      api.search.updateAIConfig(updates),

    // Advanced Search
    advancedSearch: (request: Parameters<typeof api.advancedSearch.advancedSearch>[0]) =>
      api.advancedSearch.advancedSearch(request),
    getSearchFacets: (searchQuery?: string) =>
      api.advancedSearch.getSearchFacets(searchQuery),
    saveSearch: (data: Parameters<typeof api.advancedSearch.saveSearch>[0]) =>
      api.advancedSearch.saveSearch(data),
    getSavedSearches: () => api.advancedSearch.getSavedSearches(),
    useSavedSearch: (id: number) => api.advancedSearch.useSavedSearch(id),
    deleteSavedSearch: (id: number) => api.advancedSearch.deleteSavedSearch(id),
    getSearchHistory: (limit?: number) => api.advancedSearch.getSearchHistory(limit),

    // Analytics
    trackArticleViewAnalytics: (articleId: number) =>
      api.analytics.trackArticleView(articleId),
    logSearchAnalytics: (query: string, type: string, count: number) =>
      api.analytics.logSearch(query, type, count),
    logActivityAnalytics: (type: string, entityType?: string, entityId?: number, details?: string) =>
      api.analytics.logActivity(type, entityType, entityId, details),
    getDashboardAnalytics: (startDate?: Date, endDate?: Date) =>
      api.analytics.getDashboardAnalytics(startDate, endDate),

    // Export / Import
    exportData: (request: Parameters<typeof api.exportImport.exportData>[0]) =>
      api.exportImport.exportData(request),
    createBackup: () => api.exportImport.createBackup(),
    importData: (request: Parameters<typeof api.exportImport.importData>[0]) =>
      api.exportImport.importData(request),
    restoreBackup: (data: string) => api.exportImport.restoreBackup(data),

    // Reset
    resetToDefaults: () => {
      appStore.resetToDefaults();
      return Promise.resolve({ success: true as const, data: undefined });
    },
  }), []);

  return {
    // Reactive state
    currentUser,
    articles,
    users,
    roles,
    teams,
    clients,
    tags,
    tagTypes,
    requests,
    notifications,
    feedback,
    approvals,
    attachments,
    templates,
    articleVersions,
    activityLogs,
    searchHistory,
    chatHistory,
    aiConfig,

    // Computed
    unreadNotificationCount,
    pendingApprovals,
    pendingRequestCount,
    publishedArticleCount,
    activeUserCount,

    // Sync reads
    reads,

    // Async writes
    actions,
  };
}