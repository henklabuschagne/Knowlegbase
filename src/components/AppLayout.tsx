import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../hooks/useAppStore';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  Search,
  Sparkles,
  Bell,
  LogOut,
  Tag,
  Users,
  MessageSquare,
  CheckSquare,
  ClipboardList,
  BarChart3,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  roles?: string[]; // If set, only visible to these roles
}

interface NavSection {
  title: string;
  items: NavItem[];
  roles?: string[];
}

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();
  const { unreadNotificationCount, pendingRequestCount, pendingApprovals } = useAppStore(
    'notifications',
    'requests',
    'approvals'
  );
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) {
    return <Outlet />;
  }

  const pendingApprovalCount = pendingApprovals?.length || 0;

  const navSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        {
          label: 'Dashboard',
          path: '/dashboard',
          icon: <LayoutDashboard className="size-5" />,
        },
        {
          label: 'Articles',
          path: '/articles',
          icon: <FileText className="size-5" />,
        },
        {
          label: 'Search',
          path: '/search/advanced',
          icon: <Search className="size-5" />,
        },
        {
          label: 'AI Search',
          path: '/search/ai',
          icon: <Sparkles className="size-5" />,
        },
        {
          label: 'Notifications',
          path: '/notifications',
          icon: <Bell className="size-5" />,
          badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
        },
      ],
    },
    {
      title: 'Requests & Feedback',
      items: [
        {
          label: 'My Requests',
          path: '/requests',
          icon: <ClipboardList className="size-5" />,
        },
        {
          label: 'Manage Requests',
          path: '/manage/requests',
          icon: <ClipboardList className="size-5" />,
          badge: pendingRequestCount > 0 ? pendingRequestCount : undefined,
          roles: ['Admin', 'Support'],
        },
        {
          label: 'Approvals',
          path: '/approvals',
          icon: <CheckSquare className="size-5" />,
          badge: pendingApprovalCount > 0 ? pendingApprovalCount : undefined,
          roles: ['Admin', 'Support'],
        },
        {
          label: 'Feedback',
          path: '/manage/feedback',
          icon: <MessageSquare className="size-5" />,
          roles: ['Admin', 'Support'],
        },
      ],
    },
    {
      title: 'Content Management',
      roles: ['Admin', 'Support'],
      items: [
        {
          label: 'Manage Articles',
          path: '/manage/articles',
          icon: <FileText className="size-5" />,
          roles: ['Admin', 'Support'],
        },
        {
          label: 'Tags',
          path: '/manage/tags',
          icon: <Tag className="size-5" />,
          roles: ['Admin'],
        },
      ],
    },
    {
      title: 'Administration',
      roles: ['Admin'],
      items: [
        {
          label: 'Admin Panel',
          path: '/admin',
          icon: <Shield className="size-5" />,
          roles: ['Admin'],
        },
        {
          label: 'Users',
          path: '/manage/users',
          icon: <Users className="size-5" />,
          roles: ['Admin'],
        },
        {
          label: 'Analytics',
          path: '/analytics',
          icon: <BarChart3 className="size-5" />,
          roles: ['Admin'],
        },
        {
          label: 'AI Settings',
          path: '/settings/ai',
          icon: <Settings className="size-5" />,
          roles: ['Admin'],
        },
      ],
    },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredSections = navSections
    .filter(section => !section.roles || hasRole(section.roles))
    .map(section => ({
      ...section,
      items: section.items.filter(item => !item.roles || hasRole(item.roles)),
    }))
    .filter(section => section.items.length > 0);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <BookOpen className="size-7 text-brand-primary shrink-0" />
          {!collapsed && (
            <h1 className="text-brand-main font-semibold truncate">Knowledge Base</h1>
          )}
        </div>
        {!collapsed && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground truncate">{user.fullName}</p>
            <Badge variant="secondary" className="mt-1 text-xs">
              {user.roleName}
            </Badge>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        {filteredSections.map((section, sIdx) => (
          <div key={section.title}>
            {sIdx > 0 && (
              <div className="my-4 border-t border-border" />
            )}
            {!collapsed && (
              <p className="text-xs text-muted-foreground px-4 py-2 uppercase tracking-wider font-medium">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map(item => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                    isActive(item.path)
                      ? 'bg-brand-primary-light text-brand-primary font-medium'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  } ${collapsed ? 'justify-center px-3' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`shrink-0 ${
                    isActive(item.path) ? 'text-brand-primary' : 'text-muted-foreground'
                  }`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0 min-w-[20px] text-center">
                          {item.badge > 99 ? '99+' : item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {collapsed && item.badge !== undefined && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full size-4 flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-border space-y-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden lg:flex"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="size-5 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="size-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Log out' : undefined}
        >
          <LogOut className="size-5 shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transform transition-transform duration-200 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-3 right-3">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
            <X className="size-5" />
          </Button>
        </div>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-border transition-all duration-200 shrink-0 h-screen ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 p-3 bg-white border-b border-border">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <BookOpen className="size-6 text-brand-primary" />
          <span className="text-brand-main font-semibold">Knowledge Base</span>
        </div>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
