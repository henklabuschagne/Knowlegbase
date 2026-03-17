import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from './ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  Loader2, 
  ArrowLeft, 
  Search,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  CheckCircle,
  XCircle,
  Trash2,
  FileText,
  TrendingUp,
  Calendar,
  User as UserIcon,
  Eye
} from 'lucide-react';

export function FeedbackManagement() {
  const navigate = useNavigate();
  const { user: currentUser, hasRole } = useAuth();
  const { actions } = useAppStore('feedback');
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Dialog states
  const [dialogType, setDialogType] = useState<'view' | 'resolve' | 'delete' | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
  
  // Form states
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    if (!currentUser || !hasRole(['Admin', 'Support'])) {
      navigate('/dashboard');
      return;
    }
    loadFeedbacks();
  }, [currentUser, navigate]);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const result = await actions.getAllFeedback({});
      if (result.success) {
        setFeedbacks(result.data);
        setFilteredFeedbacks(result.data);
      } else {
        setError('Failed to load feedback');
      }
    } catch (err) {
      console.error('Error loading feedbacks:', err);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredFeedbacks(feedbacks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = feedbacks.filter(
      (f) =>
        f.userName.toLowerCase().includes(query) ||
        f.articleTitle?.toLowerCase().includes(query) ||
        f.feedbackText?.toLowerCase().includes(query) ||
        f.category?.toLowerCase().includes(query)
    );
    setFilteredFeedbacks(filtered);
  };

  const handleOpenDialog = (type: 'view' | 'resolve' | 'delete', feedback: any) => {
    setSelectedFeedback(feedback);
    setDialogType(type);
    setError('');
    setResolutionNotes(feedback.resolutionNotes || '');
  };

  const handleCloseDialog = () => {
    setDialogType(null);
    setSelectedFeedback(null);
    setError('');
    setResolutionNotes('');
  };

  const handleResolve = async () => {
    if (!selectedFeedback) return;

    setProcessing(true);
    setError('');

    try {
      const result = await actions.resolveFeedback(selectedFeedback.feedbackId, {
        resolutionNotes: resolutionNotes.trim() || undefined,
      });
      if (result.success) {
        handleCloseDialog();
        loadFeedbacks();
      } else {
        setError(result.error.message || 'Failed to resolve feedback');
      }
    } catch (err: any) {
      setError('Failed to resolve feedback');
    } finally {
      setProcessing(false);
    }
  };

  const handleUnresolve = async (feedbackId: number) => {
    try {
      const result = await actions.unresolveFeedback(feedbackId);
      if (result.success) {
        loadFeedbacks();
      }
    } catch (err: any) {
      console.error('Failed to unresolve feedback:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedFeedback) return;

    setProcessing(true);
    setError('');

    try {
      const result = await actions.deleteFeedback(selectedFeedback.feedbackId);
      if (result.success) {
        handleCloseDialog();
        loadFeedbacks();
      } else {
        setError(result.error.message || 'Failed to delete feedback');
      }
    } catch (err: any) {
      setError('Failed to delete feedback');
    } finally {
      setProcessing(false);
    }
  };

  const filterFeedbacks = (filter: string) => {
    let filtered = feedbacks;
    
    switch (filter) {
      case 'unresolved':
        filtered = feedbacks.filter(f => !f.isResolved);
        break;
      case 'resolved':
        filtered = feedbacks.filter(f => f.isResolved);
        break;
      case 'high-rating':
        filtered = feedbacks.filter(f => f.rating >= 4);
        break;
      case 'low-rating':
        filtered = feedbacks.filter(f => f.rating <= 2);
        break;
      case 'helpful':
        filtered = feedbacks.filter(f => f.isHelpful === true);
        break;
      case 'not-helpful':
        filtered = feedbacks.filter(f => f.isHelpful === false);
        break;
      case 'with-comments':
        filtered = feedbacks.filter(f => f.feedbackText && f.feedbackText.trim().length > 0);
        break;
    }
    
    return filtered;
  };

  const displayFeedbacks = activeTab === 'all' ? filteredFeedbacks : filterFeedbacks(activeTab);

  const stats = {
    total: feedbacks.length,
    unresolved: feedbacks.filter(f => !f.isResolved).length,
    resolved: feedbacks.filter(f => f.isResolved).length,
    highRating: feedbacks.filter(f => f.rating >= 4).length,
    lowRating: feedbacks.filter(f => f.rating <= 2).length,
    averageRating: feedbacks.length > 0 
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : '0.0',
    helpful: feedbacks.filter(f => f.isHelpful === true).length,
    notHelpful: feedbacks.filter(f => f.isHelpful === false).length,
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

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`size-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating <= 2) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getCategoryBadgeColor = (category?: string) => {
    const colors: Record<string, string> = {
      'Accuracy': 'bg-blue-100 text-blue-800',
      'Clarity': 'bg-purple-100 text-purple-800',
      'Completeness': 'bg-brand-primary-light text-brand-primary',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[category || ''] || 'bg-gray-100 text-gray-800';
  };

  if (!currentUser || !hasRole(['Admin', 'Support'])) return null;

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
            <h1 className="text-3xl">Feedback Management</h1>
            <p className="text-muted-foreground">
              Review and manage user feedback on articles
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <MessageSquare className="size-4" />
              Total Feedback
            </CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Star className="size-4 text-yellow-600" />
              Average Rating
            </CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.averageRating}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <XCircle className="size-4 text-red-600" />
              Unresolved
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.unresolved}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="size-4 text-green-600" />
              Resolved
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.resolved}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="size-4 text-green-600" />
              High Ratings (4-5★)
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.highRating}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="size-4 text-red-600 rotate-180" />
              Low Ratings (1-2★)
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.lowRating}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <ThumbsUp className="size-4 text-green-600" />
              Helpful
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.helpful}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <ThumbsDown className="size-4 text-red-600" />
              Not Helpful
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.notHelpful}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search by user, article, comment, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="text-base"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="size-4 mr-2" />
              Search
            </Button>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setFilteredFeedbacks(feedbacks);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-8 w-full">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="unresolved">Unresolved ({stats.unresolved})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
          <TabsTrigger value="high-rating">High (4-5★)</TabsTrigger>
          <TabsTrigger value="low-rating">Low (1-2★)</TabsTrigger>
          <TabsTrigger value="helpful">Helpful</TabsTrigger>
          <TabsTrigger value="not-helpful">Not Helpful</TabsTrigger>
          <TabsTrigger value="with-comments">With Comments</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error */}
          {error && !dialogType && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && displayFeedbacks.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="size-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No feedback found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchQuery ? 'Try adjusting your search' : 'No feedback matches the selected filter'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Feedback Table */}
          {!loading && displayFeedbacks.length > 0 && (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Helpful</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayFeedbacks.map((feedback) => (
                    <TableRow key={feedback.feedbackId}>
                      <TableCell className="max-w-[200px]">
                        <button
                          onClick={() => navigate(`/articles/${feedback.articleId}`)}
                          className="text-primary hover:underline text-left"
                        >
                          {feedback.articleTitle || `Article #${feedback.articleId}`}
                        </button>
                        {feedback.feedbackText && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {feedback.feedbackText}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>{feedback.userName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getRatingStars(feedback.rating)}
                          <Badge className={getRatingBadgeColor(feedback.rating)}>
                            {feedback.rating}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {feedback.isHelpful === true && (
                          <Badge className="bg-green-100 text-green-800">
                            <ThumbsUp className="size-3 mr-1" />
                            Yes
                          </Badge>
                        )}
                        {feedback.isHelpful === false && (
                          <Badge className="bg-red-100 text-red-800">
                            <ThumbsDown className="size-3 mr-1" />
                            No
                          </Badge>
                        )}
                        {feedback.isHelpful === undefined && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {feedback.category ? (
                          <Badge className={getCategoryBadgeColor(feedback.category)}>
                            {feedback.category}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={feedback.isResolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {feedback.isResolved ? 'Resolved' : 'Unresolved'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(feedback.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog('view', feedback)}
                          >
                            <Eye className="size-4" />
                          </Button>
                          {!feedback.isResolved ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog('resolve', feedback)}
                            >
                              <CheckCircle className="size-4 text-green-600" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnresolve(feedback.feedbackId)}
                            >
                              <XCircle className="size-4 text-yellow-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog('delete', feedback)}
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* View Feedback Dialog */}
      <Dialog open={dialogType === 'view'} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              Detailed view of feedback from {selectedFeedback?.userName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Article */}
            <div>
              <Label>Article</Label>
              <button
                onClick={() => {
                  handleCloseDialog();
                  navigate(`/articles/${selectedFeedback?.articleId}`);
                }}
                className="block mt-1 text-primary hover:underline"
              >
                {selectedFeedback?.articleTitle || `Article #${selectedFeedback?.articleId}`}
              </button>
            </div>

            {/* User & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Submitted By</Label>
                <p className="mt-1">{selectedFeedback?.userName}</p>
              </div>
              <div>
                <Label>Submitted On</Label>
                <p className="mt-1">{selectedFeedback?.createdAt && formatDate(selectedFeedback.createdAt)}</p>
              </div>
            </div>

            {/* Rating & Helpful */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Rating</Label>
                <div className="flex items-center gap-2 mt-1">
                  {selectedFeedback && getRatingStars(selectedFeedback.rating)}
                  <span className="text-sm">({selectedFeedback?.rating}/5)</span>
                </div>
              </div>
              <div>
                <Label>Was Helpful?</Label>
                <div className="mt-1">
                  {selectedFeedback?.isHelpful === true && (
                    <Badge className="bg-green-100 text-green-800">
                      <ThumbsUp className="size-3 mr-1" />
                      Yes
                    </Badge>
                  )}
                  {selectedFeedback?.isHelpful === false && (
                    <Badge className="bg-red-100 text-red-800">
                      <ThumbsDown className="size-3 mr-1" />
                      No
                    </Badge>
                  )}
                  {selectedFeedback?.isHelpful === undefined && (
                    <span className="text-muted-foreground">Not specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Category */}
            {selectedFeedback?.category && (
              <div>
                <Label>Category</Label>
                <div className="mt-1">
                  <Badge className={getCategoryBadgeColor(selectedFeedback.category)}>
                    {selectedFeedback.category}
                  </Badge>
                </div>
              </div>
            )}

            {/* Feedback Text */}
            {selectedFeedback?.feedbackText && (
              <div>
                <Label>Comments</Label>
                <div className="mt-1 p-3 bg-muted rounded-lg whitespace-pre-wrap">
                  {selectedFeedback.feedbackText}
                </div>
              </div>
            )}

            {/* Resolution Status */}
            <div>
              <Label>Status</Label>
              <div className="mt-1">
                <Badge className={selectedFeedback?.isResolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {selectedFeedback?.isResolved ? 'Resolved' : 'Unresolved'}
                </Badge>
              </div>
            </div>

            {/* Resolution Details */}
            {selectedFeedback?.isResolved && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Resolved By</Label>
                    <p className="mt-1">{selectedFeedback.resolvedByName || 'Unknown'}</p>
                  </div>
                  <div>
                    <Label>Resolved On</Label>
                    <p className="mt-1">{selectedFeedback.resolvedAt && formatDate(selectedFeedback.resolvedAt)}</p>
                  </div>
                </div>
                {selectedFeedback.resolutionNotes && (
                  <div>
                    <Label>Resolution Notes</Label>
                    <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-lg whitespace-pre-wrap">
                      {selectedFeedback.resolutionNotes}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Close
            </Button>
            {!selectedFeedback?.isResolved && (
              <Button onClick={() => {
                handleCloseDialog();
                setTimeout(() => handleOpenDialog('resolve', selectedFeedback!), 100);
              }}>
                <CheckCircle className="size-4 mr-2" />
                Resolve
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Feedback Dialog */}
      <Dialog open={dialogType === 'resolve'} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Feedback</DialogTitle>
            <DialogDescription>
              Mark this feedback as resolved and add resolution notes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Feedback Summary */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {selectedFeedback && getRatingStars(selectedFeedback.rating)}
                <span className="text-sm">by {selectedFeedback?.userName}</span>
              </div>
              {selectedFeedback?.feedbackText && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {selectedFeedback.feedbackText}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="resolution-notes">Resolution Notes (Optional)</Label>
              <Textarea
                id="resolution-notes"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Add any notes about how this feedback was addressed..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                These notes will be visible to other admins/support staff
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleResolve} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Resolving...
                </>
              ) : (
                <>
                  <CheckCircle className="size-4 mr-2" />
                  Mark as Resolved
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Feedback Dialog */}
      <Dialog open={dialogType === 'delete'} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Feedback</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this feedback?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action cannot be undone. The feedback will be permanently deleted.
              </p>
              <div className="mt-3 p-2 bg-white rounded">
                <div className="flex items-center gap-2 mb-1">
                  {selectedFeedback && getRatingStars(selectedFeedback.rating)}
                  <span className="text-sm">by {selectedFeedback?.userName}</span>
                </div>
                {selectedFeedback?.feedbackText && (
                  <p className="text-sm text-muted-foreground">
                    "{selectedFeedback.feedbackText.substring(0, 100)}..."
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4 mr-2" />
                  Delete Feedback
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}