/**
 * Centralized Data Store
 * 
 * Single source of truth for all application state.
 * - Module-scoped mutable state (not React state)
 * - Pub/sub notifications for reactive UI updates
 * - CRUD methods for every entity
 * - Computed getters for derived state
 * - Cross-domain side effects
 * - localStorage persistence with Date rehydration
 * 
 * WHO CAN IMPORT THIS: Only /lib/api/*.ts and /hooks/useAppStore.ts
 * COMPONENTS NEVER IMPORT THIS (type imports are OK)
 */

// ─── Re-export DTO types from consolidated types file ──
import type {
  ArticleDto, ArticleListDto, CreateArticleRequest, UpdateArticleRequest,
  TagDto,
  UserDto, CreateUserRequest, UpdateUserRequest,
  ArticleRequestDto, CreateRequestDto, UpdateRequestDto,
  NotificationDto,
  FeedbackDto, SubmitFeedbackDto, ResolveFeedbackDto,
  ApprovalDto,
  AttachmentDto,
  ArticleTemplateDto as TemplateDto,
  ArticleVersionDto, ArticleVersionListDto,
  ActivityLog, CreateActivityLog,
  AuthResponse,
  RoleDto, TeamDto, ClientDto,
} from '../types/dto';

// Import seed data from existing mock data
import {
  MOCK_USERS,
  MOCK_ROLES,
  MOCK_TEAMS,
  MOCK_CLIENTS,
  MOCK_TAGS,
  MOCK_TAG_TYPES,
  MOCK_ARTICLES,
  MOCK_ARTICLE_REQUESTS,
  MOCK_NOTIFICATIONS,
  MOCK_FEEDBACK,
  MOCK_APPROVALS,
  MOCK_ATTACHMENTS,
  MOCK_TEMPLATES,
} from '../services/mock/mockData.service';

// ─── Slice Definitions ─────────────────────────────────
export type Slice =
  | 'auth'
  | 'articles'
  | 'users'
  | 'tags'
  | 'requests'
  | 'notifications'
  | 'feedback'
  | 'approvals'
  | 'attachments'
  | 'templates'
  | 'versions'
  | 'activity'
  | 'search'
  | 'aiConfig';

// ─── AI Config Type ────────────────────────────────────
export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  model: string;
  enabled: boolean;
}

// ─── Chat / Search Types ───────────────────────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  articleIds?: number[];
  timestamp: string;
}

export interface SearchHistoryEntry {
  id: string;
  userId: number;
  query: string;
  resultCount: number;
  timestamp: string;
}

// ─── Article Version for store ─────────────────────────
export interface StoredArticleVersion {
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
  tags?: TagDto[];
}

// ─── Subscriber System ─────────────────────────────────
type Listener = () => void;

const subscribers: Record<Slice, Set<Listener>> = {
  auth: new Set(),
  articles: new Set(),
  users: new Set(),
  tags: new Set(),
  requests: new Set(),
  notifications: new Set(),
  feedback: new Set(),
  approvals: new Set(),
  attachments: new Set(),
  templates: new Set(),
  versions: new Set(),
  activity: new Set(),
  search: new Set(),
  aiConfig: new Set(),
};

function notify(slice: Slice) {
  subscribers[slice].forEach(fn => fn());
  // Auto-persist to localStorage
  persistSlice(slice);
}

// ─── localStorage Persistence ──────────────────────────
const STORAGE_PREFIX = 'kb_store_';

