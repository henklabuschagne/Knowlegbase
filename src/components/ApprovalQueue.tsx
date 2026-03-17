import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Loader2, ArrowLeft, CheckCircle, XCircle, Eye, User, Clock } from 'lucide-react';

export function ApprovalQueue() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { actions } = useAppStore('approvals');
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<any | null>(null);
  const [dialogType, setDialogType] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !hasRole(['Admin', 'Support'])) {
      navigate('/dashboard');
      return;
    }
    loadApprovals();
  }, [user, navigate]);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const result = await actions.getPendingApprovals();
      if (result.success) {
        setApprovals(result.data);
      }
    } catch (err) {
      console.error('Error loading approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (approval: any, type: 'approve' | 'reject') => {
    setSelectedApproval(approval);
    setDialogType(type);
    setComments('');
    setError('');
  };

  const handleCloseDialog = () => {
    setSelectedApproval(null);
    setDialogType(null);
    setComments('');
    setError('');
  };

  const handleApprove = async () => {
    if (!selectedApproval) return;

    setProcessing(true);
    setError('');

    try {
      const result = await actions.approveArticle(selectedApproval.approvalId, comments);
      if (result.success) {
        handleCloseDialog();
        loadApprovals();
      } else {
        setError(result.error.message || 'Failed to approve article');
      }
    } catch (err: any) {
      setError('Failed to approve article');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApproval) return;

    if (!comments.trim()) {
      setError('Comments are required when rejecting an article');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const result = await actions.rejectApproval(selectedApproval.approvalId, comments);
      if (result.success) {
        handleCloseDialog();
        loadApprovals();
      } else {
        setError(result.error.message || 'Failed to reject article');
      }
    } catch (err: any) {
      setError('Failed to reject article');
    } finally {
      setProcessing(false);
    }
  };

  const getApprovalLevelLabel = (level: number) => {
    switch (level) {
      case 1:
        return 'Support Review';
      case 2:
        return 'Admin Final Approval';
      default:
        return `Level ${level}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user || !hasRole(['Admin', 'Support'])) return null;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl">Approval Queue</h1>
            <p className="text-muted-foreground">
              Review and approve articles pending publication
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && approvals.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="size-12 mx-auto text-green-500 mb-4" />
            <p className="text-muted-foreground">No pending approvals</p>
            <p className="text-sm text-muted-foreground mt-2">
              All articles have been reviewed
            </p>
          </CardContent>
        </Card>
      )}

      {/* Approvals List */}
      {!loading && approvals.length > 0 && (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <Card key={approval.approvalId} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{approval.articleTitle}</CardTitle>
                    <CardDescription className="mt-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {getApprovalLevelLabel(approval.approvalLevel)}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
                  <div className="flex items-center gap-1">
                    <User className="size-4" />
                    Submitted by: {approval.submittedByName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {formatDate(approval.submittedAt)}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/articles/${approval.articleId}`)}
                  >
                    <Eye className="size-4 mr-2" />
                    Review Article
                  </Button>
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleOpenDialog(approval, 'approve')}
                  >
                    <CheckCircle className="size-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleOpenDialog(approval, 'reject')}
                  >
                    <XCircle className="size-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Approval Dialog */}
      <Dialog open={dialogType === 'approve'} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Article</DialogTitle>
            <DialogDescription>
              Approve "{selectedApproval?.articleTitle}" for publication
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="approve-comments">Comments (Optional)</Label>
              <Textarea
                id="approve-comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any comments or feedback..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="size-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={dialogType === 'reject'} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Article</DialogTitle>
            <DialogDescription>
              Provide feedback for "{selectedApproval?.articleTitle}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="reject-comments">Rejection Reason *</Label>
              <Textarea
                id="reject-comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Explain why this article needs changes..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This feedback will be sent to the author
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="size-4 mr-2" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}