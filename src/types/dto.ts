/**
 * Consolidated DTO Type Definitions
 *
 * Extracted from /services/*.service.ts to decouple type definitions
 * from old service implementations. All lib/api/* modules and appStore
 * should import types from here instead of from service files.
 *
 * Organized by domain, matching the backend DTOs.
 */

// ─── Common / Shared ───────────────────────────────────────────

export interface PagedResultDto<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

// ─── Auth ───────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: number;
  teamId?: number;
  clientId?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roleId: number;
  roleName: string;
  teamId?: number;
  teamName?: string;
  clientId?: number;
  clientName?: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ─── Users ──────────────────────────────────────────────────────

export interface UserDto {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roleId: number;
  roleName: string;
  teamId?: number;
  teamName?: string;
  clientId?: number;
  clientName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  role?: string; // legacy compat
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: number;
  teamId?: number;
  clientId?: number;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  roleId?: number;
  teamId?: number;
  clientId?: number;
  isActive?: boolean;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  teamId?: number;
  clientId?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserQueryParams {
  roleId?: number;
  teamId?: number;
  clientId?: number;
  isActive?: boolean;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface RoleDto {
  roleId: number;
  roleName: string;
  description: string;
  isActive: boolean;
}

export interface TeamDto {
  teamId: number;
  teamName: string;
  description: string;
  isActive: boolean;
}

export interface ClientDto {
  clientId: number;
  clientName: string;
  description: string;
  isActive: boolean;
}

// ─── Articles ───────────────────────────────────────────────────

export interface ArticleDto {
  articleId: number;
  title: string;
  summary?: string;
  content?: string;
  createdBy: number;
  createdByName: string;
  createdByEmail?: string;
  updatedBy?: number;
  updatedByName?: string;
  approvedBy?: number;
  approvedByName?: string;
  statusId: number;
  statusName: string;
  isPublished: boolean;
  isInternal: boolean;
  clientId?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  approvedAt?: string;
  versionNumber: number;
  parentArticleId?: number;
  viewCount: number;
  tags: TagDto[];
  versions?: ArticleVersionListDto[];
}

export interface ArticleListDto {
  articleId: number;
  title: string;
  summary?: string;
  createdBy: number;
  createdByName: string;
  updatedBy?: number;
  updatedByName?: string;
  approvedBy?: number;
  approvedByName?: string;
  statusId: number;
  statusName: string;
  isPublished: boolean;
  isInternal: boolean;
  clientId?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  approvedAt?: string;
  versionNumber: number;
  parentArticleId?: number;
  viewCount: number;
  totalCount?: number;
  matchingTags?: number;
}

export interface ArticleStatusDto {
  statusId: number;
  statusName: string;
  description?: string;
  isActive: boolean;
}

export interface CreateArticleRequest {
  title: string;
  summary?: string;
  content?: string;
  statusId?: number;
  isInternal?: boolean;
  clientId?: number;
  tagIds?: number[];
}

export interface UpdateArticleRequest {
  title: string;
  summary?: string;
  content?: string;
  statusId?: number;
  isInternal?: boolean;
  clientId?: number;
  tagIds?: number[];
}

export interface GetArticlesParams {
  userId?: number;
  isInternal?: boolean;
  statusId?: number;
  isPublished?: boolean;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

// ─── Tags ───────────────────────────────────────────────────────

export interface TagTypeDto {
  tagTypeId: number;
  tagTypeName: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TagDto {
  tagId: number;
  tagTypeId: number;
  tagTypeName: string;
  tagName: string;
  tagValue: string;
  description?: string;
  colorCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagRequest {
  tagTypeId: number;
  tagName: string;
  tagValue: string;
  description?: string;
  colorCode?: string;
}

export interface UpdateTagRequest {
  tagName: string;
  tagValue: string;
  description?: string;
  colorCode?: string;
}

// ─── Article Requests ───────────────────────────────────────────

export interface ArticleRequestDto {
  requestId: number;
  title: string;
  description?: string;
  requestedByUserId: number;
  requestedByName: string;
  requestedByEmail: string;
  assignedToUserId?: number;
  assignedToName?: string;
  statusId: number;
  statusName: string;
  priority: number;
  articleId?: number;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreateRequestDto {
  title: string;
  description?: string;
  priority?: number;
}

export interface UpdateRequestDto {
  title?: string;
  description?: string;
  statusId?: number;
  priority?: number;
  assignedToUserId?: number;
  rejectionReason?: string;
  articleId?: number;
}

export interface RequestQueryParams {
  statusId?: number;
  requestedByUserId?: number;
  assignedToUserId?: number;
  priority?: number;
  pageNumber?: number;
  pageSize?: number;
}

// ─── Notifications ──────────────────────────────────────────────

export interface NotificationDto {
  notificationId: number;
  userId: number;
  title: string;
  message: string;
  notificationType: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationQueryParams {
  isRead?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

// ─── Feedback ───────────────────────────────────────────────────

export interface FeedbackDto {
  feedbackId: number;
  articleId: number;
  articleTitle?: string;
  userId: number;
  userName: string;
  rating: number;
  isHelpful?: boolean;
  feedbackText?: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
  isResolved: boolean;
  resolvedBy?: number;
  resolvedByName?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface SubmitFeedbackDto {
  rating: number;
  isHelpful?: boolean;
  feedbackText?: string;
  category?: string;
}

export interface UpdateFeedbackDto {
  rating?: number;
  isHelpful?: boolean;
  feedbackText?: string;
  category?: string;
}

export interface ResolveFeedbackDto {
  resolutionNotes?: string;
}

export interface FeedbackQueryParams {
  articleId?: number;
  userId?: number;
  rating?: number;
  category?: string;
  isResolved?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface ArticleMetricsDto {
  articleId: number;
  totalFeedback: number;
  averageRating: number;
  helpfulCount: number;
  notHelpfulCount: number;
  categoryBreakdown: { [key: string]: number };
}

// ─── Approvals ──────────────────────────────────────────────────

export interface ApprovalDto {
  approvalId: number;
  articleId: number;
  articleTitle: string;
  articleVersionId: number;
  submittedByUserId: number;
  submittedByName: string;
  approvalLevel: number;
  status: string;
  submittedAt: string;
}

export interface SubmitApprovalDto {
  articleId: number;
  articleVersionId: number;
  approvalLevel?: number;
}

export interface ReviewApprovalDto {
  comments?: string;
}

export interface ApprovalQueryParams {
  statusId?: number;
  assignedToUserId?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface ApprovalStatsDto {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  avgApprovalTime: number;
}

// ─── Attachments ────────────────────────────────────────────────

export interface AttachmentDto {
  attachmentId: number;
  articleId: number;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  fileExtension: string;
  uploadedBy: number;
  uploadedByName?: string;
  uploadedAt: string;
  description?: string;
  isImage: boolean;
  thumbnailPath?: string;
  downloadCount: number;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: number;
  deletedByName?: string;
}

export interface UpdateAttachment {
  description?: string;
}

export interface AttachmentStats {
  totalAttachments: number;
  totalStorageBytes: number;
  totalDownloads: number;
  totalImages: number;
  totalDocuments: number;
}

// ─── Templates ──────────────────────────────────────────────────

export interface TemplateFieldDto {
  fieldId: number;
  templateId: number;
  fieldName: string;
  fieldType: string;
  fieldLabel: string;
  placeholder?: string;
  defaultValue?: string;
  isRequired: boolean;
  displayOrder: number;
  validationRules?: string;
  dropdownOptions?: string;
}

export interface CreateTemplateFieldDto {
  fieldName: string;
  fieldType: string;
  fieldLabel: string;
  placeholder?: string;
  defaultValue?: string;
  isRequired: boolean;
  displayOrder: number;
  validationRules?: string;
  dropdownOptions?: string;
}

export interface ArticleTemplateDto {
  templateId: number;
  templateName: string;
  description?: string;
  category?: string;
  titleTemplate?: string;
  contentTemplate: string;
  summaryTemplate?: string;
  isInternal: boolean;
  isActive: boolean;
  usageCount: number;
  createdBy: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  fields: TemplateFieldDto[];
  tags: TagDto[];
}

export interface CreateArticleTemplateDto {
  templateName: string;
  description?: string;
  category?: string;
  titleTemplate?: string;
  contentTemplate: string;
  summaryTemplate?: string;
  isInternal: boolean;
  fields: CreateTemplateFieldDto[];
  tagIds: number[];
}

// ─── Article Versions ───────────────────────────────────────────

export interface ArticleVersionListDto {
  versionId: number;
  articleId: number;
  versionNumber: number;
  title: string;
  summary?: string;
  isInternal: boolean;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  changeDescription?: string;
  tagIds?: string;
}

export interface ArticleVersionDto {
  versionId: number;
  articleId: number;
  versionNumber: number;
  title: string;
  content: string;
  summary?: string;
  isInternal: boolean;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  changeDescription?: string;
  tags?: any[];
}

export interface VersionDiffDto {
  field: string;
  oldValue?: string;
  newValue?: string;
  diffType: string;
}

export interface VersionComparisonDto {
  oldVersion: ArticleVersionDto;
  newVersion: ArticleVersionDto;
  differences: VersionDiffDto[];
}

// ─── Activity Logs ──────────────────────────────────────────────

export interface ActivityLog {
  activityId: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
  entityType: string;
  entityId: number;
  action: string;
  description?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface CreateActivityLog {
  userId?: number;
  entityType: string;
  entityId: number;
  action: string;
  description?: string;
  oldValue?: string;
  newValue?: string;
}

export interface AuditTrail {
  auditId: number;
  userId?: number;
  userName?: string;
  tableName: string;
  recordId: number;
  operation: string;
  columnName?: string;
  oldValue?: string;
  newValue?: string;
  changedAt: string;
}

export interface ActivityStats {
  totalActivities: number;
  uniqueUsers: number;
  entityTypes: number;
  actionTypes: number;
}

export interface EntityTypeStats {
  entityType: string;
  activityCount: number;
  uniqueUsers: number;
}

export interface ActionStats {
  action: string;
  activityCount: number;
  uniqueUsers: number;
}

// ─── Advanced Search ────────────────────────────────────────────

export interface AdvancedSearchRequest {
  searchQuery?: string;
  statusIds?: number[];
  tagIds?: number[];
  authorId?: number;
  isInternal?: boolean;
  isExternal?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  updatedAfter?: Date;
  updatedBefore?: Date;
  publishedAfter?: Date;
  publishedBefore?: Date;
  minRating?: number;
  minViewCount?: number;
  hasFeedback?: boolean;
  versionNumber?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface SearchResultArticle {
  articleId: number;
  title: string;
  summary?: string;
  statusId: number;
  statusName: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  isInternal: boolean;
  versionNumber: number;
  viewCount?: number;
  averageRating?: number;
  totalFeedback?: number;
  relevanceScore?: number;
}

export interface AdvancedSearchResult {
  articles: SearchResultArticle[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface FacetItem {
  id?: number;
  name: string;
  count: number;
  colorCode?: string;
}

export interface SearchFacets {
  statuses: FacetItem[];
  tags: FacetItem[];
  authors: FacetItem[];
  visibility: FacetItem[];
  dateRanges: FacetItem[];
}

export interface SavedSearch {
  savedSearchId: number;
  userId: number;
  searchName: string;
  searchQuery?: string;
  filterCriteria: string; // JSON
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  useCount: number;
  createdByName?: string;
}

export interface CreateSavedSearch {
  searchName: string;
  searchQuery?: string;
  filterCriteria: AdvancedSearchRequest;
  isPublic: boolean;
}

export interface SearchHistoryDto {
  historyId: number;
  userId: number;
  searchQuery: string;
  filterCriteria?: string; // JSON
  resultsCount: number;
  searchedAt: string;
}

// ─── Analytics ──────────────────────────────────────────────────

export interface DashboardAnalyticsDto {
  overallStats: OverallStatsDto;
  viewTrend: ViewTrendDto[];
  searchTrend: SearchTrendDto[];
  topViewedArticles: TopArticleDto[];
  topSearchQueries: TopSearchQueryDto[];
  userActivitySummary: ActivitySummaryDto[];
  feedbackSummary: FeedbackSummaryDto[];
}

export interface OverallStatsDto {
  totalPublishedArticles: number;
  totalActiveUsers: number;
  totalViewsInPeriod: number;
  totalSearchesInPeriod: number;
  totalFeedbackInPeriod: number;
  pendingRequests: number;
  pendingApprovals: number;
}

export interface ViewTrendDto {
  viewDate: string;
  viewCount: number;
  uniqueUsers: number;
}

export interface SearchTrendDto {
  searchDate: string;
  searchCount: number;
  searchType: string;
  avgResultsCount: number;
}

export interface TopArticleDto {
  articleId: number;
  title: string;
  summary?: string;
  averageRating?: number;
  totalFeedback: number;
  helpfulCount?: number;
  notHelpfulCount?: number;
  totalViews?: number;
  viewCount?: number;
  uniqueViewers?: number;
}

export interface TopSearchQueryDto {
  searchQuery: string;
  searchCount: number;
  avgResultsCount: number;
  searchType: string;
}

export interface ActivitySummaryDto {
  activityType: string;
  activityCount: number;
  uniqueUsers: number;
}

export interface FeedbackSummaryDto {
  avgRating?: number;
  totalFeedback: number;
  helpfulCount: number;
  notHelpfulCount: number;
  category?: string;
  resolvedCount: number;
}

export interface ArticleAnalyticsDto {
  articleInfo: ArticleBasicInfoDto;
  viewStats: ViewStatsDto;
  viewTrend: ViewTrendDto[];
  feedbackStats: FeedbackStatsDto;
  searchQueries: SearchQueryLeadDto[];
  versionStats: VersionStatsDto;
}

export interface ArticleBasicInfoDto {
  articleId: number;
  title: string;
  summary?: string;
  createdAt: string;
  publishedAt?: string;
  authorName: string;
}

export interface ViewStatsDto {
  totalViews: number;
  uniqueViewers: number;
  firstViewed?: string;
  lastViewed?: string;
}

export interface FeedbackStatsDto {
  avgRating?: number;
  totalFeedback: number;
  helpfulCount: number;
  notHelpfulCount: number;
}

export interface SearchQueryLeadDto {
  searchQuery: string;
  searchCount: number;
  clickPosition?: number;
}

export interface VersionStatsDto {
  totalVersions: number;
}

export interface UserAnalyticsDto {
  userInfo: UserBasicInfoDto;
  activityStats: UserActivityStatsDto;
  activityBreakdown: ActivityBreakdownDto[];
  contentStats: UserContentStatsDto;
}

export interface UserBasicInfoDto {
  userId: number;
  email: string;
  userName: string;
  roleName: string;
  joinedAt: string;
}

export interface UserActivityStatsDto {
  totalActivities: number;
  firstActivity?: string;
  lastActivity?: string;
}

export interface ActivityBreakdownDto {
  activityType: string;
  activityCount: number;
}

export interface UserContentStatsDto {
  articlesCreated: number;
  articlesViewed: number;
  totalSearches: number;
  avgResultsCount?: number;
  feedbackProvided: number;
  avgRatingGiven?: number;
  requestsMade: number;
}

export interface SearchAnalyticsDto {
  overallStats: SearchOverallStatsDto;
  searchByType: SearchTypeStatsDto[];
  topSearchQueries: TopSearchQueryDto[];
  noResultQueries: NoResultQueryDto[];
  mostClickedArticles: ClickedArticleDto[];
  searchTrend: SearchTrendPointDto[];
}

export interface SearchOverallStatsDto {
  totalSearches: number;
  uniqueSearchers: number;
  avgResultsCount: number;
  avgResponseTimeMs?: number;
  searchesWithClicks: number;
  clickThroughRate: number;
}

export interface SearchTypeStatsDto {
  searchType: string;
  searchCount: number;
  avgResultsCount: number;
  avgResponseTimeMs?: number;
  clickCount: number;
}

export interface NoResultQueryDto {
  searchQuery: string;
  searchCount: number;
  searchType: string;
}

export interface ClickedArticleDto {
  articleId: number;
  title: string;
  clickCount: number;
  avgClickPosition: number;
}

export interface SearchTrendPointDto {
  searchDate: string;
  searchCount: number;
  uniqueSearchers: number;
}

// ─── Export / Import ────────────────────────────────────────────

export interface ExportFilterDto {
  startDate?: string;
  endDate?: string;
  entityIds?: number[];
  isActive?: boolean;
}

export interface ExportRequestDto {
  format: 'JSON' | 'CSV';
  entityType: 'Articles' | 'Users' | 'Tags' | 'All';
  includeRelated: boolean;
  filters?: ExportFilterDto;
}

export interface ImportRequestDto {
  format: 'JSON' | 'CSV';
  entityType: 'Articles' | 'Users' | 'Tags';
  data: string;
  overwriteExisting: boolean;
  validateOnly?: boolean;
}

export interface ImportResultDto {
  totalRecords: number;
  successfulImports: number;
  failedImports: number;
  errors: string[];
  warnings: string[];
  importedAt?: string;
  importedBy?: string;
}

export interface ValidationResultDto {
  isValid: boolean;
  errors: { lineNumber: number; field: string; message: string; value: string }[];
  warnings: { lineNumber: number; field: string; message: string }[];
}

export interface BackupMetadataDto {
  version: string;
  createdAt: string;
  createdBy: string;
  applicationVersion: string;
  totalArticles: number;
  totalUsers: number;
  totalTags: number;
  recordCounts: Record<string, number>;
}

export interface FullBackupDto {
  metadata: BackupMetadataDto;
  articles: any[];
  users: any[];
  tags: any[];
  articleTags: any[];
  articleVersions: any[];
  feedback: any[];
  comments: any[];
  articleRequests: any[];
  attachments: any[];
  emailTemplates: any[];
  articleTemplates: any[];
  teams: any[];
  customRoles: any[];
}

// ─── Permissions ────────────────────────────────────────────────

export interface PermissionTeam {
  teamId: number;
  teamName: string;
  description?: string;
  isActive: boolean;
  createdBy: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
}

export interface CreateTeamRequest {
  teamName: string;
  description?: string;
}

export interface AddTeamMemberRequest {
  userId: number;
  teamRole: string;
}

export interface CustomRoleDto {
  roleId: number;
  roleName: string;
  description?: string;
  isActive: boolean;
  createdBy: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  permissions: RolePermissionDto[];
}

export interface CreateCustomRoleRequest {
  roleName: string;
  description?: string;
  permissions: CreateRolePermissionRequest[];
}

export interface RolePermissionDto {
  permissionId: number;
  roleId: number;
  resource: string;
  action: string;
  scope: string;
  conditions?: string;
}

export interface CreateRolePermissionRequest {
  resource: string;
  action: string;
  scope: string;
  conditions?: string;
}

export interface AssignRoleRequest {
  userId: number;
  roleId: number;
  expiresAt?: Date;
}

export interface PermissionCheckResult {
  hasPermission: boolean;
  scope?: string;
  reason?: string;
}

// ─── Email ──────────────────────────────────────────────────────

export interface EmailQueueDto {
  emailId: number;
  toEmail: string;
  toName?: string;
  fromEmail: string;
  fromName?: string;
  subject: string;
  body: string;
  isHtml: boolean;
  priority: number;
  status: string;
  attempts: number;
  maxAttempts: number;
  errorMessage?: string;
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
  userId?: number;
  entityType?: string;
  entityId?: number;
}

export interface CreateEmailDto {
  toEmail: string;
  toName?: string;
  subject: string;
  body: string;
  isHtml?: boolean;
  priority?: number;
  scheduledFor?: string;
  userId?: number;
  entityType?: string;
  entityId?: number;
}
