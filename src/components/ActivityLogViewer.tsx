import { useState, useEffect } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Loader2, ChevronLeft, ChevronRight, Eye, Filter } from 'lucide-react';

export function ActivityLogViewer() {
  const { actions } = useAppStore('activity');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(50);

  // Filters
  const [entityType, setEntityType] = useState<string>('__all__');
  const [actionFilter, setAction] = useState<string>('__all__');
  const [userId, setUserId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Selected log for details
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [pageNumber]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const result = await actions.getActivityLogs({
        entityType: entityType === '__all__' ? undefined : entityType || undefined,
        userId: userId ? parseInt(userId) : undefined,
        action: actionFilter === '__all__' ? undefined : actionFilter || undefined,
        limit: pageSize,
      });
      if (result.success) {
        setLogs(result.data);
      }
    } catch (err) {
      console.error('Error loading activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setPageNumber(1);
    loadLogs();
  };

  const handleClearFilters = () => {
    setEntityType('__all__');
    setAction('__all__');
    setUserId('');
    setStartDate('');
    setEndDate('');
    setPageNumber(1);
    setTimeout(() => loadLogs(), 0);
  };

  const handleViewDetails = (log: any) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatJson = (jsonString?: string) => {
    if (!jsonString) return null;
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch {
      return jsonString;
    }
  };

  const getEntityIcon = (type: string) => {
    const icons: Record<string, string> = {
      'Article': '📄', 'User': '👤', 'Tag': '🏷️',
      'ArticleRequest': '📝', 'Feedback': '💬',
      'Attachment': '📎', 'Approval': '✅',
    };
    return icons[type] || '📋';
  };

  const getActionIcon = (action: string) => {
    const icons: Record<string, string> = {
      'Created': '➕', 'Updated': '✏️', 'Deleted': '🗑️',
      'Published': '🚀', 'Approved': '✅', 'Rejected': '❌',
      'Viewed': '👁️', 'Downloaded': '⬇️',
    };
    return icons[action] || '📌';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Activity Logs</h1>
          <p className="text-muted-foreground">Track all system activities and changes</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="size-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="entityType">Entity Type</Label>
              <Select value={entityType} onValueChange={setEntityType}>
                <SelectTrigger id="entityType">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All types</SelectItem>
                  <SelectItem value="Article">Article</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Tag">Tag</SelectItem>
                  <SelectItem value="ArticleRequest">Article Request</SelectItem>
                  <SelectItem value="Feedback">Feedback</SelectItem>
                  <SelectItem value="Attachment">Attachment</SelectItem>
                  <SelectItem value="Approval">Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="action">Action</Label>
              <Select value={actionFilter} onValueChange={setAction}>
                <SelectTrigger id="action">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All actions</SelectItem>
                  <SelectItem value="Created">Created</SelectItem>
                  <SelectItem value="Updated">Updated</SelectItem>
                  <SelectItem value="Deleted">Deleted</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Viewed">Viewed</SelectItem>
                  <SelectItem value="Downloaded">Downloaded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Filter by user"
              />
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleFilter}>Apply Filters</Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log Entries</CardTitle>
          <CardDescription>
            {`Showing ${logs.length} activities`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-8 animate-spin" />
            </div>
          ) : !logs || logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activity logs found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log: any, index: number) => (
                    <TableRow key={log.activityId || index}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(log.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{log.userName || 'System'}</div>
                          {log.userEmail && (
                            <div className="text-xs text-muted-foreground">
                              {log.userEmail}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{getEntityIcon(log.entityType)}</span>
                          <div>
                            <div>{log.entityType}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {log.entityId}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <span>{getActionIcon(log.action)}</span>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.description || '-'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {log.ipAddress || '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(log)}
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {logs.length} entries
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    disabled={pageNumber === 1}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageNumber((p) => p + 1)}
                    disabled={logs.length < pageSize}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
            <DialogDescription>
              Detailed information about this activity
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Activity ID</Label>
                  <p>{selectedLog.activityId}</p>
                </div>
                <div>
                  <Label>Timestamp</Label>
                  <p>{formatDate(selectedLog.createdAt)}</p>
                </div>
                <div>
                  <Label>User</Label>
                  <p>{selectedLog.userName || 'System'}</p>
                  {selectedLog.userEmail && (
                    <p className="text-sm text-muted-foreground">{selectedLog.userEmail}</p>
                  )}
                </div>
                <div>
                  <Label>Entity</Label>
                  <p>{selectedLog.entityType} (ID: {selectedLog.entityId})</p>
                </div>
                <div>
                  <Label>Action</Label>
                  <p>{selectedLog.action}</p>
                </div>
                <div>
                  <Label>IP Address</Label>
                  <p>{selectedLog.ipAddress || 'N/A'}</p>
                </div>
              </div>

              {selectedLog.description && (
                <div>
                  <Label>Description</Label>
                  <p className="mt-1">{selectedLog.description}</p>
                </div>
              )}

              {selectedLog.userAgent && (
                <div>
                  <Label>User Agent</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedLog.userAgent}</p>
                </div>
              )}

              {selectedLog.oldValue && (
                <div>
                  <Label>Old Value</Label>
                  <pre className="mt-1 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                    {formatJson(selectedLog.oldValue)}
                  </pre>
                </div>
              )}

              {selectedLog.newValue && (
                <div>
                  <Label>New Value</Label>
                  <pre className="mt-1 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                    {formatJson(selectedLog.newValue)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}