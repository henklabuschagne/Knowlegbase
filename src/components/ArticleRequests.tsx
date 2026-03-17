import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, Plus, ArrowLeft, Clock, User, AlertCircle, CheckCircle } from 'lucide-react';

export function ArticleRequests() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { actions } = useAppStore('requests');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 2,
  } as { title: string; description: string; priority: number });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const result = await actions.getRequests({
        requestedByUserId: user?.userId,
        statusId: statusFilter || undefined,
      });
      if (result.success) {
        setRequests(result.data);
      }
    } catch (err) {
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({ title: '', description: '', priority: 2 });
    setError('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const result = await actions.createRequest(formData);
      if (result.success) {
        setDialogOpen(false);
        loadRequests();
      } else {
        setError(result.error.message || 'Failed to create request');
      }
    } catch (err: any) {
      setError('Failed to create request');
    } finally {
      setSaving(false);
    }
  };

  // SECURITY FIX: Removed handleAssign() - this is admin-only operation
  // Assignment should only be done in RequestManagement.tsx component

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4: return 'bg-red-100 text-red-800';
      case 3: return 'bg-orange-100 text-orange-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 1: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 4: return 'Critical';
      case 3: return 'High';
      case 2: return 'Medium';
      case 1: return 'Low';
      default: return 'Medium';
    }
  };

  const getStatusColor = (statusName: string) => {
    switch (statusName) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
            <h1 className="text-3xl">Article Requests</h1>
            <p className="text-muted-foreground">Manage article requests from users</p>
          </div>
        </div>
        {!hasRole(['Admin', 'Support']) && (
          <Button onClick={handleCreate}>
            <Plus className="size-4 mr-2" />
            New Request
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label htmlFor="statusFilter">Filter by Status:</Label>
            <Select
              value={statusFilter?.toString() || 'all'}
              onValueChange={(value) => setStatusFilter(value === 'all' ? null : parseInt(value))}
            >
              <SelectTrigger id="statusFilter" className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="1">Open</SelectItem>
                <SelectItem value="2">Under Review</SelectItem>
                <SelectItem value="3">Approved</SelectItem>
                <SelectItem value="4">Rejected</SelectItem>
                <SelectItem value="5">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}

      {/* Requests List */}
      {!loading && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="size-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No requests found</p>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => (
              <Card
                key={request.requestId}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{request.title}</CardTitle>
                      {request.description && (
                        <CardDescription className="mt-2">{request.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(request.statusName)}>
                        {request.statusName}
                      </Badge>
                      <Badge className={getPriorityColor(request.priority)}>
                        {getPriorityLabel(request.priority)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
                    <div className="flex items-center gap-1">
                      <User className="size-4" />
                      {request.requestedByName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {formatDate(request.createdAt)}
                    </div>
                    {request.assignedToName && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="size-4" />
                        Assigned to: {request.assignedToName}
                      </div>
                    )}
                  </div>
                  {request.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">
                        <strong>Rejection Reason:</strong> {request.rejectionReason}
                      </p>
                    </div>
                  )}
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New Article</DialogTitle>
            <DialogDescription>
              Submit a request for a new knowledge base article
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What article do you need?"
                maxLength={500}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details about what you need covered in the article"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority?.toString() || '2'}
                onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Low</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">High</SelectItem>
                  <SelectItem value="4">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}