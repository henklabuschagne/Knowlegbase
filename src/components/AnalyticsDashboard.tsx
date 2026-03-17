import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import type { DashboardAnalyticsDto } from '../types/dto';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Search,
  MessageSquare,
  Calendar,
  Loader2,
  Eye,
  Star,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AnalyticsDashboard() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { actions } = useAppStore('articles', 'search');
  const [analytics, setAnalytics] = useState<DashboardAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    if (!user || !hasRole(['Admin', 'Support'])) {
      navigate('/');
      return;
    }
    loadAnalytics();
  }, [user, navigate, dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const days = parseInt(dateRange);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const result = await actions.getDashboardAnalytics(startDate, endDate);
      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user || !hasRole(['Admin', 'Support'])) return null;

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <p className="text-center text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl flex items-center gap-2">
            <BarChart3 className="size-8" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into knowledge base performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-muted-foreground" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="size-4" />
              Published Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{analytics.overallStats.totalPublishedArticles}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="size-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{analytics.overallStats.totalViewsInPeriod.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="size-4" />
              Total Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{analytics.overallStats.totalSearchesInPeriod.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="size-4" />
              Feedback Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{analytics.overallStats.totalFeedbackInPeriod}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="size-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{analytics.overallStats.totalActiveUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="size-4 text-orange-500" />
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-orange-500">{analytics.overallStats.pendingRequests}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="size-4 text-blue-500" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-blue-500">{analytics.overallStats.pendingApprovals}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="views" className="space-y-6">
        <TabsList>
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="views" className="space-y-6">
          {/* View Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Article Views Trend</CardTitle>
              <CardDescription>Daily article views over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.viewTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.viewTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="viewDate"
                      tickFormatter={formatDate}
                    />
                    <YAxis />
                    <Tooltip labelFormatter={formatDate} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="viewCount"
                      stroke="#3b82f6"
                      name="Total Views"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="uniqueUsers"
                      stroke="#10b981"
                      name="Unique Users"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">No view data available</p>
              )}
            </CardContent>
          </Card>

          {/* Top Viewed Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Top Viewed Articles</CardTitle>
              <CardDescription>Most popular articles in the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.topViewedArticles.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topViewedArticles.map((article, index) => (
                    <div
                      key={article.articleId}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer"
                      onClick={() => navigate(`/articles/${article.articleId}`)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div>
                          <h4>{article.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {article.viewCount} views • {article.uniqueViewers} unique viewers
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No articles viewed in this period</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          {/* Search Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Search Activity Trend</CardTitle>
              <CardDescription>Daily search activity by type</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.searchTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.searchTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="searchDate"
                      tickFormatter={formatDate}
                    />
                    <YAxis />
                    <Tooltip labelFormatter={formatDate} />
                    <Legend />
                    <Bar dataKey="searchCount" fill="#3b82f6" name="Searches" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">No search data available</p>
              )}
            </CardContent>
          </Card>

          {/* Top Search Queries */}
          <Card>
            <CardHeader>
              <CardTitle>Top Search Queries</CardTitle>
              <CardDescription>Most frequently searched terms</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.topSearchQueries.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topSearchQueries.map((query, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="size-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4>{query.searchQuery}</h4>
                          <p className="text-sm text-muted-foreground">
                            {query.searchCount} searches • Avg {query.avgResultsCount.toFixed(1)} results
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                          {query.searchType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No search queries in this period</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Breakdown</CardTitle>
              <CardDescription>Distribution of user activities</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.userActivitySummary.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.userActivitySummary}
                        dataKey="activityCount"
                        nameKey="activityType"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {analytics.userActivitySummary.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-3">
                    {analytics.userActivitySummary.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-4 rounded"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span>{activity.activityType}</span>
                        </div>
                        <div className="text-right">
                          <p>{activity.activityCount} activities</p>
                          <p className="text-sm text-muted-foreground">{activity.uniqueUsers} users</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No activity data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Summary by Category</CardTitle>
              <CardDescription>Feedback statistics grouped by category</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.feedbackSummary.length > 0 ? (
                <div className="space-y-4">
                  {analytics.feedbackSummary.map((feedback, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4>{feedback.category || 'General'}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          <span>{feedback.avgRating?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="text-lg">{feedback.totalFeedback}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Helpful</p>
                          <p className="text-lg text-green-600">{feedback.helpfulCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Not Helpful</p>
                          <p className="text-lg text-red-600">{feedback.notHelpfulCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Resolved</p>
                          <p className="text-lg text-blue-600">{feedback.resolvedCount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No feedback data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}