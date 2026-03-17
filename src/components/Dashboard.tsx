import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Search, 
  Tag as TagIcon,
  FileText,
  Plus,
  Sparkles,
  BookOpen,
  Filter,
  X,
  User,
  Calendar,
  Eye,
  Loader2,
  ClipboardList,
  CheckSquare,
  MessageSquare,
} from 'lucide-react';
import { Separator } from './ui/separator';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const {
    tags,
    actions,
    unreadNotificationCount,
    pendingRequestCount,
    pendingApprovals,
    publishedArticleCount,
  } = useAppStore('articles', 'tags', 'notifications', 'requests', 'approvals');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Role-based filtering:
      // - Admin/Support see all articles
      // - Normal users see only published, non-internal articles (+ their client's articles)
      const params: any = { pageSize: 100 };

      if (!hasRole(['Admin', 'Support'])) {
        params.isPublished = true;
      }

      const result = await actions.getArticles(params);
      if (result.success) {
        let data = result.data.data;

        // Normal users: exclude internal articles unless they belong to the user's client
        if (!hasRole(['Admin', 'Support'])) {
          data = data.filter((a: any) =>
            !a.isInternal || (user?.clientId && a.clientId === user.clientId)
          );
        }

        setArticles(data);
        setFilteredArticles(data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
      return;
    }

    try {
      const params: any = {
        searchTerm: searchQuery,
        pageSize: 100,
      };

      if (!hasRole(['Admin', 'Support'])) {
        params.isPublished = true;
      }

      const result = await actions.getArticles(params);
      if (result.success) {
        let data = result.data.data;
        if (!hasRole(['Admin', 'Support'])) {
          data = data.filter((a: any) =>
            !a.isInternal || (user?.clientId && a.clientId === user.clientId)
          );
        }
        setFilteredArticles(data);
      }
    } catch (err) {
      console.error('Error searching:', err);
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSelectedTagIds([]);
    setSearchQuery('');
    setFilteredArticles(articles);
  };

  useEffect(() => {
    if (selectedTagIds.length === 0) {
      setFilteredArticles(articles);
      return;
    }

    const filtered = articles.filter(article =>
      article.tags?.some((t: any) => selectedTagIds.includes(t.tagId))
    );
    setFilteredArticles(filtered);
  }, [selectedTagIds, articles]);

  // Group tags by type
  const allTags = tags;
  const tagsByType = allTags.reduce((acc, tag) => {
    if (!acc[tag.tagTypeName]) {
      acc[tag.tagTypeName] = [];
    }
    acc[tag.tagTypeName].push(tag);
    return acc;
  }, {} as Record<string, typeof allTags[number][]>);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user) return null;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome banner */}
        <div>
          <h1 className="text-3xl mb-2">Welcome back, {user.firstName}</h1>
          <p className="text-muted-foreground">
            {user.roleName === 'Admin'
              ? 'Full system access — manage articles, users, and workflows'
              : user.roleName === 'Support'
              ? 'Review requests, manage articles, and handle approvals'
              : user.clientName
              ? `Browse documentation for ${user.clientName}`
              : 'Search and browse the knowledge base'}
          </p>
        </div>

        {/* Quick stats for Admin/Support */}
        {hasRole(['Admin', 'Support']) && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/articles')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-primary-light rounded-lg">
                    <FileText className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Published Articles</p>
                    <p className="text-2xl">{publishedArticleCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/manage/requests')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-warning-light rounded-lg">
                    <ClipboardList className="w-6 h-6 text-brand-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Requests</p>
                    <p className="text-2xl">{pendingRequestCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/approvals')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-success-light rounded-lg">
                    <CheckSquare className="w-6 h-6 text-brand-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Approvals</p>
                    <p className="text-2xl">{pendingApprovals.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/manage/feedback')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-error-light rounded-lg">
                    <MessageSquare className="w-6 h-6 text-brand-error" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unread Notifications</p>
                    <p className="text-2xl">{unreadNotificationCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="size-5 text-brand-primary" />
                  Search Knowledge Base
                </CardTitle>
                <CardDescription>
                  Find articles by searching or filtering by tags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="text-base"
                  />
                  <Button onClick={handleSearch} disabled={loading} className="px-6">
                    <Search className="size-4 mr-2" />
                    Search
                  </Button>
                  {(searchQuery || selectedTagIds.length > 0) && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/search/ai')} 
                    className="flex-1"
                  >
                    <Sparkles className="size-4 mr-2" />
                    AI-Powered Search
                  </Button>
                  <Button 
                    onClick={() => navigate('/search/advanced')} 
                    variant="outline"
                    className="flex-1"
                  >
                    <Filter className="size-4 mr-2" />
                    Advanced Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tag Filters */}
            {Object.keys(tagsByType).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Filter className="size-5" />
                      Filter by Tags
                    </span>
                    {selectedTagIds.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {selectedTagIds.length} selected
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(tagsByType).map(([typeName, tags]) => (
                    <div key={typeName}>
                      <p className="text-sm mb-2 text-muted-foreground">{typeName}</p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag.tagId}
                            variant={selectedTagIds.includes(tag.tagId) ? "default" : "outline"}
                            className="cursor-pointer"
                            style={{
                              backgroundColor: selectedTagIds.includes(tag.tagId) && tag.colorCode
                                ? tag.colorCode
                                : undefined,
                              borderColor: tag.colorCode || undefined,
                            }}
                            onClick={() => toggleTag(tag.tagId)}
                          >
                            {tag.tagName}
                            {selectedTagIds.includes(tag.tagId) && (
                              <X className="size-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Articles List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl">
                  {selectedTagIds.length > 0 || searchQuery ? 'Filtered Articles' : 'All Articles'}
                  <span className="text-muted-foreground ml-2">
                    ({filteredArticles.length})
                  </span>
                </h2>
                {hasRole(['Admin', 'Support']) && (
                  <Button onClick={() => navigate('/articles/new')}>
                    <Plus className="size-4 mr-2" />
                    New Article
                  </Button>
                )}
              </div>

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              )}

              {!loading && filteredArticles.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="size-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No articles found</p>
                  </CardContent>
                </Card>
              )}

              {!loading && filteredArticles.map((article) => (
                <Card
                  key={article.articleId}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/articles/${article.articleId}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{article.title}</CardTitle>
                        {article.summary && (
                          <CardDescription className="mt-2">
                            {article.summary}
                          </CardDescription>
                        )}
                      </div>
                      <Badge
                        className={
                          article.statusName === 'Published'
                            ? 'bg-brand-success-light text-brand-success border-0'
                            : article.statusName === 'Draft'
                            ? 'bg-gray-100 text-gray-800 border-0'
                            : 'bg-brand-warning-light text-brand-warning border-0'
                        }
                      >
                        {article.statusName}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
                      <div className="flex items-center gap-1">
                        <User className="size-4" />
                        {article.createdByName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        {formatDate(article.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="size-4" />
                        {article.viewCount} views
                      </div>
                      {article.isInternal && (
                        <Badge variant="outline">Internal</Badge>
                      )}
                      {article.tags?.map((tag: any) => (
                        <Badge
                          key={tag.tagId}
                          variant="secondary"
                          className="text-xs"
                          style={{ borderColor: tag.colorCode || undefined }}
                        >
                          {tag.tagName}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {hasRole(['Admin', 'Support']) ? 'Total Articles' : 'Available Articles'}
                  </p>
                  <p className="text-2xl">{articles.length}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-2xl">
                    {articles.filter(a => a.statusName === 'Published').length}
                  </p>
                </div>
                {hasRole(['Admin', 'Support']) && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Review</p>
                      <p className="text-2xl">
                        {articles.filter(a =>
                          a.statusName?.includes('Pending')
                        ).length}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Drafts</p>
                      <p className="text-2xl">
                        {articles.filter(a => a.statusName === 'Draft').length}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {articles
                    .filter(a => a.statusName === 'Published')
                    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                    .slice(0, 5)
                    .map((article) => (
                      <div
                        key={article.articleId}
                        className="cursor-pointer hover:bg-muted p-2 rounded -mx-2"
                        onClick={() => navigate(`/articles/${article.articleId}`)}
                      >
                        <p className="text-sm">{article.title}</p>
                        <p className="text-xs text-muted-foreground">
                          <Eye className="size-3 inline mr-1" />
                          {article.viewCount} views
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Request button for normal users */}
            {hasRole('User') && (
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Can't find what you're looking for? Request new documentation.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => navigate('/requests')}
                  >
                    <ClipboardList className="size-4 mr-2" />
                    Submit a Request
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}