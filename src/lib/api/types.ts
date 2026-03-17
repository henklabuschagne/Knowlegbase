/**
 * API Response Types
 * 
 * Standard response envelope types for the mock API layer.
 * These match the shape that a real backend would return.
 */

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
