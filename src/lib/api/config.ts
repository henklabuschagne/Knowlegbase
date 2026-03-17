/**
 * API Configuration
 * 
 * Controls simulated latency, error injection, and response builders.
 * When the real backend is ready, flip `useRealApi` to true and
 * domain files will call fetch() instead of appStore methods.
 */

import type { ApiResult } from './types';

export const apiConfig = {
  /** Set to false to disable simulated latency */
  simulateLatency: true,
  /** Min latency in ms */
  minLatency: 80,
  /** Max latency in ms */
  maxLatency: 300,
  /** Probability of random error (0-1). Use 0.1-0.3 for stress testing. */
  errorRate: 0,
  /** Set to true when real backend is ready */
  useRealApi: false,
  /** Base URL for real API calls */
  baseUrl: 'http://localhost:5000/api',
};

export async function simulateLatency(): Promise<void> {
  if (!apiConfig.simulateLatency) return;
  const delay = apiConfig.minLatency + Math.random() * (apiConfig.maxLatency - apiConfig.minLatency);
  await new Promise(r => setTimeout(r, delay));
}

export function shouldSimulateError(): boolean {
  return Math.random() < apiConfig.errorRate;
}

export function successResponse<T>(data: T): ApiResult<T> {
  return { success: true, data };
}

export function errorResponse(code: string, message: string): ApiResult<never> {
  return { success: false, error: { code, message } };
}

/**
 * Wraps a mock implementation in standard latency/error handling.
 * When useRealApi is true, domain files would call fetch() instead.
 */
export async function mockApiCall<T>(
  fn: () => T,
  errorMessage = 'An unexpected error occurred'
): Promise<ApiResult<T>> {
  await simulateLatency();
  if (shouldSimulateError()) {
    return errorResponse('SIMULATED_ERROR', errorMessage);
  }
  try {
    const result = fn();
    return successResponse(result);
  } catch (e) {
    return errorResponse('INTERNAL_ERROR', e instanceof Error ? e.message : errorMessage);
  }
}
