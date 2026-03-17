import { useState, useEffect } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Loader2, Plus, Edit, Trash2, FileText, Copy } from 'lucide-react';
import { Switch } from './ui/switch';

interface ArticleTemplate {
  templateId: number;
  templateName: string;
  description?: string;
  category?: string;
  titleTemplate?: string;
  contentTemplate: string;
  summaryTemplate?: string;
  isInternal: boolean;
  isActive: boolean;
  usageCount: number;
  createdByName?: string;
  createdAt: string;
  fields: TemplateField[];
  tags: any[];
}

interface TemplateField {
  fieldId: number;
  fieldName: string;
  fieldType: string;
  fieldLabel: string;
  placeholder?: string;
  defaultValue?: string;
  isRequired: boolean;
  displayOrder: number;
}

interface CreateTemplate {
  templateName: string;
  description?: string;
  category?: string;
  titleTemplate?: string;
  contentTemplate: string;
  summaryTemplate?: string;
  isInternal: boolean;
  fields: CreateTemplateField[];
  tagIds: number[];
}

interface CreateTemplateField {
  fieldName: string;
  fieldType: string;
  fieldLabel: string;
  placeholder?: string;
  defaultValue?: string;
  isRequired: boolean;
  displayOrder: number;
}

export function TemplateManager() {
  const { actions } = useAppStore('templates');
  const [templates, setTemplates] = useState<ArticleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUseDialog, setShowUseDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ArticleTemplate | null>(null);

  // Create form state
  const [newTemplate, setNewTemplate] = useState<CreateTemplate>({
    templateName: '',
    description: '',
    category: '',
    titleTemplate: '',
    contentTemplate: '',
    summaryTemplate: '',
    isInternal: false,
    fields: [],
    tagIds: [],
  });

  // Use template state
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const result = await actions.getTemplates();
      if (result.success) {
        setTemplates(result.data as any[]);
      }
    } catch (err) {
      console.error('Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const result = await actions.createTemplate(newTemplate as any);
      if (result.success) {
        setShowCreateDialog(false);
        setNewTemplate({
          templateName: '',
          description: '',
          category: '',
          titleTemplate: '',
          contentTemplate: '',
          summaryTemplate: '',
          isInternal: false,
          fields: [],
          tagIds: [],
        });
        loadTemplates();
      }
    } catch (err) {
      console.error('Error creating template:', err);
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const result = await actions.deleteTemplate(templateId);
      if (result.success) {
        loadTemplates();
      }
    } catch (err) {
      console.error('Error deleting template:', err);
    }
  };

  const handleUseTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      // In mock mode, simulate creating an article from the template
      let content = selectedTemplate.contentTemplate;
      let title = selectedTemplate.titleTemplate || selectedTemplate.templateName;
      
      // Replace field placeholders
      Object.entries(fieldValues).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        title = title.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      const result = await actions.createTemplate({ ...selectedTemplate, usageCount: selectedTemplate.usageCount + 1 } as any);
      alert(`Article content generated from template "${selectedTemplate.templateName}". You can use this in the article editor.`);
      setShowUseDialog(false);
      setFieldValues({});
      setSelectedTemplate(null);
    } catch (err) {
      console.error('Error creating article from template:', err);
    }
  };

  const openUseTemplate = (template: ArticleTemplate) => {
    setSelectedTemplate(template);
    const initialValues: Record<string, string> = {};
    (template.fields || []).forEach((field) => {
      initialValues[field.fieldName] = field.defaultValue || '';
    });
    setFieldValues(initialValues);
    setShowUseDialog(true);
  };

  const addField = () => {
    setNewTemplate({
      ...newTemplate,
      fields: [
        ...newTemplate.fields,
        {
          fieldName: '',
          fieldType: 'Text',
          fieldLabel: '',
          placeholder: '',
          defaultValue: '',
          isRequired: false,
          displayOrder: newTemplate.fields.length,
        },
      ],
    });
  };

  const removeField = (index: number) => {
    setNewTemplate({
      ...newTemplate,
      fields: newTemplate.fields.filter((_, i) => i !== index),
    });
  };

  const updateField = (index: number, updates: Partial<CreateTemplateField>) => {
    const updatedFields = [...newTemplate.fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setNewTemplate({ ...newTemplate, fields: updatedFields });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Article Templates</h1>
          <p className="text-muted-foreground">
            Create and manage reusable article templates
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="size-4 mr-2" />
          Create Template
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="size-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No templates found</p>
            <Button onClick={() => setShowCreateDialog(true)} className="mt-4">
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.templateId} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="size-5" />
                      {template.templateName}
                    </CardTitle>
                    {template.category && (
                      <Badge variant="outline" className="mt-2">
                        {template.category}
                      </Badge>
                    )}
                  </div>
                </div>
                {template.description && (
                  <CardDescription>{template.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Usage Count</span>
                    <span>{template.usageCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fields</span>
                    <span>{template.fields?.length ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <Badge variant={template.isInternal ? 'secondary' : 'default'}>
                      {template.isInternal ? 'Internal' : 'External'}
                    </Badge>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => openUseTemplate(template)}
                    >
                      <Copy className="size-4 mr-2" />
                      Use Template
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.templateId)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Article Template</DialogTitle>
            <DialogDescription>
              Create a reusable template for articles
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={newTemplate.templateName}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, templateName: e.target.value })
                }
                placeholder="e.g., Bug Report Template"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newTemplate.description}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, description: e.target.value })
                }
                placeholder="Brief description of this template"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newTemplate.category}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, category: e.target.value })
                  }
                  placeholder="e.g., Technical, Support"
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="isInternal"
                  checked={newTemplate.isInternal}
                  onCheckedChange={(checked) =>
                    setNewTemplate({ ...newTemplate, isInternal: checked })
                  }
                />
                <Label htmlFor="isInternal">Internal Only</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="titleTemplate">Title Template</Label>
              <Input
                id="titleTemplate"
                value={newTemplate.titleTemplate}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, titleTemplate: e.target.value })
                }
                placeholder="Use {{fieldName}} for dynamic fields"
              />
            </div>

            <div>
              <Label htmlFor="contentTemplate">Content Template</Label>
              <Textarea
                id="contentTemplate"
                value={newTemplate.contentTemplate}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, contentTemplate: e.target.value })
                }
                placeholder="Use {{fieldName}} for dynamic fields"
                rows={8}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Template Fields</Label>
                <Button variant="outline" size="sm" onClick={addField}>
                  <Plus className="size-4 mr-2" />
                  Add Field
                </Button>
              </div>

              {newTemplate.fields.map((field, index) => (
                <Card key={index} className="p-4 mb-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Field Name</Label>
                      <Input
                        value={field.fieldName}
                        onChange={(e) =>
                          updateField(index, { fieldName: e.target.value })
                        }
                        placeholder="e.g., issueTitle"
                      />
                    </div>
                    <div>
                      <Label>Field Label</Label>
                      <Input
                        value={field.fieldLabel}
                        onChange={(e) =>
                          updateField(index, { fieldLabel: e.target.value })
                        }
                        placeholder="e.g., Issue Title"
                      />
                    </div>
                    <div>
                      <Label>Field Type</Label>
                      <Select
                        value={field.fieldType}
                        onValueChange={(value) =>
                          updateField(index, { fieldType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Text">Text</SelectItem>
                          <SelectItem value="RichText">Rich Text</SelectItem>
                          <SelectItem value="Number">Number</SelectItem>
                          <SelectItem value="Date">Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeField(index)}
                        className="w-full"
                      >
                        <Trash2 className="size-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Use Template Dialog */}
      <Dialog open={showUseDialog} onOpenChange={setShowUseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Article from Template</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.templateName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {(selectedTemplate?.fields || []).map((field) => (
              <div key={field.fieldId}>
                <Label htmlFor={field.fieldName}>
                  {field.fieldLabel}
                  {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.fieldType === 'RichText' ? (
                  <Textarea
                    id={field.fieldName}
                    value={fieldValues[field.fieldName] || ''}
                    onChange={(e) =>
                      setFieldValues({
                        ...fieldValues,
                        [field.fieldName]: e.target.value,
                      })
                    }
                    placeholder={field.placeholder}
                    rows={4}
                  />
                ) : (
                  <Input
                    id={field.fieldName}
                    type={field.fieldType === 'Number' ? 'number' : field.fieldType === 'Date' ? 'date' : 'text'}
                    value={fieldValues[field.fieldName] || ''}
                    onChange={(e) =>
                      setFieldValues({
                        ...fieldValues,
                        [field.fieldName]: e.target.value,
                      })
                    }
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUseTemplate}>Create Article</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}