function persistSlice(slice: Slice) {
  try {
    let data: any;
    switch (slice) {
      case 'auth': data = currentUser; break;
      case 'articles': data = articles; break;
      case 'users': data = users; break;
      case 'tags': data = tags; break;
      case 'requests': data = requests; break;
      case 'notifications': data = notifications; break;
      case 'feedback': data = feedback; break;
      case 'approvals': data = approvals; break;
      case 'attachments': data = attachments; break;
      case 'templates': data = templates; break;
      case 'versions': data = articleVersions; break;
      case 'activity': data = activityLogs; break;
      case 'search': data = { searchHistory, chatHistory }; break;
      case 'aiConfig': data = aiConfig; break;
    }
    localStorage.setItem(STORAGE_PREFIX + slice, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to persist slice "${slice}":`, e);
  }
}

function loadSlice<T>(slice: Slice, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + slice);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function clearAllPersistedData() {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}

// ─── ID Generation ─────────────────────────────────────
let idCounter = Date.now();
function nextId(): number {
  return ++idCounter;
}

// ─── Default Seed Data ─────────────────────────────────
const DEFAULT_USERS = [...MOCK_USERS];
const DEFAULT_ROLES = [...MOCK_ROLES];
const DEFAULT_TEAMS = [...MOCK_TEAMS];
const DEFAULT_CLIENTS = [...MOCK_CLIENTS];
const DEFAULT_TAGS = [...MOCK_TAGS];
const DEFAULT_TAG_TYPES = [...MOCK_TAG_TYPES];
const DEFAULT_ARTICLES = [...MOCK_ARTICLES];
const DEFAULT_REQUESTS = [...MOCK_ARTICLE_REQUESTS];
const DEFAULT_NOTIFICATIONS = [...MOCK_NOTIFICATIONS];
const DEFAULT_FEEDBACK = [...MOCK_FEEDBACK];
const DEFAULT_APPROVALS = [...MOCK_APPROVALS];
const DEFAULT_ATTACHMENTS = [...MOCK_ATTACHMENTS];
const DEFAULT_TEMPLATES = [...MOCK_TEMPLATES];

// Default article versions (one per article based on current version)
function buildDefaultVersions(): StoredArticleVersion[] {
  const versions: StoredArticleVersion[] = [];
  DEFAULT_ARTICLES.forEach(article => {
    for (let v = 1; v <= article.versionNumber; v++) {
      versions.push({
        versionId: nextId(),
        articleId: article.articleId,
        versionNumber: v,
        title: article.title,
        content: v === article.versionNumber ? (article.content || '') : `Previous version ${v} content for "${article.title}"`,
        summary: article.summary,
        isInternal: article.isInternal,
        createdBy: article.createdBy,
        createdByName: article.createdByName,
        createdAt: article.createdAt,
        changeDescription: v === 1 ? 'Initial version' : `Updated content - version ${v}`,
        tags: article.tags,
      });
    }
  });
  return versions;
}

const DEFAULT_ACTIVITY_LOGS: ActivityLog[] = [
  {
    activityId: 1,
    userId: 1,
    userName: 'Admin User',
    userEmail: 'admin@company.com',
    entityType: 'Article',
    entityId: 1,
    action: 'Published',
    description: 'Published article "Getting Started with Authentication"',
    createdAt: '2024-01-16T00:00:00Z',
  },
  {
    activityId: 2,
    userId: 1,
    userName: 'Admin User',
    userEmail: 'admin@company.com',
    entityType: 'Article',
    entityId: 2,
    action: 'Published',
    description: 'Published article "API Rate Limiting Guide"',
    createdAt: '2024-02-11T00:00:00Z',
  },
  {
    activityId: 3,
    userId: 2,
    userName: 'Support User',
    userEmail: 'support@company.com',
    entityType: 'Article',
    entityId: 4,
    action: 'SubmittedForApproval',
    description: 'Submitted "Advanced Security Features" for admin approval',
    createdAt: '2024-11-20T14:20:00Z',
  },
  {
    activityId: 4,
    userId: 3,
    userName: 'John Doe',
    userEmail: 'user@client1.com',
    entityType: 'Request',
    entityId: 1,
    action: 'Created',
    description: 'Created article request "How to integrate webhooks?"',
    createdAt: '2024-11-24T10:30:00Z',
  },
  {
    activityId: 5,
    userId: 1,
    userName: 'Admin User',
    userEmail: 'admin@company.com',
    entityType: 'Article',
    entityId: 1,
    action: 'Updated',
    description: 'Updated article "Getting Started with Authentication" to version 3',
    createdAt: '2024-11-20T00:00:00Z',
  },
  {
    activityId: 6,
    userId: 1,
    userName: 'Admin User',
    userEmail: 'admin@company.com',
    entityType: 'User',
    entityId: 3,
    action: 'Created',
    description: 'Created user account for John Doe (user@client1.com)',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    activityId: 7,
    userId: 3,
    userName: 'John Doe',
    userEmail: 'user@client1.com',
    entityType: 'Feedback',
    entityId: 1,
    action: 'Submitted',
    description: 'Submitted feedback (5/5) on "Getting Started with Authentication"',
    createdAt: '2024-11-20T15:30:00Z',
  },
  {
    activityId: 8,
    userId: 4,
    userName: 'Jane Smith',
    userEmail: 'user@client2.com',
    entityType: 'Request',
    entityId: 3,
    action: 'Created',
    description: 'Created article request "Mobile SDK Documentation"',
    createdAt: '2024-11-21T16:45:00Z',
  },
];

const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'openai',
  apiKey: '',
  model: 'gpt-4',
  enabled: false,
};

// ─── Mutable State ─────────────────────────────────────
let currentUser: AuthResponse | null = loadSlice<AuthResponse | null>('auth', null);
let articles: ArticleDto[] = loadSlice('articles', DEFAULT_ARTICLES);
let users: UserDto[] = loadSlice('users', DEFAULT_USERS);
let roles: RoleDto[] = DEFAULT_ROLES;
let teams: TeamDto[] = DEFAULT_TEAMS;
let clients: ClientDto[] = DEFAULT_CLIENTS;
let tags: TagDto[] = loadSlice('tags', DEFAULT_TAGS);
let tagTypes = DEFAULT_TAG_TYPES;
let requests: ArticleRequestDto[] = loadSlice('requests', DEFAULT_REQUESTS);
let notifications: NotificationDto[] = loadSlice('notifications', DEFAULT_NOTIFICATIONS);
let feedback: FeedbackDto[] = loadSlice('feedback', DEFAULT_FEEDBACK);
let approvals: ApprovalDto[] = loadSlice('approvals', DEFAULT_APPROVALS);
let attachments: AttachmentDto[] = loadSlice('attachments', DEFAULT_ATTACHMENTS);
let templates: TemplateDto[] = loadSlice('templates', DEFAULT_TEMPLATES);
let articleVersions: StoredArticleVersion[] = loadSlice('versions', buildDefaultVersions());
let activityLogs: ActivityLog[] = loadSlice('activity', DEFAULT_ACTIVITY_LOGS);
let searchHistory: SearchHistoryEntry[] = loadSlice<{ searchHistory: SearchHistoryEntry[]; chatHistory: ChatMessage[] }>('search', { searchHistory: [], chatHistory: [] }).searchHistory || [];
let chatHistory: ChatMessage[] = loadSlice<{ searchHistory: SearchHistoryEntry[]; chatHistory: ChatMessage[] }>('search', { searchHistory: [], chatHistory: [] }).chatHistory || [];
let aiConfig: AIConfig = loadSlice('aiConfig', DEFAULT_AI_CONFIG);

// ─── Auth Methods ──────────────────────────────────────

function loginUser(email: string): AuthResponse | null {
  const user = users.find(u => u.email === email && u.isActive);
  if (!user) return null;

  const auth: AuthResponse = {
    userId: user.userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    roleId: user.roleId,
    roleName: user.roleName,
    teamId: user.teamId,
    teamName: user.teamName,
    clientId: user.clientId,
    clientName: user.clientName,
    accessToken: 'mock-access-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  };

  currentUser = auth;
  notify('auth');
  return auth;
}

function logoutUser() {
  currentUser = null;
  notify('auth');
}

function setCurrentUser(auth: AuthResponse) {
  currentUser = auth;
  notify('auth');
}

// ─── Article Methods ───────────────────────────────────

function getArticlesFiltered(params?: {
  searchTerm?: string;
  statusId?: number;
  isPublished?: boolean;
  isInternal?: boolean;
  tagIds?: number[];
  clientId?: number;
  createdBy?: number;
  page?: number;
  pageSize?: number;
}): { data: ArticleDto[]; total: number } {
  let filtered = [...articles];

  if (params?.searchTerm) {
    const term = params.searchTerm.toLowerCase();
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(term) ||
      a.summary?.toLowerCase().includes(term) ||
      a.content?.toLowerCase().includes(term)
    );
  }
  if (params?.statusId !== undefined) {
    filtered = filtered.filter(a => a.statusId === params.statusId);
  }
  if (params?.isPublished !== undefined) {
    filtered = filtered.filter(a => a.isPublished === params.isPublished);
  }
  if (params?.isInternal !== undefined) {
    filtered = filtered.filter(a => a.isInternal === params.isInternal);
  }
  if (params?.clientId !== undefined) {
    filtered = filtered.filter(a => a.clientId === params.clientId);
  }
  if (params?.createdBy !== undefined) {
    filtered = filtered.filter(a => a.createdBy === params.createdBy);
  }
  if (params?.tagIds && params.tagIds.length > 0) {
    filtered = filtered.filter(a =>
      params.tagIds!.some(tid => a.tags?.some(t => t.tagId === tid))
    );
  }

  const total = filtered.length;
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 100;
  const start = (page - 1) * pageSize;
  filtered = filtered.slice(start, start + pageSize);

  return { data: filtered, total };
}

function getArticleById(articleId: number): ArticleDto | undefined {
  return articles.find(a => a.articleId === articleId);
}

function createArticle(data: CreateArticleRequest): ArticleDto {
  const user = currentUser;
  const newArticle: ArticleDto = {
    articleId: nextId(),
    title: data.title,
    summary: data.summary,
    content: data.content,
    createdBy: user?.userId || 1,
    createdByName: user?.fullName || 'Unknown',
    createdByEmail: user?.email,
    statusId: data.statusId || 1,
    statusName: data.statusId === 4 ? 'Published' : data.statusId === 2 ? 'Pending Support Review' : data.statusId === 3 ? 'Pending Admin Approval' : 'Draft',
    isPublished: data.statusId === 4,
    isInternal: data.isInternal ?? true,
    clientId: data.clientId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: data.statusId === 4 ? new Date().toISOString() : undefined,
    versionNumber: 1,
    viewCount: 0,
    tags: data.tagIds ? tags.filter(t => data.tagIds!.includes(t.tagId)) : [],
  };
  articles = [...articles, newArticle];

  // Create initial version
  const version: StoredArticleVersion = {
    versionId: nextId(),
    articleId: newArticle.articleId,
    versionNumber: 1,
    title: newArticle.title,
    content: newArticle.content || '',
    summary: newArticle.summary,
    isInternal: newArticle.isInternal,
    createdBy: newArticle.createdBy,
    createdByName: newArticle.createdByName,
    createdAt: newArticle.createdAt,
    changeDescription: 'Initial version',
    tags: newArticle.tags,
  };
  articleVersions = [...articleVersions, version];

  notify('articles');
  notify('versions');
  return newArticle;
}

function updateArticle(articleId: number, updates: Partial<ArticleDto> & { tagIds?: number[]; changeDescription?: string }): ArticleDto | null {
  const index = articles.findIndex(a => a.articleId === articleId);
  if (index === -1) return null;

  const old = articles[index];

  // Handle tagIds -> tags conversion
  const { tagIds, changeDescription, ...restUpdates } = updates as any;
  const resolvedTags = tagIds ? tags.filter(t => tagIds.includes(t.tagId)) : undefined;

  const updated = {
    ...old,
    ...restUpdates,
    ...(resolvedTags !== undefined ? { tags: resolvedTags } : {}),
    updatedAt: new Date().toISOString(),
    updatedBy: currentUser?.userId,
    updatedByName: currentUser?.fullName,
  };

  // If content changed, create a new version
  if (updates.content && updates.content !== old.content) {
    const newVersionNum = old.versionNumber + 1;
    updated.versionNumber = newVersionNum;
    const version: StoredArticleVersion = {
      versionId: nextId(),
      articleId,
      versionNumber: newVersionNum,
      title: updated.title,
      content: updates.content,
      summary: updated.summary,
      isInternal: updated.isInternal,
      createdBy: currentUser?.userId || 1,
      createdByName: currentUser?.fullName || 'Unknown',
      createdAt: new Date().toISOString(),
      changeDescription: changeDescription || `Updated to version ${newVersionNum}`,
      tags: updated.tags,
    };
    articleVersions = [...articleVersions, version];
    notify('versions');
  }

  articles = articles.map((a, i) => i === index ? updated : a);
  notify('articles');
  return updated;
}

function deleteArticle(articleId: number): boolean {
  const before = articles.length;
  articles = articles.filter(a => a.articleId !== articleId);
  if (articles.length < before) {
    // Cross-domain: clean up related data
    attachments = attachments.filter(a => a.articleId !== articleId);
    articleVersions = articleVersions.filter(v => v.articleId !== articleId);
    feedback = feedback.filter(f => f.articleId !== articleId);
    approvals = approvals.filter(a => a.articleId !== articleId);

    notify('articles');
    notify('attachments');
    notify('versions');
    notify('feedback');
    notify('approvals');
    return true;
  }
  return false;
}

function publishArticle(articleId: number): ArticleDto | null {
  return updateArticle(articleId, {
    statusId: 4,
    statusName: 'Published',
    isPublished: true,
    publishedAt: new Date().toISOString(),
    approvedBy: currentUser?.userId,
    approvedByName: currentUser?.fullName,
    approvedAt: new Date().toISOString(),
  });
}

function incrementArticleViews(articleId: number) {
  const article = articles.find(a => a.articleId === articleId);
  if (article) {
    article.viewCount = (article.viewCount || 0) + 1;
    articles = [...articles];
    notify('articles');
  }
}

// ─── User Methods ──────────────────────────────────────

function createUser(data: CreateUserRequest): UserDto {
  const role = roles.find(r => r.roleId === data.roleId);
  const team = data.teamId ? teams.find(t => t.teamId === data.teamId) : undefined;
  const client = data.clientId ? clients.find(c => c.clientId === data.clientId) : undefined;

  const newUser: UserDto = {
    userId: nextId(),
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    fullName: `${data.firstName} ${data.lastName}`,
    roleId: data.roleId,
    roleName: role?.roleName || 'User',
    teamId: data.teamId,
    teamName: team?.teamName,
    clientId: data.clientId,
    clientName: client?.clientName,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users = [...users, newUser];
  notify('users');
  return newUser;
}

function updateUser(userId: number, updates: UpdateUserRequest): UserDto | null {
  const index = users.findIndex(u => u.userId === userId);
  if (index === -1) return null;

  const role = updates.roleId ? roles.find(r => r.roleId === updates.roleId) : undefined;
  const team = updates.teamId ? teams.find(t => t.teamId === updates.teamId) : undefined;
  const client = updates.clientId ? clients.find(c => c.clientId === updates.clientId) : undefined;

  const updated: UserDto = {
    ...users[index],
    ...updates,
    fullName: updates.firstName || updates.lastName
      ? `${updates.firstName || users[index].firstName} ${updates.lastName || users[index].lastName}`
      : users[index].fullName,
    roleName: role?.roleName || users[index].roleName,
    teamName: team?.teamName ?? users[index].teamName,
    clientName: client?.clientName ?? users[index].clientName,
    updatedAt: new Date().toISOString(),
  };

  users = users.map((u, i) => i === index ? updated : u);
  notify('users');
  return updated;
}

function deleteUser(userId: number): boolean {
  const before = users.length;
  users = users.filter(u => u.userId !== userId);
  if (users.length < before) {
    notify('users');
    return true;
  }
  return false;
}

// ─── Tag Methods ───────────────────────────────────────

function createTag(data: { tagTypeId: number; tagName: string; tagValue?: string; description?: string; colorCode?: string }): TagDto {
  const tagType = tagTypes.find(tt => tt.tagTypeId === data.tagTypeId);
  const newTag: TagDto = {
    tagId: nextId(),
    tagTypeId: data.tagTypeId,
    tagTypeName: tagType?.tagTypeName || 'Unknown',
    tagName: data.tagName,
    tagValue: data.tagValue || data.tagName.toLowerCase().replace(/\s+/g, '-'),
    description: data.description,
    colorCode: data.colorCode,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tags = [...tags, newTag];
  notify('tags');
  return newTag;
}

function updateTag(tagId: number, updates: Partial<TagDto>): TagDto | null {
  const index = tags.findIndex(t => t.tagId === tagId);
  if (index === -1) return null;
  tags = tags.map((t, i) => i === index ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t);
  notify('tags');
  return tags[index];
}

function deleteTag(tagId: number): boolean {
  const before = tags.length;
  tags = tags.filter(t => t.tagId !== tagId);
  if (tags.length < before) {
    notify('tags');
    return true;
  }
  return false;
}

// ─── Request Methods ───────────────────────────────────

function createRequest(data: CreateRequestDto): ArticleRequestDto {
  const newRequest: ArticleRequestDto = {
    requestId: nextId(),
    title: data.title,
    description: data.description,
    requestedByUserId: currentUser?.userId || 0,
    requestedByName: currentUser?.fullName || 'Unknown',
    requestedByEmail: currentUser?.email || '',
    assignedToUserId: undefined,
    assignedToName: undefined,
    statusId: 1,
    statusName: 'Pending',
    priority: data.priority || 2,
    articleId: undefined,
    rejectionReason: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: undefined,
  };
  requests = [...requests, newRequest];

  // Cross-domain: notify admins
  const adminNotification: NotificationDto = {
    notificationId: nextId(),
    userId: 1, // admin
    title: 'New Article Request',
    message: `${currentUser?.fullName || 'Someone'} requested: "${data.title}"`,
    notificationType: 'ArticleRequest',
    relatedEntityType: 'Request',
    relatedEntityId: newRequest.requestId,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  notifications = [...notifications, adminNotification];

  notify('requests');
  notify('notifications');
  return newRequest;
}

function updateRequest(requestId: number, updates: UpdateRequestDto): ArticleRequestDto | null {
  const index = requests.findIndex(r => r.requestId === requestId);
  if (index === -1) return null;

  const updated = {
    ...requests[index],
    ...updates,
    statusName: updates.statusId === 1 ? 'Pending' : updates.statusId === 2 ? 'Under Review' : updates.statusId === 3 ? 'Approved' : updates.statusId === 4 ? 'Rejected' : requests[index].statusName,
    assignedToName: updates.assignedToUserId ? users.find(u => u.userId === updates.assignedToUserId)?.fullName : requests[index].assignedToName,
    updatedAt: new Date().toISOString(),
    completedAt: updates.statusId === 3 || updates.statusId === 4 ? new Date().toISOString() : requests[index].completedAt,
  };

  requests = requests.map((r, i) => i === index ? updated : r);

  // Cross-domain: notify requester of status change
  if (updates.statusId && updates.statusId !== requests[index]?.statusId) {
    const req = requests.find(r => r.requestId === requestId)!;
    const notif: NotificationDto = {
      notificationId: nextId(),
      userId: req.requestedByUserId,
      title: updates.statusId === 3 ? 'Request Approved' : updates.statusId === 4 ? 'Request Rejected' : 'Request Updated',
      message: `Your request "${req.title}" has been ${updated.statusName.toLowerCase()}`,
      notificationType: updates.statusId === 3 ? 'RequestApproved' : updates.statusId === 4 ? 'RequestRejected' : 'RequestUpdated',
      relatedEntityType: 'Request',
      relatedEntityId: requestId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    notifications = [...notifications, notif];
    notify('notifications');
  }

  notify('requests');
  return updated;
}

function deleteRequest(requestId: number): boolean {
  const before = requests.length;
  requests = requests.filter(r => r.requestId !== requestId);
  if (requests.length < before) {
    notify('requests');
    return true;
  }
  return false;
}

// ─── Notification Methods ──────────────────────────────

function getNotificationsForUser(userId?: number): NotificationDto[] {
  const uid = userId || currentUser?.userId;
  if (!uid) return [];
  return notifications.filter(n => n.userId === uid);
}

function markNotificationAsRead(notificationId: number) {
  const n = notifications.find(x => x.notificationId === notificationId);
  if (n) {
    n.isRead = true;
    n.readAt = new Date().toISOString();
    notifications = [...notifications];
    notify('notifications');
  }
}

function markAllNotificationsAsRead(userId?: number) {
  const uid = userId || currentUser?.userId;
  if (!uid) return;
  notifications = notifications.map(n =>
    n.userId === uid && !n.isRead
      ? { ...n, isRead: true, readAt: new Date().toISOString() }
      : n
  );
  notify('notifications');
}

function createNotification(data: Omit<NotificationDto, 'notificationId' | 'isRead' | 'createdAt'>): NotificationDto {
  const notif: NotificationDto = {
    ...data,
    notificationId: nextId(),
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  notifications = [...notifications, notif];
  notify('notifications');
  return notif;
}

// ─── Feedback Methods ──────────────────────────────────

function submitFeedback(articleId: number, data: SubmitFeedbackDto): FeedbackDto {
  const article = articles.find(a => a.articleId === articleId);
  const newFeedback: FeedbackDto = {
    feedbackId: nextId(),
    articleId,
    articleTitle: article?.title,
    userId: currentUser?.userId || 0,
    userName: currentUser?.fullName || 'Unknown',
    rating: data.rating,
    isHelpful: data.isHelpful,
    feedbackText: data.feedbackText,
    category: data.category,
    createdAt: new Date().toISOString(),
    isResolved: false,
  };
  feedback = [...feedback, newFeedback];

  // Cross-domain: notify article author
  if (article) {
    createNotification({
      userId: article.createdBy,
      title: 'New Article Feedback',
      message: `${currentUser?.fullName || 'Someone'} rated "${article.title}": ${data.rating}/5`,
      notificationType: 'Feedback',
      relatedEntityType: 'Article',
      relatedEntityId: articleId,
    });
  }

  notify('feedback');
  return newFeedback;
}

function resolveFeedback(feedbackId: number, data: ResolveFeedbackDto): FeedbackDto | null {
  const index = feedback.findIndex(f => f.feedbackId === feedbackId);
  if (index === -1) return null;

  feedback = feedback.map((f, i) =>
    i === index
      ? {
          ...f,
          isResolved: true,
          resolvedBy: currentUser?.userId,
          resolvedByName: currentUser?.fullName,
          resolvedAt: new Date().toISOString(),
          resolutionNotes: data.resolutionNotes,
        }
      : f
  );
  notify('feedback');
  return feedback[index];
}

function unresolveFeedback(feedbackId: number): FeedbackDto | null {
  const index = feedback.findIndex(f => f.feedbackId === feedbackId);
  if (index === -1) return null;

  feedback = feedback.map((f, i) =>
    i === index
      ? {
          ...f,
          isResolved: false,
          resolvedBy: undefined,
          resolvedByName: undefined,
          resolvedAt: undefined,
          resolutionNotes: undefined,
        }
      : f
  );
  notify('feedback');
  return feedback[index];
}

function deleteFeedback(feedbackId: number): boolean {
  const before = feedback.length;
  feedback = feedback.filter(f => f.feedbackId !== feedbackId);
  if (feedback.length < before) {
    notify('feedback');
    return true;
  }
  return false;
}

// ─── Approval Methods ──────────────────────────────────

function submitForApproval(articleId: number, comments?: string): ApprovalDto {
  const article = articles.find(a => a.articleId === articleId);
  const approval: ApprovalDto = {
    approvalId: nextId(),
    articleId,
    articleTitle: article?.title || 'Unknown',
    submittedBy: currentUser?.userId || 0,
    submittedByName: currentUser?.fullName || 'Unknown',
    submittedByEmail: currentUser?.email || '',
    currentStage: 'AdminApproval',
    statusId: 1,
    statusName: 'Pending',
    submittedAt: new Date().toISOString(),
    comments,
  };
  approvals = [...approvals, approval];

  // Update article status
  updateArticle(articleId, { statusId: 3, statusName: 'Pending Admin Approval' });

  // Notify admins
  createNotification({
    userId: 1,
    title: 'Article Pending Approval',
    message: `${currentUser?.fullName || 'Someone'} submitted "${article?.title}" for approval`,
    notificationType: 'ReviewNeeded',
    relatedEntityType: 'Article',
    relatedEntityId: articleId,
  });

  notify('approvals');
  return approval;
}

function approveArticle(approvalId: number, comments?: string): ApprovalDto | null {
  const index = approvals.findIndex(a => a.approvalId === approvalId);
  if (index === -1) return null;

  const approval = {
    ...approvals[index],
    statusId: 2,
    statusName: 'Approved',
    approvedBy: currentUser?.userId,
    approvedByName: currentUser?.fullName,
    approvedAt: new Date().toISOString(),
    comments: comments || approvals[index].comments,
  };
  approvals = approvals.map((a, i) => i === index ? approval : a);

  // Cross-domain: publish the article
  publishArticle(approval.articleId);

  // Notify submitter
  createNotification({
    userId: approval.submittedBy!,
    title: 'Article Approved',
    message: `Your article "${approval.articleTitle}" has been approved and published`,
    notificationType: 'ArticleApproved',
    relatedEntityType: 'Article',
    relatedEntityId: approval.articleId,
  });

  notify('approvals');
  return approval;
}

function rejectApproval(approvalId: number, reason?: string): ApprovalDto | null {
  const index = approvals.findIndex(a => a.approvalId === approvalId);
  if (index === -1) return null;

  const approval = {
    ...approvals[index],
    statusId: 3,
    statusName: 'Rejected',
    reviewedBy: currentUser?.userId,
    reviewedByName: currentUser?.fullName,
    reviewedAt: new Date().toISOString(),
    rejectionReason: reason,
  };
  approvals = approvals.map((a, i) => i === index ? approval : a);

  // Update article status back to draft
  updateArticle(approval.articleId, { statusId: 5, statusName: 'Rejected' });

  // Notify submitter
  createNotification({
    userId: approval.submittedBy!,
    title: 'Article Rejected',
    message: `Your article "${approval.articleTitle}" was rejected${reason ? ': ' + reason : ''}`,
    notificationType: 'ArticleRejected',
    relatedEntityType: 'Article',
    relatedEntityId: approval.articleId,
  });

  notify('approvals');
  return approval;
}

// ─── Attachment Methods ────────────────────────────────

function addAttachment(data: Partial<AttachmentDto> & { articleId: number; fileName: string }): AttachmentDto {
  const att: AttachmentDto = {
    attachmentId: nextId(),
    articleId: data.articleId,
    fileName: data.fileName,
    originalFileName: data.originalFileName || data.fileName,
    fileSize: data.fileSize || 0,
    fileType: data.fileType || 'application/octet-stream',
    filePath: data.filePath || `/uploads/attachments/${data.fileName}`,
    fileExtension: data.fileExtension || '.' + data.fileName.split('.').pop(),
    uploadedBy: currentUser?.userId || 1,
    uploadedByName: currentUser?.fullName || 'Unknown',
    uploadedAt: new Date().toISOString(),
    description: data.description,
    isImage: data.isImage || /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(data.fileName),
    thumbnailPath: data.thumbnailPath,
    downloadCount: 0,
    isDeleted: false,
  };
  attachments = [...attachments, att];
  notify('attachments');
  return att;
}

function deleteAttachment(attachmentId: number): boolean {
  const att = attachments.find(a => a.attachmentId === attachmentId);
  if (!att) return false;
  att.isDeleted = true;
  att.deletedAt = new Date().toISOString();
  att.deletedBy = currentUser?.userId;
  att.deletedByName = currentUser?.fullName;
  attachments = [...attachments];
  notify('attachments');
  return true;
}

function getArticleAttachments(articleId: number, includeDeleted = false): AttachmentDto[] {
  return attachments.filter(a =>
    a.articleId === articleId && (includeDeleted || !a.isDeleted)
  );
}

// ─── Template Methods ──────────────────────────────────

function createTemplate(data: Partial<TemplateDto>): TemplateDto {
  const tmpl: TemplateDto = {
    templateId: nextId(),
    templateName: data.templateName || 'New Template',
    description: data.description,
    category: data.category,
    titleTemplate: data.titleTemplate,
    contentTemplate: data.contentTemplate || '',
    summaryTemplate: data.summaryTemplate,
    isInternal: data.isInternal ?? false,
    isActive: true,
    usageCount: 0,
    createdBy: currentUser?.userId || 1,
    createdByName: currentUser?.fullName || 'Unknown',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: data.fields || [],
    tags: data.tags || [],
  };
  templates = [...templates, tmpl];
  notify('templates');
  return tmpl;
}

function updateTemplate(templateId: number, updates: Partial<TemplateDto>): TemplateDto | null {
  const index = templates.findIndex(t => t.templateId === templateId);
  if (index === -1) return null;
  templates = templates.map((t, i) => i === index ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t);
  notify('templates');
  return templates[index];
}

function deleteTemplate(templateId: number): boolean {
  const before = templates.length;
  templates = templates.filter(t => t.templateId !== templateId);
  if (templates.length < before) {
    notify('templates');
    return true;
  }
  return false;
}

// ─── Version Methods ───────────────────────────────────

function getArticleVersions(articleId: number): StoredArticleVersion[] {
  return articleVersions
    .filter(v => v.articleId === articleId)
    .sort((a, b) => b.versionNumber - a.versionNumber);
}

function getVersionById(versionId: number): StoredArticleVersion | undefined {
  return articleVersions.find(v => v.versionId === versionId);
}

function restoreVersion(articleId: number, versionId: number): ArticleDto | null {
  const version = articleVersions.find(v => v.versionId === versionId && v.articleId === articleId);
  if (!version) return null;

  return updateArticle(articleId, {
    content: version.content,
    title: version.title,
    summary: version.summary,
  });
}

// ─── Activity Log Methods ──────────────────────────────

function addActivityLog(data: CreateActivityLog): ActivityLog {
  const log: ActivityLog = {
    activityId: nextId(),
    userId: data.userId || currentUser?.userId,
    userName: currentUser?.fullName,
    userEmail: currentUser?.email,
    entityType: data.entityType,
    entityId: data.entityId,
    action: data.action,
    description: data.description,
    oldValue: data.oldValue,
    newValue: data.newValue,
    createdAt: new Date().toISOString(),
  };
  activityLogs = [...activityLogs, log];
  notify('activity');
  return log;
}

// ─── Search / Chat Methods ─────────────────────────────

function addSearchHistory(query: string, resultCount: number) {
  const entry: SearchHistoryEntry = {
    id: `s${nextId()}`,
    userId: currentUser?.userId || 0,
    query,
    resultCount,
    timestamp: new Date().toISOString(),
  };
  searchHistory = [...searchHistory, entry];
  notify('search');
}

function getRecentSearches(limit = 10): SearchHistoryEntry[] {
  return searchHistory
    .filter(s => s.userId === currentUser?.userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

function addChatMessage(msg: ChatMessage) {
  chatHistory = [...chatHistory, msg];
  notify('search');
}

function clearChatHistory() {
  chatHistory = [];
  notify('search');
}

// ─── AI Config Methods ─────────────────────────────────

function updateAIConfig(updates: Partial<AIConfig>) {
  aiConfig = { ...aiConfig, ...updates };
  notify('aiConfig');
}

// ─── Computed Getters ──────────────────────────────────

function getUnreadNotificationCount(userId?: number): number {
  const uid = userId || currentUser?.userId;
  if (!uid) return 0;
  return notifications.filter(n => n.userId === uid && !n.isRead).length;
}

function getPendingApprovals(): ApprovalDto[] {
  return approvals.filter(a => a.statusId === 1);
}

function getPendingRequestCount(): number {
  return requests.filter(r => r.statusId === 1).length;
}

function getArticleMetrics(articleId: number) {
  const articleFeedback = feedback.filter(f => f.articleId === articleId);
  const totalFeedback = articleFeedback.length;
  const averageRating = totalFeedback > 0
    ? articleFeedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
    : 0;
  const helpfulCount = articleFeedback.filter(f => f.isHelpful === true).length;
  const notHelpfulCount = articleFeedback.filter(f => f.isHelpful === false).length;

  return { articleId, totalFeedback, averageRating, helpfulCount, notHelpfulCount };
}

function getPublishedArticleCount(): number {
  return articles.filter(a => a.isPublished).length;
}

function getActiveUserCount(): number {
  return users.filter(u => u.isActive).length;
}

// ─── Reset to defaults ─────────────────────────────────

function resetToDefaults() {
  clearAllPersistedData();
  articles = [...DEFAULT_ARTICLES];
  users = [...DEFAULT_USERS];
  tags = [...DEFAULT_TAGS];
  requests = [...DEFAULT_REQUESTS];
  notifications = [...DEFAULT_NOTIFICATIONS];
  feedback = [...DEFAULT_FEEDBACK];
  approvals = [...DEFAULT_APPROVALS];
  attachments = [...DEFAULT_ATTACHMENTS];
  templates = [...DEFAULT_TEMPLATES];
  articleVersions = buildDefaultVersions();
  activityLogs = [...DEFAULT_ACTIVITY_LOGS];
  searchHistory = [];
  chatHistory = [];
  aiConfig = { ...DEFAULT_AI_CONFIG };
  currentUser = null;

  // Notify all slices
  (Object.keys(subscribers) as Slice[]).forEach(slice => notify(slice));
}

// ─── Public API ────────────────────────────────────────
export const appStore = {
  // ─── Reactive State (read by hooks) ──────────────────
  get currentUser() { return currentUser; },
  get articles() { return articles; },
  get users() { return users; },
  get roles() { return roles; },
  get teams() { return teams; },
  get clients() { return clients; },
  get tags() { return tags; },
  get tagTypes() { return tagTypes; },
  get requests() { return requests; },
  get notifications() { return notifications; },
  get feedback() { return feedback; },
  get approvals() { return approvals; },
  get attachments() { return attachments; },
  get templates() { return templates; },
  get articleVersions() { return articleVersions; },
  get activityLogs() { return activityLogs; },
  get searchHistory() { return searchHistory; },
  get chatHistory() { return chatHistory; },
  get aiConfig() { return aiConfig; },

  // ─── Computed Getters ────────────────────────────────
  get unreadNotificationCount() { return getUnreadNotificationCount(); },
  get pendingApprovals() { return getPendingApprovals(); },
  get pendingRequestCount() { return getPendingRequestCount(); },
  get publishedArticleCount() { return getPublishedArticleCount(); },
  get activeUserCount() { return getActiveUserCount(); },
  getUnreadNotificationCount,
  getNotificationsForUser,
  getArticlesFiltered,
  getArticleById,
  getArticleAttachments,
  getArticleVersions,
  getVersionById,
  getArticleMetrics,
  getRecentSearches,

  // ─── Auth Mutations ──────────────────────────────────
  loginUser,
  logoutUser,
  setCurrentUser,

  // ─── Article Mutations ───────────────────────────────
  createArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  incrementArticleViews,

  // ─── User Mutations ──────────────────────────────────
  createUser,
  updateUser,
  deleteUser,

  // ─── Tag Mutations ───────────────────────────────────
  createTag,
  updateTag,
  deleteTag,

  // ─── Request Mutations ───────────────────────────────
  createRequest,
  updateRequest,
  deleteRequest,

  // ─── Notification Mutations ──────────────────────────
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,

  // ─── Feedback Mutations ──────────────────────────────
  submitFeedback,
  resolveFeedback,
  unresolveFeedback,
  deleteFeedback,

  // ─── Approval Mutations ──────────────────────────────
  submitForApproval,
  approveArticle,
  rejectApproval,

  // ─── Attachment Mutations ────────────────────────────
  addAttachment,
  deleteAttachment,

  // ─── Template Mutations ──────────────────────────────
  createTemplate,
  updateTemplate,
  deleteTemplate,

  // ─── Version Mutations ───────────────────────────────
  restoreVersion,

  // ─── Activity Log Mutations ──────────────────────────
  addActivityLog,

  // ─── Search / Chat Mutations ─────────────────────────
  addSearchHistory,
  addChatMessage,
  clearChatHistory,

  // ─── AI Config Mutations ─────────────────────────────
  updateAIConfig,

  // ─── Reset ───────────────────────────────────────────
  resetToDefaults,

  // ─── Pub/Sub ─────────────────────────────────────────
  subscribe(slice: Slice, listener: Listener): () => void {
    subscribers[slice].add(listener);
    return () => { subscribers[slice].delete(listener); };
  },
};