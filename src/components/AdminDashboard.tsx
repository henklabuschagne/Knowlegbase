import { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  BarChart3,
  Users,
  FileText,
  Shield,
  Database,
  Activity,
  Mail,
  FileType,
  CheckSquare,
  MessageSquare,
  ClipboardList,
} from 'lucide-react';
import { ActivityLogViewer } from './ActivityLogViewer';
import { TemplateManager } from './TemplateManager';
import { PermissionManager } from './PermissionManager';
import { ExportImport } from './ExportImport';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    articles,
    users,
    tags,
    feedback,
    requests,
    templates,
    activityLogs,
    publishedArticleCount,
    activeUserCount,
    pendingApprovals,
    pendingRequestCount,
    unreadNotificationCount,
  } = useAppStore(
    'articles', 'users', 'tags', 'feedback', 'requests',
    'templates', 'activity', 'approvals', 'notifications'
  );

  const draftCount = articles.filter(a => a.statusId === 1).length;
  const pendingReviewCount = articles.filter(a => a.statusId === 2 || a.statusId === 3).length;
  const totalViews = articles.reduce((sum, a) => sum + (a.viewCount || 0), 0);
  const resolvedFeedback = feedback.filter(f => f.isResolved).length;
  const unresolvedFeedback = feedback.filter(f => !f.isResolved).length;

  // Get recent activity logs (last 10)
  const recentLogs = [...activityLogs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const actionColorMap: Record<string, string> = {
    Published: 'bg-green-500',
    Created: 'bg-blue-500',
    Updated: 'bg-yellow-500',
    SubmittedForApproval: 'bg-purple-500',
    Submitted: 'bg-indigo-500',
    Deleted: 'bg-red-500',
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive system administration and management
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="export">Export/Import</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Stats Row 1 - Core counts */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Users</CardTitle>
                <Users className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activeUserCount} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Articles</CardTitle>
                <FileText className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{articles.length}</div>
                <p className="text-xs text-muted-foreground">
                  {publishedArticleCount} published, {draftCount} drafts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Views</CardTitle>
                <BarChart3 className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Across all articles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Tags</CardTitle>
                <Activity className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{tags.length}</div>
                <p className="text-xs text-muted-foreground">
                  {templates.length} templates
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Row 2 - Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Pending Approvals</CardTitle>
                <CheckSquare className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{pendingApprovals.length}</div>
                <p className="text-xs text-muted-foreground">
                  {pendingReviewCount} in review pipeline
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Open Requests</CardTitle>
                <ClipboardList className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{pendingRequestCount}</div>
                <p className="text-xs text-muted-foreground">
                  {requests.length} total requests
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Feedback</CardTitle>
                <MessageSquare className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{feedback.length}</div>
                <p className="text-xs text-muted-foreground">
                  {unresolvedFeedback} unresolved, {resolvedFeedback} resolved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Activity Logs</CardTitle>
                <Activity className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{activityLogs.length}</div>
                <p className="text-xs text-muted-foreground">
                  System-wide events
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setActiveTab('activity')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <Activity className="size-5 text-brand-primary" />
                  <div>
                    <div>View Activity Logs</div>
                    <div className="text-sm text-muted-foreground">
                      {activityLogs.length} total events
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('templates')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <FileType className="size-5 text-brand-success" />
                  <div>
                    <div>Manage Templates</div>
                    <div className="text-sm text-muted-foreground">
                      {templates.length} templates available
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('permissions')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <Shield className="size-5 text-brand-secondary" />
                  <div>
                    <div>Manage Permissions</div>
                    <div className="text-sm text-muted-foreground">
                      Configure roles and teams
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('export')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <Database className="size-5 text-brand-warning" />
                  <div>
                    <div>Backup & Export</div>
                    <div className="text-sm text-muted-foreground">
                      Export data and create backups
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('email')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <Mail className="size-5 text-brand-error" />
                  <div>
                    <div>Email Management</div>
                    <div className="text-sm text-muted-foreground">
                      Configure email settings
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events from the data store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLogs.length === 0 && (
                    <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
                  )}
                  {recentLogs.map((log) => (
                    <div key={log.activityId} className="flex items-start gap-3">
                      <div
                        className={`size-2 rounded-full mt-2 shrink-0 ${
                          actionColorMap[log.action] || 'bg-gray-400'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{log.description}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{log.userName}</span>
                          <span>&middot;</span>
                          <span>{formatTimeAgo(log.createdAt)}</span>
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {log.action}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <ActivityLogViewer />
        </TabsContent>

        <TabsContent value="templates">
          <TemplateManager />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionManager />
        </TabsContent>

        <TabsContent value="export">
          <ExportImport />
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="size-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Manage email settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-brand-primary-light rounded-lg">
                  <h3 className="mb-2">Email Queue Status</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Notifications</div>
                      <div className="text-2xl">{unreadNotificationCount}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Users</div>
                      <div className="text-2xl">{users.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Active</div>
                      <div className="text-2xl">{activeUserCount}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="mb-2">Email Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage email templates for notifications, approvals, and system
                    messages. Email templates can be customized with dynamic variables
                    and HTML formatting.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}