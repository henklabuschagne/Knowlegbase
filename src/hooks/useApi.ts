/**
 * API Utility Hooks
 * 
 * Generic hooks for managing loading/error state around API calls.
 * Use these when you need explicit loading/error tracking in components.
 */

import { useState, useCallback } from 'react';
import type { ApiResult } from '../lib/api/types';

/**
 * Hook for async data fetching with loading/error tracking.
 * 
 * Usage:
 *   const { data, loading, error, execute } = useApiCall<ArticleDto[]>();
 *   useEffect(() => { execute(() => api.articles.getArticles()); }, []);
 */
export function useApiCall<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiFn: () => Promise<ApiResult<T>>) => {
    setLoading(true);
    setError(null);
    const result = await apiFn();
    setLoading(false);
    if (result.success) {
      setData(result.data);
    } else {
      setError(result.error.message);
    }
    return result;
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}

/**
 * Hook for async mutations with loading/error tracking.
 * 
 * Usage:
 *   const { loading, error, mutate } = useApiMutation<CreateArticleRequest, ArticleDto>();
 *   const handleSave = () => mutate(api.articles.createArticle, data);
 */
export function useApiMutation<TInput, TOutput>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (
    apiFn: (input: TInput) => Promise<ApiResult<TOutput>>,
    input: TInput
  ) => {
    setLoading(true);
    setError(null);
    const result = await apiFn(input);
    setLoading(false);
    if (!result.success) {
      setError(result.error.message);
    }
    return result;
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return { loading, error, mutate, reset };
}
