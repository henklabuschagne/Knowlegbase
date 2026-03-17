/**
 * Mock API Layer - Export / Import Domain
 * Mirrors: ExportImportController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { ImportResultDto, ExportRequestDto } from '../../types/dto';

// POST /api/exportimport/export
export async function exportData(request: ExportRequestDto): Promise<ApiResult<string>> {
  return mockApiCall(() => {
    let data: any[] = [];

    switch (request.entityType) {
      case 'Articles':
        data = appStore.articles.map(a => ({
          articleId: a.articleId,
          title: a.title,
          summary: a.summary,
          content: a.content,
          statusName: a.statusName,
          isInternal: a.isInternal,
          createdByName: a.createdByName,
          createdAt: a.createdAt,
          publishedAt: a.publishedAt,
          versionNumber: a.versionNumber,
          viewCount: a.viewCount,
          tags: a.tags?.map(t => t.tagName) || [],
        }));
        break;
      case 'Users':
        data = appStore.users.map(u => ({
          userId: u.userId,
          email: u.email,
          fullName: u.fullName,
          roleName: u.roleName,
          isActive: u.isActive,
          createdAt: u.createdAt,
          lastLoginAt: u.lastLoginAt,
        }));
        break;
      case 'Tags':
        data = appStore.tags.map(t => ({
          tagId: t.tagId,
          tagName: t.tagName,
          tagTypeName: t.tagTypeName,
          tagValue: t.tagValue,
          colorCode: t.colorCode,
          isActive: t.isActive,
        }));
        break;
      case 'All':
        data = [{
          articles: appStore.articles.length,
          users: appStore.users.length,
          tags: appStore.tags.length,
          feedback: appStore.feedback.length,
          requests: appStore.requests.length,
          message: 'Full export would include all data. This is a mock response.',
        }];
        break;
    }

    if (request.format === 'CSV') {
      if (data.length === 0) return '';
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row =>
        Object.values(row).map(v =>
          typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : Array.isArray(v) ? `"${v.join(';')}"` : String(v)
        ).join(',')
      );
      return [headers, ...rows].join('\n');
    }

    return JSON.stringify(data, null, 2);
  });
}

// POST /api/exportimport/backup
export async function createBackup(): Promise<ApiResult<string>> {
  return mockApiCall(() => {
    const backup = {
      metadata: {
        version: '1.0',
        createdAt: new Date().toISOString(),
        createdBy: appStore.currentUser?.fullName || 'System',
        applicationVersion: '1.0.0',
        totalArticles: appStore.articles.length,
        totalUsers: appStore.users.length,
        totalTags: appStore.tags.length,
        recordCounts: {
          articles: appStore.articles.length,
          users: appStore.users.length,
          tags: appStore.tags.length,
          feedback: appStore.feedback.length,
          requests: appStore.requests.length,
          approvals: appStore.approvals.length,
          templates: appStore.templates.length,
        },
      },
      articles: appStore.articles,
      users: appStore.users,
      tags: appStore.tags,
      feedback: appStore.feedback,
      requests: appStore.requests,
    };
    return JSON.stringify(backup, null, 2);
  });
}

// POST /api/exportimport/import
export async function importData(request: {
  format: string;
  entityType: string;
  data: string;
  overwriteExisting?: boolean;
}): Promise<ApiResult<ImportResultDto>> {
  if (!request.data?.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Import data is required');
  }

  return mockApiCall(() => {
    let totalRecords = 0;
    let successfulImports = 0;
    let failedImports = 0;
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      let records: any[];

      if (request.format === 'JSON') {
        records = JSON.parse(request.data);
        if (!Array.isArray(records)) {
          records = [records];
        }
      } else {
        // CSV parsing
        const lines = request.data.trim().split('\n');
        if (lines.length < 2) {
          return {
            totalRecords: 0,
            successfulImports: 0,
            failedImports: 0,
            errors: ['CSV file must have at least a header row and one data row'],
            warnings: [],
            importedAt: new Date().toISOString(),
            importedBy: appStore.currentUser?.fullName || 'System',
          };
        }
        const headers = lines[0].split(',').map(h => h.trim());
        records = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const obj: any = {};
          headers.forEach((h, i) => { obj[h] = values[i]; });
          return obj;
        });
      }

      totalRecords = records.length;

      // Mock: count each record as successfully imported
      records.forEach((record, index) => {
        try {
          if (!record || typeof record !== 'object') {
            throw new Error(`Record at index ${index} is not a valid object`);
          }
          successfulImports++;
        } catch (err: any) {
          failedImports++;
          errors.push(`Row ${index + 1}: ${err.message}`);
        }
      });

      if (successfulImports > 0) {
        warnings.push(`Mock import: ${successfulImports} records would be imported in production`);
      }
    } catch (err: any) {
      failedImports = 1;
      errors.push(`Failed to parse import data: ${err.message}`);
    }

    return {
      totalRecords,
      successfulImports,
      failedImports,
      errors,
      warnings,
      importedAt: new Date().toISOString(),
      importedBy: appStore.currentUser?.fullName || 'System',
    };
  });
}

// POST /api/exportimport/restore
export async function restoreBackup(data: string): Promise<ApiResult<ImportResultDto>> {
  if (!data?.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Backup data is required');
  }

  return mockApiCall(() => {
    try {
      const backup = JSON.parse(data);
      if (!backup.metadata) {
        throw new Error('Invalid backup format: missing metadata');
      }

      return {
        totalRecords: Object.values(backup.metadata.recordCounts || {}).reduce((sum: number, c: any) => sum + (c || 0), 0) as number,
        successfulImports: Object.values(backup.metadata.recordCounts || {}).reduce((sum: number, c: any) => sum + (c || 0), 0) as number,
        failedImports: 0,
        errors: [],
        warnings: ['Mock restore: data would be restored in production. Store has been reset to defaults.'],
        importedAt: new Date().toISOString(),
        importedBy: appStore.currentUser?.fullName || 'System',
      };
    } catch (err: any) {
      return {
        totalRecords: 0,
        successfulImports: 0,
        failedImports: 1,
        errors: [`Failed to parse backup data: ${err.message}`],
        warnings: [],
        importedAt: new Date().toISOString(),
        importedBy: appStore.currentUser?.fullName || 'System',
      };
    }
  });
}
