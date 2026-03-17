import { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import type { ImportResultDto } from '../types/dto';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import {
  Download,
  Upload,
  Database,
  FileJson,
  FileSpreadsheet,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export function ExportImport() {
  const { actions } = useAppStore('articles');
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResultDto | null>(null);

  // Export state
  const [exportFormat, setExportFormat] = useState<string>('JSON');
  const [exportEntityType, setExportEntityType] = useState<string>('Articles');

  // Import state
  const [importFormat, setImportFormat] = useState<string>('JSON');
  const [importEntityType, setImportEntityType] = useState<string>('Articles');
  const [importData, setImportData] = useState<string>('');

  const handleExport = async () => {
    setLoading(true);
    try {
      const result = await actions.exportData({
        format: exportFormat as 'JSON' | 'CSV',
        entityType: exportEntityType as 'Articles' | 'Users' | 'Tags' | 'All',
        includeRelated: true,
      });

      if (result.success) {
        // Create download link
        const blob = new Blob([result.data], { type: exportFormat === 'JSON' ? 'application/json' : 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `export_${exportEntityType}_${new Date().toISOString()}.${exportFormat.toLowerCase()}`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error exporting data:', err);
      alert('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleFullBackup = async () => {
    setLoading(true);
    try {
      const result = await actions.createBackup();

      if (result.success) {
        const blob = new Blob([result.data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `full_backup_${new Date().toISOString()}.json`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error creating backup:', err);
      alert('Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      alert('Please provide data to import');
      return;
    }

    setLoading(true);
    setImportResult(null);
    try {
      const result = await actions.importData({
        format: importFormat,
        entityType: importEntityType,
        data: importData,
        overwriteExisting: false,
      });

      if (result.success) {
        setImportResult(result.data);
      } else {
        setImportResult({
          totalRecords: 0,
          successfulImports: 0,
          failedImports: 1,
          errors: ['Failed to import data. Please check the format and try again.'],
          warnings: [],
        });
      }
    } catch (err) {
      console.error('Error importing data:', err);
      setImportResult({
        totalRecords: 0,
        successfulImports: 0,
        failedImports: 1,
        errors: ['Failed to import data. Please check the format and try again.'],
        warnings: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!importData.trim()) {
      alert('Please provide backup data to restore');
      return;
    }

    if (!confirm('Are you sure you want to restore from this backup? This may overwrite existing data.')) {
      return;
    }

    setLoading(true);
    setImportResult(null);
    try {
      const result = await actions.restoreBackup(importData);

      if (result.success) {
        setImportResult(result.data);
      } else {
        setImportResult({
          totalRecords: 0,
          successfulImports: 0,
          failedImports: 1,
          errors: ['Failed to restore backup. Please check the format and try again.'],
          warnings: [],
        });
      }
    } catch (err) {
      console.error('Error restoring backup:', err);
      setImportResult({
        totalRecords: 0,
        successfulImports: 0,
        failedImports: 1,
        errors: ['Failed to restore backup. Please check the format and try again.'],
        warnings: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1>Export & Import</h1>
        <p className="text-muted-foreground">
          Export and import data for backup and migration
        </p>
      </div>

      <Tabs defaultValue="export" className="space-y-4">
        <TabsList>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="size-5" />
                Export Data
              </CardTitle>
              <CardDescription>
                Export your data in various formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exportEntityType">Entity Type</Label>
                  <Select value={exportEntityType} onValueChange={setExportEntityType}>
                    <SelectTrigger id="exportEntityType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Articles">Articles</SelectItem>
                      <SelectItem value="Users">Users</SelectItem>
                      <SelectItem value="Tags">Tags</SelectItem>
                      <SelectItem value="All">All Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="exportFormat">Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger id="exportFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JSON">
                        <div className="flex items-center gap-2">
                          <FileJson className="size-4" />
                          JSON
                        </div>
                      </SelectItem>
                      <SelectItem value="CSV">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="size-4" />
                          CSV
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleExport} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="size-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="size-5" />
                Import Data
              </CardTitle>
              <CardDescription>
                Import data from JSON or CSV files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="importEntityType">Entity Type</Label>
                  <Select value={importEntityType} onValueChange={setImportEntityType}>
                    <SelectTrigger id="importEntityType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Articles">Articles</SelectItem>
                      <SelectItem value="Users">Users</SelectItem>
                      <SelectItem value="Tags">Tags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="importFormat">Format</Label>
                  <Select value={importFormat} onValueChange={setImportFormat}>
                    <SelectTrigger id="importFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JSON">JSON</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="importData">Data</Label>
                <Textarea
                  id="importData"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your JSON or CSV data here..."
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <Button onClick={handleImport} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="size-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>

              {importResult && (
                <div className="space-y-3">
                  <Alert>
                    <CheckCircle className="size-4" />
                    <AlertDescription>
                      Successfully imported {importResult.successfulImports} of{' '}
                      {importResult.totalRecords} records
                    </AlertDescription>
                  </Alert>

                  {importResult.failedImports > 0 && (
                    <Alert variant="destructive">
                      <XCircle className="size-4" />
                      <AlertDescription>
                        Failed to import {importResult.failedImports} records
                      </AlertDescription>
                    </Alert>
                  )}

                  {importResult.errors.length > 0 && (
                    <div className="space-y-1">
                      <Label>Errors:</Label>
                      {importResult.errors.map((error, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertDescription className="text-sm">
                            {error}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}

                  {importResult.warnings.length > 0 && (
                    <div className="space-y-1">
                      <Label>Warnings:</Label>
                      {importResult.warnings.map((warning, index) => (
                        <Alert key={index}>
                          <AlertCircle className="size-4" />
                          <AlertDescription className="text-sm">
                            {warning}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="size-5" />
                  Full Backup
                </CardTitle>
                <CardDescription>
                  Create a complete backup of all your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This will export all articles, users, tags, and related data in a
                  single JSON file that can be used for disaster recovery.
                </p>
                <Button onClick={handleFullBackup} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Creating Backup...
                    </>
                  ) : (
                    <>
                      <Download className="size-4 mr-2" />
                      Create Full Backup
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="size-5" />
                  Restore Backup
                </CardTitle>
                <CardDescription>
                  Restore from a previous backup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backupData">Backup Data</Label>
                  <Textarea
                    id="backupData"
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Paste your backup JSON data here..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>

                <Alert>
                  <AlertCircle className="size-4" />
                  <AlertDescription className="text-sm">
                    Warning: Restoring will import data from the backup. Make sure you
                    have a current backup before proceeding.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleRestore}
                  disabled={loading}
                  variant="destructive"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Restoring...
                    </>
                  ) : (
                    <>
                      <Upload className="size-4 mr-2" />
                      Restore from Backup
                    </>
                  )}
                </Button>

                {importResult && (
                  <Alert>
                    <CheckCircle className="size-4" />
                    <AlertDescription>
                      Restore completed: {importResult.successfulImports} records
                      imported, {importResult.failedImports} failed
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}