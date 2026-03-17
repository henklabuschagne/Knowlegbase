import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
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
  Loader2, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  User, 
  Clock, 
  AlertCircle,
  UserPlus,
  FileText,
  TrendingUp,
  ClipboardList
} from 'lucide-react';

export function RequestManagement() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { users, actions } = useAppStore('requests', 'users');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [dialogType, setDialogType] = useState<'assign' | 'reject' | 'complete' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [assignedUserId, setAssignedUserId] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [articleId, setArticleId] = useState('');
  
  // Filter state
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!user || !hasRole(['Admin', 'Support'])) {
      navigate('/dashboard');
      return;
    }
    loadRequests();
    actions.getUsers(); // Load users for assignment dropdown
  }, [user, navigate]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const result = await actions.getRequests({});
      if (result.success) {
        setRequests(result.data);
      }
    } catch (err) {
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (request: any, type: 'assign' | 'reject' | 'complete') => {
    setSelectedRequest(request);
    setDialogType(type);
    setError('');
    
    // Reset form fields
    setAssignedUserId(request.assignedToUserId?.toString() || '');
    setRejectionReason('');
    setArticleId('');
  };

  const handleCloseDialog = () => {
    setSelectedRequest(null);
    setDialogType(null);
    setError('');
    setAssignedUserId('');
    setRejectionReason('');
    setArticleId('');
  };

  const handleAssign = async () => {
    if (!selectedRequest) return;

    if (!assignedUserId) {
      setError('Please select a user to assign');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const result = await actions.updateRequest(selectedRequest.requestId, {
        assignedToUserId: parseInt(assignedUserId),
        statusId: 2, // In Progress
      });
      if (result.success) {
        handleCloseDialog();
        loadRequests();
      } else {
        setError(result.error.message || 'Failed to assign request');
      }
    } catch (err: any) {
      setError('Failed to assign request');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    if (!rejectionReason.trim()) {
      setError('Rejection reason is required');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const result = await actions.updateRequest(selectedRequest.requestId, {
        statusId: 4, // Rejected
        rejectionReason,
      });
      if (result.success) {
        handleCloseDialog();
        loadRequests();
      } else {
        setError(result.error.message || 'Failed to reject request');
      }
    } catch (err: any) {
      setError('Failed to reject request');
    } finally {
      setProcessing(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedRequest) return;

    if (!articleId.trim()) {
      setError('Article ID is required');
      return;
    }

    const articleIdNum = parseInt(articleId);
    if (isNaN(articleIdNum) || articleIdNum <= 0) {
      setError('Please enter a valid Article ID');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const result = await actions.updateRequest(selectedRequest.requestId, {
        statusId: 5, // Completed
        articleId: articleIdNum,
      });
      if (result.success) {
        handleCloseDialog();
        loadRequests();
      } else {
        setError(result.error.message || 'Failed to complete request');
      }
    } catch (err: any) {
      setError('Failed to complete request');
    } finally {
      setProcessing(false);
    }
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 8) {
      return <Badge className="bg-red-100 text-red-800">High Priority</Badge>;
    } else if (priority >= 5) {
      return <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Low Priority</Badge>;
    }
  };

  // Compute supportUsers from store users
  const supportUsers = (users || []).filter((u: any) => 
    u.roleName === 'Support' || u.roleName === 'Admin'
  );

  const getStatusBadge = (statusName: string) => {
    const statusColors: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={statusColors[statusName] || 'bg-gray-100 text-gray-800'}>
        {statusName}
      </Badge>
    );
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

  // Filter requests by status
  const filterRequests = (status: string) => {
    switch (status) {
      case 'pending':
        return requests.filter(r => r.statusName === 'Pending');
      case 'in-progress':
        return requests.filter(r => r.statusName === 'In Progress');
      case 'completed':
        return requests.filter(r => r.statusName === 'Completed');
      case 'rejected':
        return requests.filter(r => r.statusName === 'Rejected');
      default:
        return requests;
    }
  };

  const filteredRequests = filterRequests(activeTab);

  // Calculate statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.statusName === 'Pending').length,
    inProgress: requests.filter(r => r.statusName === 'In Progress').length,
    completed: requests.filter(r => r.statusName === 'Completed').length,
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
            <h1 className="text-3xl">Request Management</h1>
            <p className="text-muted-foreground">
              Manage article requests from users
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <ClipboardList className="size-4" />
              Total Requests
            </CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <AlertCircle className="size-4 text-yellow-600" />
              Pending
            </CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="size-4 text-blue-600" />
              In Progress
            </CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="size-4 text-green-600" />
              Completed
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs for filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({stats.inProgress})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredRequests.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="size-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No requests found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {activeTab === 'all' 
                    ? 'Users have not submitted any article requests yet'
                    : `No ${activeTab.replace('-', ' ')} requests`}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Requests List */}
          {!loading && filteredRequests.length > 0 && (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.requestId} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{request.title}</CardTitle>
                        {request.description && (
                          <CardDescription className="mt-2 whitespace-pre-wrap">
                            {request.description}
                          </CardDescription>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {getStatusBadge(request.statusName)}
                          {getPriorityBadge(request.priority)}
                          {request.assignedToName && (
                            <Badge className="bg-purple-100 text-purple-800">
                              Assigned to: {request.assignedToName}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
                      <div className="flex items-center gap-1">
                        <User className="size-4" />
                        Requested by: {request.requestedByName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        {formatDate(request.createdAt)}
                      </div>
                    </div>
                    
                    {/* Show rejection reason if rejected */}
                    {request.statusName === 'Rejected' && request.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                        <p className="text-sm text-red-700 mt-1">{request.rejectionReason}</p>
                      </div>
                    )}

                    {/* Show linked article if completed */}
                    {request.statusName === 'Completed' && request.articleId && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-800">
                          Article Created: #{request.articleId}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-green-700 p-0 h-auto"
                          onClick={() => navigate(`/articles/${request.articleId}`)}
                        >
                          View Article →
                        </Button>
                      </div>
                    )}

                    {/* Action Buttons (only for pending/in-progress) */}
                    {(request.statusName === 'Pending' || request.statusName === 'In Progress') && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => handleOpenDialog(request, 'assign')}
                        >
                          <UserPlus className="size-4 mr-2" />
                          {request.assignedToUserId ? 'Reassign' : 'Assign'}
                        </Button>
                        <Button
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleOpenDialog(request, 'complete')}
                        >
                          <CheckCircle className="size-4 mr-2" />
                          Mark Complete
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleOpenDialog(request, 'reject')}
                        >
                          <XCircle className="size-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Assign Dialog */}
      <Dialog open={dialogType === 'assign'} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Request</DialogTitle>
            <DialogDescription>
              Assign "{selectedRequest?.title}" to a team member
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="assign-user">Assign To *</Label>
              <Select value={assignedUserId} onValueChange={setAssignedUserId}>
                <SelectTrigger id="assign-user">
                  <SelectValue placeholder="Select a user..." />
                </SelectTrigger>
                <SelectContent>
                  {supportUsers.map((u) => (
                    <SelectItem key={u.userId} value={u.userId.toString()}>
                      {u.fullName} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                The assigned user will be notified
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserPlus className="size-4 mr-2" />
                  Assign
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={dialogType === 'reject'} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting "{selectedRequest?.title}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="reject-reason">Rejection Reason *</Label>
              <Textarea
                id="reject-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this request cannot be fulfilled..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This message will be visible to the requester
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

      {/* Complete Dialog */}
      <Dialog open={dialogType === 'complete'} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Request</DialogTitle>
            <DialogDescription>
              Mark "{selectedRequest?.title}" as complete by linking to the created article
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="article-id">Article ID *</Label>
              <Input
                id="article-id"
                type="number"
                value={articleId}
                onChange={(e) => setArticleId(e.target.value)}
                placeholder="Enter the ID of the created article..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                The requester will be notified and can access the article
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Create the article first, then come back here to link it.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700" 
              onClick={handleComplete} 
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle className="size-4 mr-2" />
                  Mark Complete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}