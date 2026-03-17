import { useState, useEffect } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, Plus, Edit, Trash2, Tag as TagIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function TagManagement() {
  const { hasRole } = useAuth();
  const { tags, tagTypes, actions } = useAppStore('tags');
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<number | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [formData, setFormData] = useState({
    tagTypeId: 1,
    tagName: '',
    tagValue: '',
    description: '',
    colorCode: '#3B82F6',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedType]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        actions.getTags(selectedType || undefined),
        actions.getTagTypes(),
      ]);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTag(null);
    setFormData({
      tagTypeId: selectedType || 1,
      tagName: '',
      tagValue: '',
      description: '',
      colorCode: '#3B82F6',
    });
    setError('');
    setDialogOpen(true);
  };

  const handleEdit = (tag: any) => {
    setEditingTag(tag);
    setFormData({
      tagTypeId: tag.tagTypeId,
      tagName: tag.tagName,
      tagValue: tag.tagValue,
      description: tag.description || '',
      colorCode: tag.colorCode || '#3B82F6',
    });
    setError('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.tagName.trim() || !formData.tagValue.trim()) {
      setError('Tag name and value are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (editingTag) {
        const result = await actions.updateTag(editingTag.tagId, {
          tagName: formData.tagName,
          tagValue: formData.tagValue,
          description: formData.description || undefined,
          colorCode: formData.colorCode,
        });
        if (!result.success) {
          setError(result.error.message || 'Failed to update tag');
          setSaving(false);
          return;
        }
      } else {
        const result = await actions.createTag({
          tagTypeId: formData.tagTypeId,
          tagName: formData.tagName,
          tagValue: formData.tagValue,
          description: formData.description || undefined,
          colorCode: formData.colorCode,
        });
        if (!result.success) {
          setError(result.error.message || 'Failed to create tag');
          setSaving(false);
          return;
        }
      }

      setDialogOpen(false);
      loadData();
    } catch (err: any) {
      setError('Failed to save tag');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tag: any) => {
    if (!confirm(`Delete tag "${tag.tagName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const result = await actions.deleteTag(tag.tagId);
      if (result.success) {
        loadData();
      } else {
        alert(result.error.message || 'Failed to delete tag');
      }
    } catch (err: any) {
      alert('Failed to delete tag');
    }
  };

  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.tagTypeName]) {
      acc[tag.tagTypeName] = [];
    }
    acc[tag.tagTypeName].push(tag);
    return acc;
  }, {} as Record<string, any[]>);

  if (!hasRole('Admin')) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">You don't have permission to manage tags</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl">Tag Management</h1>
          <p className="text-muted-foreground">Manage tags for article categorization</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="size-4 mr-2" />
          New Tag
        </Button>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label htmlFor="typeFilter">Filter by Type:</Label>
            <Select
              value={selectedType?.toString() || 'all'}
              onValueChange={(value) => setSelectedType(value === 'all' ? null : parseInt(value))}
            >
              <SelectTrigger id="typeFilter" className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {tagTypes.map(type => (
                  <SelectItem key={type.tagTypeId} value={type.tagTypeId.toString()}>
                    {type.tagTypeName}
                  </SelectItem>
                ))}
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

      {/* Tags by Type */}
      {!loading && (
        <div className="space-y-6">
          {Object.entries(groupedTags).map(([typeName, typeTags]) => (
            <Card key={typeName}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TagIcon className="size-5" />
                  {typeName}
                  <Badge variant="secondary">{typeTags.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeTags.map(tag => (
                    <div
                      key={tag.tagId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="size-3 rounded-full"
                            style={{ backgroundColor: tag.colorCode || '#6B7280' }}
                          />
                          <span>{tag.tagName}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{tag.tagValue}</p>
                        {tag.description && (
                          <p className="text-xs text-muted-foreground mt-1">{tag.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(tag)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(tag)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {Object.keys(groupedTags).length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No tags found</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTag ? 'Edit Tag' : 'Create New Tag'}</DialogTitle>
            <DialogDescription>
              {editingTag ? 'Update tag information' : 'Add a new tag for article categorization'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="tagTypeId">Tag Type *</Label>
              <Select
                value={formData.tagTypeId.toString()}
                onValueChange={(value) => setFormData({ ...formData, tagTypeId: parseInt(value) })}
                disabled={!!editingTag}
              >
                <SelectTrigger id="tagTypeId">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tagTypes.map(type => (
                    <SelectItem key={type.tagTypeId} value={type.tagTypeId.toString()}>
                      {type.tagTypeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tagName">Tag Name *</Label>
              <Input
                id="tagName"
                value={formData.tagName}
                onChange={(e) => setFormData({ ...formData, tagName: e.target.value })}
                placeholder="e.g., Getting Started"
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="tagValue">Tag Value *</Label>
              <Input
                id="tagValue"
                value={formData.tagValue}
                onChange={(e) => setFormData({ ...formData, tagValue: e.target.value })}
                placeholder="e.g., getting-started"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lowercase with hyphens (used for filtering)
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
                maxLength={500}
              />
            </div>

            <div>
              <Label htmlFor="colorCode">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="colorCode"
                  type="color"
                  value={formData.colorCode}
                  onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.colorCode}
                  onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                  placeholder="#3B82F6"
                  maxLength={7}
                  className="flex-1"
                />
              </div>
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
                  Saving...
                </>
              ) : (
                editingTag ? 'Update' : 'Create'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}