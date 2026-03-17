import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../hooks/useAppStore';
import { MarkdownEditor } from './MarkdownEditor';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  ArrowLeft,
  Save,
  Tag as TagIcon,
  Loader2,
  Send,
  X,
  Eye,
} from 'lucide-react';

export function ArticleEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, hasRole } = useAuth();
  const { tags: allTags, actions } = useAppStore('articles', 'tags', 'approvals');
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    isInternal: false,
  });

  useEffect(() => {
    if (!user || !hasRole(['Admin', 'Support'])) {
      navigate('/dashboard');
      return;
    }
    if (id) {
      loadArticle(parseInt(id));
    }
  }, [user, id, navigate]);

  const loadArticle = async (articleId: number) => {
    setLoading(true);
    try {
      const result = await actions.getArticleById(articleId);
      if (result.success) {
        const article = result.data;
        setFormData({
          title: article.title,
          summary: article.summary || '',
          content: article.content,
          isInternal: article.isInternal,
        });
        setSelectedTags(article.tags?.map((t: any) => t.tagId) || []);
      } else {
        setError('Failed to load article');
      }
    } catch (err) {
      console.error('Error loading article:', err);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (id) {
        const result = await actions.updateArticle(parseInt(id), {
          title: formData.title,
          summary: formData.summary,
          content: formData.content,
          isInternal: formData.isInternal,
          tagIds: selectedTags,
        });
        if (!result.success) {
          setError(result.error.message || 'Failed to save article');
          setSaving(false);
          return;
        }
      } else {
        const result = await actions.createArticle({
          title: formData.title,
          summary: formData.summary,
          content: formData.content,
          isInternal: formData.isInternal,
          tagIds: selectedTags,
        });
        if (result.success) {
          navigate(`/articles/${result.data.articleId}`);
          return;
        } else {
          setError(result.error.message || 'Failed to create article');
          setSaving(false);
          return;
        }
      }
      
      navigate(`/articles/${id}`);
    } catch (err: any) {
      setError('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!id) {
      setError('Please save the article as a draft first');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // First save the current changes
      const updateResult = await actions.updateArticle(parseInt(id), {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        isInternal: formData.isInternal,
        tagIds: selectedTags,
      });

      if (!updateResult.success) {
        setError(updateResult.error.message || 'Failed to save article');
        setSaving(false);
        return;
      }

      // Submit for approval
      const approvalResult = await actions.submitForApproval(parseInt(id));
      if (approvalResult.success) {
        setSubmitDialogOpen(false);
        navigate('/dashboard');
      } else {
        setError(approvalResult.error.message || 'Failed to submit for approval');
      }
    } catch (err: any) {
      setError('Failed to submit for approval');
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const getTagsByType = () => {
    return allTags.reduce((acc, tag) => {
      if (!acc[tag.tagTypeName]) {
        acc[tag.tagTypeName] = [];
      }
      acc[tag.tagTypeName].push(tag);
      return acc;
    }, {} as Record<string, typeof allTags[number][]>);
  };

  if (!user || !hasRole(['Admin', 'Support'])) return null;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl">{id ? 'Edit Article' : 'New Article'}</h1>
            <p className="text-muted-foreground">
              {id ? 'Update article content' : 'Create a new knowledge base article'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/articles/${id || ''}`)} disabled={!id}>
            <Eye className="size-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>
          <Button onClick={() => setSubmitDialogOpen(true)} disabled={saving}>
            <Send className="size-4 mr-2" />
            Submit for Approval
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}

      {/* Editor Form */}
      {!loading && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter article title"
                    maxLength={500}
                    className="text-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Brief summary of the article"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Content *</Label>
                  <MarkdownEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Write your article content here..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="internal">Internal Article</Label>
                    <p className="text-xs text-muted-foreground">
                      Only visible to internal users
                    </p>
                  </div>
                  <Switch
                    id="internal"
                    checked={formData.isInternal}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isInternal: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TagIcon className="size-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(getTagsByType()).map(([typeName, tags]) => (
                  <div key={typeName}>
                    <p className="text-sm mb-2">{typeName}</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag.tagId}
                          variant={selectedTags.includes(tag.tagId) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          style={{
                            backgroundColor:
                              selectedTags.includes(tag.tagId) && tag.colorCode
                                ? tag.colorCode
                                : undefined,
                            borderColor: tag.colorCode || undefined,
                          }}
                          onClick={() => toggleTag(tag.tagId)}
                        >
                          {tag.tagName}
                          {selectedTags.includes(tag.tagId) && (
                            <X className="size-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                    <Separator className="mt-3" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold">1. Save Draft</p>
                  <p className="text-muted-foreground">
                    Save your work without submitting
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold">2. Submit for Review</p>
                  <p className="text-muted-foreground">
                    Send to support team for review
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold">3. Final Approval</p>
                  <p className="text-muted-foreground">
                    Admin approves and publishes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Submit Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit for Approval</DialogTitle>
            <DialogDescription>
              This article will be sent to the support team for review
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Before submitting, please ensure:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
              <li>All content is accurate and complete</li>
              <li>Proper tags have been applied</li>
              <li>The article follows content guidelines</li>
              <li>All links and images are working</li>
            </ul>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitForApproval} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}