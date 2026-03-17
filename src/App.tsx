import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { DevApiPanel } from './components/DevApiPanel';
import { AppLayout } from './components/AppLayout';
import { RequireAuth, RequireRole } from './components/RouteGuard';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ArticleEditor } from './components/ArticleEditor';
import { ArticleView } from './components/ArticleView';
import { ArticleManagement } from './components/ArticleManagement';
import { ArticleRequests } from './components/ArticleRequests';
import { AISettings } from './components/AISettings';
import { AISearch } from './components/AISearch';
import { NotificationsPanel } from './components/NotificationsPanel';
import { TagManagement } from './components/TagManagement';
import { ArticleList } from './components/ArticleList';
import { ApprovalQueue } from './components/ApprovalQueue';
import { ArticleVersionHistory } from './components/ArticleVersionHistory';
import { ArticleVersionCompare } from './components/ArticleVersionCompare';
import { FeedbackManagement } from './components/FeedbackManagement';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AdvancedSearch } from './components/AdvancedSearch';
import { RequestManagement } from './components/RequestManagement';
import { UserManagement } from './components/UserManagement';
import { AdminDashboard } from './components/AdminDashboard';
import { MOCK_MODE_ENABLED, initializeMockAuth } from './lib/mock';

// Initialize mock auth synchronously before first render
if (MOCK_MODE_ENABLED) {
  initializeMockAuth();
}

/**
 * Root layout — wraps every route with AuthProvider + DevApiPanel.
 */
function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
      <DevApiPanel />
    </AuthProvider>
  );
}

/**
 * Index redirect — checks auth state and redirects accordingly.
 */
function IndexRedirect() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

/**
 * Authenticated layout wrapper — requires login and renders AppLayout sidebar.
 */
function AuthenticatedLayout() {
  return (
    <RequireAuth>
      <AppLayout />
    </RequireAuth>
  );
}

/**
 * Admin-only wrapper component
 */
function AdminOnly() {
  return (
    <RequireRole roles="Admin">
      <Outlet />
    </RequireRole>
  );
}

/**
 * Support+ wrapper component (Admin or Support)
 */
function SupportOnly() {
  return (
    <RequireRole roles={['Admin', 'Support']}>
      <Outlet />
    </RequireRole>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: IndexRedirect },
      { path: "login", Component: Login },

      // All authenticated routes with sidebar
      {
        Component: AuthenticatedLayout,
        children: [
          // --- Accessible to all authenticated users ---
          { path: "dashboard", Component: Dashboard },
          { path: "articles", Component: ArticleList },
          { path: "articles/:id", Component: ArticleView },
          { path: "search/advanced", Component: AdvancedSearch },
          { path: "search/ai", Component: AISearch },
          { path: "notifications", Component: NotificationsPanel },
          { path: "requests", Component: ArticleRequests },

          // --- Support+ routes (Admin or Support) ---
          {
            Component: SupportOnly,
            children: [
              { path: "articles/new", Component: ArticleEditor },
              { path: "articles/:id/edit", Component: ArticleEditor },
              { path: "articles/:articleId/history", Component: ArticleVersionHistory },
              { path: "articles/:articleId/compare/:versionId/:compareVersionId", Component: ArticleVersionCompare },
              { path: "manage/articles", Component: ArticleManagement },
              { path: "manage/requests", Component: RequestManagement },
              { path: "manage/feedback", Component: FeedbackManagement },
              { path: "approvals", Component: ApprovalQueue },
            ],
          },

          // --- Admin-only routes ---
          {
            Component: AdminOnly,
            children: [
              { path: "admin", Component: AdminDashboard },
              { path: "manage/users", Component: UserManagement },
              { path: "manage/tags", Component: TagManagement },
              { path: "analytics", Component: AnalyticsDashboard },
              { path: "settings/ai", Component: AISettings },
              { path: "feedback", Component: FeedbackManagement },
            ],
          },
        ],
      },

      { path: "*", Component: IndexRedirect },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
