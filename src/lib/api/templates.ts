/**
 * Mock API Layer - Templates Domain
 * Mirrors: TemplateController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { ArticleTemplateDto as TemplateDto } from '../../types/dto';

// GET /api/template
export async function getTemplates(): Promise<ApiResult<TemplateDto[]>> {
  return mockApiCall(() => appStore.templates);
}

// GET /api/template/:id
export async function getTemplateById(id: number): Promise<ApiResult<TemplateDto>> {
  return mockApiCall(() => {
    const tmpl = appStore.templates.find(t => t.templateId === id);
    if (!tmpl) throw new Error(`Template ${id} not found`);
    return tmpl;
  });
}

// POST /api/template
export async function createTemplate(data: Partial<TemplateDto>): Promise<ApiResult<TemplateDto>> {
  if (!data.templateName?.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Template name is required');
  }
  return mockApiCall(() => appStore.createTemplate(data));
}

// PUT /api/template/:id
export async function updateTemplate(id: number, data: Partial<TemplateDto>): Promise<ApiResult<TemplateDto>> {
  return mockApiCall(() => {
    const result = appStore.updateTemplate(id, data);
    if (!result) throw new Error(`Template ${id} not found`);
    return result;
  });
}

// DELETE /api/template/:id
export async function deleteTemplate(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteTemplate(id);
    if (!result) throw new Error(`Template ${id} not found`);
    return result;
  });
}