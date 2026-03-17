import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { ArticleContentRenderer } from './ArticleContentRenderer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
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
  History,
  Clock,
  User,
  RotateCcw,
  Eye,
  GitCompare,
  Loader2,
  CheckCircle,
} from 'lucide-react';

export function ArticleVersionHistory() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { actions } = useAppStore('versions');
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [compareVersion, setCompareVersion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<number | null>(null);

  useEffect(() => {
    if (!user || !articleId) {
      navigate('/');
      return;
    }
    loadVersions();
  }, [user, articleId, navigate]);

  const loadVersions = async () => {
    if (!articleId) return;
    
    setLoading(true);
    try {
      const result = await actions.getArticleVersions(parseInt(articleId));
      if (result.success) {
        setVersions(result.data);
      }
    } catch (err) {
      console.error('Error loading versions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewVersion = async (versionId: number) => {
    if (!articleId) return;

    try {
      const result = await actions.getVersionById(versionId);
      if (result.success) {
        setSelectedVersion(result.data);
        setShowPreview(true);
      }
    } catch (err) {
      console.error('Error loading version:', err);
    }
  };

  const handleRestoreClick = (versionId: number) => {
    setVersionToRestore(versionId);
    setShowRestoreDialog(true);
  };

  const handleRestoreConfirm = async () => {
    if (!articleId || !versionToRestore) return;

    setRestoring(true);
    try {
      const result = await actions.restoreVersion(parseInt(articleId), versionToRestore);
      if (result.success) {
        setShowRestoreDialog(false);
        navigate(`/articles/${articleId}`);
      }
    } catch (err) {
      console.error('Error restoring version:', err);
    } finally {
      setRestoring(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(`/articles/${articleId}`)}>
            <ArrowLeft className="size-4 mr-2" />
            Back to Article
          </Button>
          <div>
            <h1 className="text-3xl flex items-center gap-2">
              <History className="size-8" />
              Version History
            </h1>
            <p className="text-muted-foreground">
              View and restore previous versions of this article
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && versions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <History className="size-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No version history available</p>
          </CardContent>
        </Card>
      )}

      {!loading && versions.length > 0 && (
        <div className="space-y-4">
          {versions.map((version, index) => (
            <Card key={version.versionId}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">
                        Version {version.versionNumber}
                      </CardTitle>
                      {index === 0 && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="size-3 mr-1" />
                          Current
                        </Badge>
                      )}
                      {version.isInternal && <Badge variant="outline">Internal</Badge>}
                    </div>
                    <CardDescription className="text-base">{version.title}</CardDescription>
                    {version.summary && (
                      <p className="text-sm text-muted-foreground mt-2">{version.summary}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="size-4" />
                    {version.createdByName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {formatRelativeTime(version.createdAt)}
                  </div>
                </div>

                {version.changeDescription && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Change notes:</strong> {version.changeDescription}
                    </p>
                  </div>
                )}

                <Separator />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewVersion(version.versionId)}
                  >
                    <Eye className="size-4 mr-2" />
                    Preview
                  </Button>

                  {hasRole(['Admin', 'Support']) && index !== 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreClick(version.versionId)}
                    >
                      <RotateCcw className="size-4 mr-2" />
                      Restore
                    </Button>
                  )}

                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/articles/${articleId}/compare/${versions[0].versionId}/${version.versionId}`)}
                    >
                      <GitCompare className="size-4 mr-2" />
                      Compare with Current
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Version {selectedVersion?.versionNumber} Preview
            </DialogTitle>
            <DialogDescription>
              {selectedVersion?.title}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              {selectedVersion?.summary && (
                <div>
                  <h3 className="text-sm mb-2 text-muted-foreground">Summary</h3>
                  <p className="text-sm">{selectedVersion.summary}</p>
                </div>
              )}
              <Separator />
              <div>
                <h3 className="text-sm mb-2 text-muted-foreground">Content</h3>
                <ArticleContentRenderer content={selectedVersion?.content || ''} />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Version</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore this version? This will create a new version
              with the content from the selected version.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRestoreDialog(false)}
              disabled={restoring}
            >
              Cancel
            </Button>
            <Button onClick={handleRestoreConfirm} disabled={restoring}>
              {restoring ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <RotateCcw className="size-4 mr-2" />
                  Restore Version
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}