import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Search, Upload } from 'lucide-react';

export function ArticleManagement() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { actions } = useAppStore('articles');
  const [articles, setArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !hasRole(['Admin', 'Support'])) {
      navigate('/dashboard');
      return;
    }
    loadArticles();
  }, [navigate]);

  const loadArticles = async () => {
    const result = await actions.getArticles({ pageSize: 200 });
    if (result.success) {
      setArticles(result.data.data);
      setFilteredArticles(result.data.data);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = articles.filter(
      (article: any) =>
        article.title?.toLowerCase().includes(query) ||
        article.content?.toLowerCase().includes(query) ||
        article.tags?.some((tag: any) => tag.tagName?.toLowerCase().includes(query))
    );
    setFilteredArticles(filtered);
  }, [searchQuery, articles]);

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const result = await actions.deleteArticle(id);
      if (result.success) {
        loadArticles();
      }
    }
  };

  const handleImport = () => {
    alert('Import functionality: In production, this would allow uploading JSON/CSV files with article data.');
  };

  const getStatusBadge = (statusName: string) => {
    const statusLower = (statusName || '').toLowerCase();
    let variant: 'default' | 'secondary' | 'outline' = 'secondary';
    if (statusLower === 'published') variant = 'default';
    else if (statusLower.includes('pending')) variant = 'outline';

    return (
      <Badge variant={variant}>
        {statusName}
      </Badge>
    );
  };

  const articlesByStatus = {
    all: filteredArticles,
    published: filteredArticles.filter((a: any) => a.statusName === 'Published'),
    pending: filteredArticles.filter((a: any) => a.statusName === 'Pending Review'),
    draft: filteredArticles.filter((a: any) => a.statusName === 'Draft'),
  };

  const ArticleTable = ({ articles }: { articles: any[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
              No articles found
            </TableCell>
          </TableRow>
        ) : (
          articles.map((article: any) => (
            <TableRow key={article.articleId}>
              <TableCell>
                <div>
                  <p>{article.title}</p>
                  <div className="flex gap-1 mt-1">
                    {article.tags?.slice(0, 2).map((tag: any) => (
                      <Badge key={tag.tagId} variant="outline" className="text-xs">
                        {tag.tagName}
                      </Badge>
                    ))}
                    {article.tags?.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(article.statusName)}</TableCell>
              <TableCell>v{article.versionNumber || 1}</TableCell>
              <TableCell>{article.viewCount}</TableCell>
              <TableCell>
                {new Date(article.updatedAt || article.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/articles/${article.articleId}`)}
                  >
                    <Eye className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/articles/${article.articleId}/edit`)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(article.articleId, article.title)}
                  >
                    <Trash2 className="size-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl">Article Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage all knowledge base articles
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImport}>
              <Upload className="size-4 mr-2" />
              Import Articles
            </Button>
            <Button onClick={() => navigate('/articles/new')}>
              <Plus className="size-4 mr-2" />
              New Article
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{articles.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{articlesByStatus.published.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{articlesByStatus.pending.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">
                {articles.reduce((sum, a) => sum + a.viewCount, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Articles</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">
                  All ({articlesByStatus.all.length})
                </TabsTrigger>
                <TabsTrigger value="published">
                  Published ({articlesByStatus.published.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({articlesByStatus.pending.length})
                </TabsTrigger>
                <TabsTrigger value="draft">
                  Draft ({articlesByStatus.draft.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ArticleTable articles={articlesByStatus.all} />
              </TabsContent>

              <TabsContent value="published" className="mt-4">
                <ArticleTable articles={articlesByStatus.published} />
              </TabsContent>

              <TabsContent value="pending" className="mt-4">
                <ArticleTable articles={articlesByStatus.pending} />
              </TabsContent>

              <TabsContent value="draft" className="mt-4">
                <ArticleTable articles={articlesByStatus.draft} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}