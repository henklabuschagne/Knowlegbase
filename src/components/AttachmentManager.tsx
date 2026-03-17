import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Upload,
  Download,
  Trash2,
  FileText,
  Image as ImageIcon,
  Edit,
  Eye,
  Loader2,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface AttachmentManagerProps {
  articleId: number;
  canEdit?: boolean;
}

// Helper functions
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (ext: string) => {
  const extLower = (ext || '').toLowerCase().replace('.', '');
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extLower)) return '🖼️';
  if (['pdf'].includes(extLower)) return '📕';
  if (['doc', 'docx'].includes(extLower)) return '📘';
  if (['xls', 'xlsx'].includes(extLower)) return '📗';
  if (['ppt', 'pptx'].includes(extLower)) return '📙';
  if (['zip', 'rar', '7z'].includes(extLower)) return '📦';
  return '📄';
};

export function AttachmentManager({ articleId, canEdit = false }: AttachmentManagerProps) {
  const { actions } = useAppStore('attachments');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [editingAttachment, setEditingAttachment] = useState<any | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAttachments();
  }, [articleId]);

  const loadAttachments = async () => {
    setLoading(true);
    try {
      const result = await actions.getArticleAttachments(articleId);
      if (result.success) {
        setAttachments(result.data);
      }
    } catch (err) {
      console.error('Error loading attachments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setShowUploadDialog(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await actions.addAttachment({
        articleId,
        fileName: selectedFile.name,
        description,
        fileSize: selectedFile.size,
        contentType: selectedFile.type,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setTimeout(() => {
          setShowUploadDialog(false);
          setSelectedFile(null);
          setDescription('');
          setUploadProgress(0);
          loadAttachments();
        }, 500);
      } else {
        alert('Error uploading file. Please try again.');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (attachment: any) => {
    // In mock mode, just alert - in production this would download the file
    alert(`Download: ${attachment.originalFileName || attachment.fileName}`);
  };

  const handleEdit = (attachment: any) => {
    setEditingAttachment(attachment);
    setEditDescription(attachment.description || '');
    setShowEditDialog(true);
  };

  const handleUpdateAttachment = async () => {
    if (!editingAttachment) return;
    // Mock API doesn't have update attachment, so just close
    setShowEditDialog(false);
    setEditingAttachment(null);
    setEditDescription('');
  };

  const handleDelete = async (attachmentId: number) => {
    if (!confirm('Are you sure you want to delete this attachment?')) return;

    try {
      const result = await actions.deleteAttachment(attachmentId);
      if (result.success) {
        loadAttachments();
      }
    } catch (err) {
      console.error('Error deleting attachment:', err);
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

  const imageAttachments = attachments.filter((a) => a.isImage);
  const documentAttachments = attachments.filter((a) => !a.isImage);

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      {canEdit && (
        <div className="flex justify-between items-center">
          <h3 className="flex items-center gap-2">
            <FileText className="size-5" />
            Attachments ({attachments.length})
          </h3>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar"
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-4 mr-2" />
              Upload File
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-8 animate-spin" />
        </div>
      ) : attachments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No attachments yet
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Image Gallery */}
          {imageAttachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="size-5" />
                  Images ({imageAttachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imageAttachments.map((attachment) => (
                    <div
                      key={attachment.attachmentId}
                      className="relative group border rounded-lg overflow-hidden"
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="size-12 text-gray-400" />
                      </div>
                      <div className="p-2">
                        <p className="text-sm truncate" title={attachment.originalFileName}>
                          {attachment.originalFileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(attachment.fileSize)}
                        </p>
                        {attachment.description && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {attachment.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(attachment)}
                          >
                            <Download className="size-3 mr-1" />
                            {attachment.downloadCount}
                          </Button>
                          {canEdit && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(attachment)}
                              >
                                <Edit className="size-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(attachment.attachmentId)}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document List */}
          {documentAttachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-5" />
                  Documents ({documentAttachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Uploaded At</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentAttachments.map((attachment) => (
                      <TableRow key={attachment.attachmentId}>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-2">
                              <span>{getFileIcon(attachment.fileExtension)}</span>
                              <span className="truncate max-w-xs" title={attachment.originalFileName}>
                                {attachment.originalFileName}
                              </span>
                            </div>
                            {attachment.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {attachment.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{attachment.fileExtension}</Badge>
                        </TableCell>
                        <TableCell>{formatFileSize(attachment.fileSize)}</TableCell>
                        <TableCell>{attachment.uploadedByName}</TableCell>
                        <TableCell>{formatDate(attachment.uploadedAt)}</TableCell>
                        <TableCell>{attachment.downloadCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(attachment)}
                            >
                              <Download className="size-4" />
                            </Button>
                            {canEdit && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(attachment)}
                                >
                                  <Edit className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(attachment.attachmentId)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Upload an attachment to this article
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedFile && (
              <div className="border rounded p-3">
                <div className="flex items-center gap-2">
                  <span>{getFileIcon(`.${selectedFile.name.split('.').pop()}`)}</span>
                  <div className="flex-1">
                    <p className="truncate">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
              />
            </div>
            {uploading && (
              <div>
                <Progress value={uploadProgress} />
                <p className="text-sm text-muted-foreground mt-2">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
              {uploading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="size-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attachment</DialogTitle>
            <DialogDescription>
              Update the attachment description
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="editDescription">Description</Label>
            <Input
              id="editDescription"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Add a description..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAttachment}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}