import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Loader2, ArrowLeft, Bell, CheckCircle, Circle, Eye } from 'lucide-react';

export function NotificationsPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { actions } = useAppStore('notifications');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadNotifications();
    loadUnreadCount();
  }, [user, navigate, showUnreadOnly]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const result = await actions.getNotifications(user?.userId);
      if (result.success) {
        let items = result.data;
        if (showUnreadOnly) {
          items = items.filter((n: any) => !n.isRead);
        }
        setNotifications(items);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const result = await actions.getUnreadCount(user?.userId);
      if (result.success) {
        setUnreadCount(result.data);
      }
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const result = await actions.markNotificationAsRead(notificationId);
      if (result.success) {
        loadNotifications();
        loadUnreadCount();
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await actions.markAllNotificationsAsRead(user?.userId);
      if (result.success) {
        loadNotifications();
        loadUnreadCount();
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.notificationId);
    }

    // Navigate based on notification type
    if (notification.relatedEntityType === 'Article' && notification.relatedEntityId) {
      navigate(`/articles/${notification.relatedEntityId}`);
    } else if (notification.relatedEntityType === 'Request' && notification.relatedEntityId) {
      navigate(`/requests`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ArticleRequest':
      case 'ArticleRequestUpdate':
        return '📝';
      case 'ArticleApproval':
        return '⏳';
      case 'ArticleApproved':
        return '✅';
      case 'ArticleRejected':
        return '❌';
      case 'ArticlePublished':
        return '🎉';
      default:
        return '📢';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showUnreadOnly ? 'default' : 'outline'}
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          >
            <Eye className="size-4 mr-2" />
            {showUnreadOnly ? 'Show All' : 'Unread Only'}
          </Button>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead}>
              <CheckCircle className="size-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="size-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {showUnreadOnly ? 'No unread notifications' : 'No notifications yet'}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {notifications.map((notification, index) => (
                  <div key={notification.notificationId}>
                    <div
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        notification.isRead
                          ? 'hover:bg-muted/50'
                          : 'bg-blue-50 hover:bg-blue-100'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.notificationType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className={notification.isRead ? '' : 'font-semibold'}>
                                  {notification.title}
                                </p>
                                {!notification.isRead && (
                                  <Circle className="size-2 fill-blue-600 text-blue-600" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.notificationId);
                                }}
                              >
                                <CheckCircle className="size-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < notifications.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}