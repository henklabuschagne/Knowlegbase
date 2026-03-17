import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, User, Eye, Edit, Trash2, CheckCircle, History, FileText, Paperclip, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../hooks/useAppStore';
import { ArticleContentRenderer } from './ArticleContentRenderer';
import { ArticleFeedbackForm } from './ArticleFeedbackForm';
import { AttachmentManager } from './AttachmentManager';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';

export function ArticleView() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { actions } = useAppStore('articles');
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('content');

  const canEdit = hasRole(['Admin', 'Support']);
  const canPublish = hasRole('Admin');
  const canDelete = hasRole('Admin');

  useEffect(() => {
    if (id) {
      loadArticle();
    }
  }, [id]);

  useEffect(() => {
    // Set up intersection observer for active section highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: '-100px 0px -50% 0px' }
    );

    const sections = ['content', 'attachments', 'feedback'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [article]);

  const loadArticle = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const result = await actions.getArticleById(parseInt(id));
      if (result.success) {
        setArticle(result.data);
        // Track article view
        await actions.trackArticleView(parseInt(id));
      } else {
        setError(result.error.message || 'Failed to load article');
      }
    } catch (err: any) {
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!id || !confirm('Publish this article?')) return;
    
    try {
      const result = await actions.publishArticle(parseInt(id));
      if (result.success) {
        loadArticle(); // Reload to show updated status
      } else {
        setError(result.error.message || 'Failed to publish article');
      }
    } catch (err: any) {
      setError('Failed to publish article');
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Archive this article? This can be undone by an admin.')) return;
    
    try {
      const result = await actions.deleteArticle(parseInt(id));
      if (result.success) {
        navigate('/articles');
      } else {
        setError(result.error.message || 'Failed to delete article');
      }
    } catch (err: any) {
      setError('Failed to delete article');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600 mb-4">{error || 'Article not found'}</p>
            <Button onClick={() => navigate('/articles')}>
              <ArrowLeft className="size-4 mr-2" />
              Back to Articles
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate('/articles')}>
          <ArrowLeft className="size-4 mr-2" />
          Back to Articles
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/articles/${id}/history`)}>
            <History className="size-4 mr-2" />
            Version History
          </Button>
          {canEdit && (
            <Button variant="outline" onClick={() => navigate(`/articles/${id}/edit`)}>
              <Edit className="size-4 mr-2" />
              Edit
            </Button>
          )}
          {canPublish && !article.isPublished && (
            <Button onClick={handlePublish}>
              <CheckCircle className="size-4 mr-2" />
              Publish
            </Button>
          )}
          {canDelete && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="size-4 mr-2" />
              Archive
            </Button>
          )}
        </div>
      </div>

      {/* Article */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 mb-4">
            <CardTitle className="text-3xl">{article.title}</CardTitle>
            <Badge className={getStatusColor(article.statusName)}>
              {article.statusName}
            </Badge>
          </div>

          {article.summary && (
            <p className="text-lg text-muted-foreground">{article.summary}</p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
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
            <span>v{article.versionNumber}</span>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {article.tags.map((tag) => (
                <Badge
                  key={tag.tagId}
                  variant="secondary"
                  style={{
                    backgroundColor: tag.colorCode ? `${tag.colorCode}20` : undefined,
                    borderColor: tag.colorCode || undefined,
                  }}
                >
                  {tag.tagName}
                </Badge>
              ))}
            </div>
          )}

          {/* Section Navigation */}
          <div className="sticky top-0 z-10 bg-white border-t border-b mt-6 -mx-6 px-6 py-3">
            <div className="flex gap-1">
              <Button
                variant={activeSection === 'content' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => scrollToSection('content')}
                className="gap-2"
              >
                <FileText className="size-4" />
                Article
              </Button>
              <Button
                variant={activeSection === 'attachments' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => scrollToSection('attachments')}
                className="gap-2"
              >
                <Paperclip className="size-4" />
                Documents
              </Button>
              <Button
                variant={activeSection === 'feedback' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => scrollToSection('feedback')}
                className="gap-2"
              >
                <Star className="size-4" />
                Rate Article
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Content */}
          <div id="content" className="scroll-mt-24">
            {article.content ? (
              <div className="prose prose-slate max-w-none">
                <ArticleContentRenderer content={article.content} />
              </div>
            ) : (
              <p className="text-muted-foreground italic">No content available</p>
            )}

            {/* Footer Info */}
            <div className="mt-8 pt-4 border-t text-sm text-muted-foreground space-y-1">
              {article.updatedByName && (
                <p>Last updated by {article.updatedByName} on {formatDate(article.updatedAt)}</p>
              )}
              {article.publishedAt && (
                <p>Published on {formatDate(article.publishedAt)}</p>
              )}
              {article.approvedByName && (
                <p>Approved by {article.approvedByName}</p>
              )}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Attachments */}
          <div id="attachments" className="scroll-mt-24">
            {id && <AttachmentManager articleId={parseInt(id)} canEdit={canEdit} />}
          </div>

          <Separator className="my-8" />

          {/* Feedback Form */}
          <div id="feedback" className="scroll-mt-24">
            {id && <ArticleFeedbackForm articleId={parseInt(id)} />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}