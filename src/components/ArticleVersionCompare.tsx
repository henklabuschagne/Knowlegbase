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
import { ArrowLeft, GitCompare, Loader2, ArrowRight } from 'lucide-react';

export function ArticleVersionCompare() {
  const { articleId, versionId, compareVersionId } = useParams<{
    articleId: string;
    versionId: string;
    compareVersionId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { actions } = useAppStore('versions');
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !articleId || !versionId || !compareVersionId) {
      navigate('/');
      return;
    }
    loadComparison();
  }, [user, articleId, versionId, compareVersionId, navigate]);

  const loadComparison = async () => {
    if (!articleId || !versionId || !compareVersionId) return;

    setLoading(true);
    try {
      // Load both versions and compare them
      const [v1Result, v2Result] = await Promise.all([
        actions.getVersionById(parseInt(versionId)),
        actions.getVersionById(parseInt(compareVersionId)),
      ]);
      
      if (v1Result.success && v2Result.success) {
        const oldV = v2Result.data;
        const newV = v1Result.data;
        
        // Build differences list
        const diffs: { field: string; oldValue: string; newValue: string }[] = [];
        if (oldV.title !== newV.title) diffs.push({ field: 'Title', oldValue: oldV.title, newValue: newV.title });
        if (oldV.summary !== newV.summary) diffs.push({ field: 'Summary', oldValue: oldV.summary || '', newValue: newV.summary || '' });
        if (oldV.content !== newV.content) diffs.push({ field: 'Content', oldValue: oldV.content || '', newValue: newV.content || '' });
        
        setComparison({
          oldVersion: oldV,
          newVersion: newV,
          differences: diffs,
        });
      }
    } catch (err) {
      console.error('Error loading comparison:', err);
    } finally {
      setLoading(false);
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

  const renderDiff = (oldValue?: string, newValue?: string) => {
    if (!oldValue && !newValue) return null;

    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm mb-2 text-red-800">
            Version {comparison?.oldVersion.versionNumber}
          </p>
          <div className="prose prose-sm max-w-none">
            {oldValue ? (
              <div dangerouslySetInnerHTML={{ __html: oldValue }} />
            ) : (
              <p className="text-muted-foreground italic">Empty</p>
            )}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm mb-2 text-green-800">
            Version {comparison?.newVersion.versionNumber}
          </p>
          <div className="prose prose-sm max-w-none">
            {newValue ? (
              <div dangerouslySetInnerHTML={{ __html: newValue }} />
            ) : (
              <p className="text-muted-foreground italic">Empty</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(`/articles/${articleId}/history`)}>
            <ArrowLeft className="size-4 mr-2" />
            Back to History
          </Button>
          <div>
            <h1 className="text-3xl flex items-center gap-2">
              <GitCompare className="size-8" />
              Compare Versions
            </h1>
            <p className="text-muted-foreground">View differences between article versions</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && comparison && (
        <div className="space-y-6">
          {/* Version Info */}
          <Card>
            <CardHeader>
              <CardTitle>Comparing Versions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Badge className="mb-2">Version {comparison.oldVersion.versionNumber}</Badge>
                  <p className="text-sm">{comparison.oldVersion.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(comparison.oldVersion.createdAt)} by{' '}
                    {comparison.oldVersion.createdByName}
                  </p>
                </div>
                <ArrowRight className="size-8 text-muted-foreground mx-4" />
                <div className="flex-1">
                  <Badge className="mb-2 bg-green-100 text-green-800">
                    Version {comparison.newVersion.versionNumber}
                  </Badge>
                  <p className="text-sm">{comparison.newVersion.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(comparison.newVersion.createdAt)} by{' '}
                    {comparison.newVersion.createdByName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Differences Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Changes Summary</CardTitle>
              <CardDescription>
                {comparison.differences.length > 0
                  ? `${comparison.differences.length} field${
                      comparison.differences.length > 1 ? 's' : ''
                    } changed`
                  : 'No differences found'}
              </CardDescription>
            </CardHeader>
            {comparison.differences.length > 0 && (
              <CardContent>
                <div className="space-y-2">
                  {comparison.differences.map((diff, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline">{diff.field}</Badge>
                      <span className="text-sm text-muted-foreground">modified</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Detailed Comparison */}
          {comparison.differences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {comparison.differences.map((diff, index) => (
                  <div key={index}>
                    <h3 className="text-lg mb-3">{diff.field}</h3>
                    {renderDiff(diff.oldValue, diff.newValue)}
                    {index < comparison.differences.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Full Content Comparison */}
          {comparison.oldVersion.content !== comparison.newVersion.content && (
            <Card>
              <CardHeader>
                <CardTitle>Full Content Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[600px]">
                  {renderDiff(comparison.oldVersion.content, comparison.newVersion.content)}
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}