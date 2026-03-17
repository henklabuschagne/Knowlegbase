import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Eye, Calendar, User, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function ArticleList() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const navigate = useNavigate();
  const { actions } = useAppStore('articles');
  const { user, hasRole } = useAuth();

  useEffect(() => {
    loadArticles();
  }, [pageNumber, searchTerm]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const params: any = {
        searchTerm: searchTerm || undefined,
        page: pageNumber,
        pageSize,
      };

      // Normal users only see published, non-internal articles
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
        setTotalCount(hasRole(['Admin', 'Support']) ? result.data.total : data.length);
      }
    } catch (error: any) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNumber(1);
    loadArticles();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case 'published':
        return 'bg-brand-success-light text-brand-success border-0';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-0';
      case 'pending review':
        return 'bg-brand-warning-light text-brand-warning border-0';
      case 'approved':
        return 'bg-brand-primary-light text-brand-primary border-0';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-0';
      default:
        return 'bg-gray-100 text-gray-800 border-0';
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Knowledge Base Articles</h1>
          <p className="text-muted-foreground">
            Browse and search {totalCount} articles
          </p>
        </div>
        {hasRole(['Admin', 'Support']) && (
          <Button onClick={() => navigate('/articles/new')}>
            <Plus className="size-4 mr-2" />
            New Article
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search articles by title or summary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            {searchTerm && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setPageNumber(1);
                }}
              >
                Clear
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}

      {/* Articles */}
      {!loading && articles.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No articles found</p>
          </CardContent>
        </Card>
      )}

      {!loading && articles.length > 0 && (
        <div className="space-y-4">
          {articles.map((article) => (
            <Card
              key={article.articleId}
              className="hover:shadow-md transition-shadow cursor-pointer"
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
                  <Badge className={getStatusColor(article.statusName)}>
                    {article.statusName}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalCount > pageSize && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            disabled={pageNumber === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pageNumber} of {Math.ceil(totalCount / pageSize)}
          </span>
          <Button
            variant="outline"
            onClick={() => setPageNumber(p => p + 1)}
            disabled={pageNumber >= Math.ceil(totalCount / pageSize)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}