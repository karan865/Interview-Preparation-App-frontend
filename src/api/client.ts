import { CONFIG, getCandidateApiUrls } from '../constants/config';
import { storage } from '../utils/storage';
import { ApiError } from '../utils/error';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  skipAuth?: boolean;
  isRetry?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private hasVerifiedBaseUrl: boolean = false;
  private resolvingPromise: Promise<string> | null = null;

  constructor(baseUrl: string = CONFIG.API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/$/, '');
    this.hasVerifiedBaseUrl = true;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Probes candidate API URLs to automatically discover
   * the active backend URL (prioritizing live cloud backends, then local LAN/emulator/USB).
   */
  async resolveWorkingBaseUrl(): Promise<string> {
    if (this.resolvingPromise) {
      return this.resolvingPromise;
    }

    const candidates = getCandidateApiUrls();
    const isRemote = this.baseUrl.startsWith('https://');

    this.resolvingPromise = (async () => {
      const checkCandidate = async (cand: string, timeoutMs: number = 5000): Promise<string> => {
        const cleanCand = cand.replace(/\/$/, '');
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), timeoutMs);
        try {
          const res = await fetch(`${cleanCand}/health`, { signal: ctrl.signal });
          clearTimeout(tid);
          if (res.ok) {
            return cleanCand;
          }
          throw new Error(`HTTP ${res.status}`);
        } catch (e) {
          clearTimeout(tid);
          throw e;
        }
      };

      // 1. If configured baseUrl is remote (e.g. Render live server), verify it first
      // with a generous timeout to gracefully handle cloud spin-up/cold starts.
      if (isRemote) {
        try {
          const verified = await checkCandidate(this.baseUrl, 10000);
          this.baseUrl = verified;
          this.hasVerifiedBaseUrl = true;
          console.log(`[ApiClient] Connected to live backend: ${this.baseUrl}`);
          return verified;
        } catch (err) {
          console.warn(`[ApiClient] Live backend check failed or waking up, checking candidate list...`, err);
        }
      }

      // 2. Probe candidate list for local development or fallback
      const ordered = [this.baseUrl, ...candidates.filter((c) => c !== this.baseUrl)];

      try {
        const fastest = await Promise.any(ordered.map((cand) => checkCandidate(cand, 4000)));
        this.baseUrl = fastest;
        this.hasVerifiedBaseUrl = true;
        console.log(`[ApiClient] Connected to active backend: ${this.baseUrl}`);
        return fastest;
      } catch {
        // Fallback to configured base URL if all health checks fail
        return this.baseUrl;
      } finally {
        this.resolvingPromise = null;
      }
    })();

    return this.resolvingPromise;
  }

  private async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      params,
      skipAuth = false,
      isRetry = false,
    } = options;

    // Verify / auto-detect reachable base URL on first request
    if (!this.hasVerifiedBaseUrl) {
      await this.resolveWorkingBaseUrl();
    }

    // Construct URL with query parameters
    let url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          if (Array.isArray(val)) {
            searchParams.append(key, val.join(','));
          } else {
            searchParams.append(key, String(val));
          }
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    // Build headers
    const requestHeaders: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    };

    // Attach JWT if available and not skipped
    if (!skipAuth) {
      const token = await storage.getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    // Setup Timeout with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse JSON response
      let responseData: any = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      }

      if (!response.ok) {
        const message = responseData?.message || `Request failed with status ${response.status}`;
        const errors = responseData?.errors;
        throw new ApiError(message, response.status, errors);
      }

      return responseData as T;
    } catch (error: any) {
      clearTimeout(timeoutId);

      const errMsg = String(error?.message || '').toLowerCase();
      const isNetworkError =
        error?.name === 'AbortError' ||
        errMsg.includes('canceled') ||
        errMsg.includes('network request failed') ||
        errMsg.includes('failed to fetch') ||
        errMsg.includes('fetch failed') ||
        errMsg.includes('connectexception') ||
        errMsg.includes('econnrefused') ||
        errMsg.includes('enotfound') ||
        errMsg.includes('timeout') ||
        errMsg.includes('failed to connect');

      // Auto-fallback and retry once if this was a network failure
      if (isNetworkError && !isRetry) {
        this.hasVerifiedBaseUrl = false;
        const newBase = await this.resolveWorkingBaseUrl();
        if (newBase) {
          return this.request<T>(endpoint, { ...options, isRetry: true });
        }
      }

      if (error.name === 'AbortError' || error.message?.includes('canceled')) {
        throw new ApiError(
          `Request to ${this.baseUrl} timed out. Ensure backend server is reachable.`,
          408
        );
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error.message || `Network request failed to ${this.baseUrl}. Ensure server is reachable.`,
        0
      );
    }
  }

  get<T = any>(endpoint: string, params?: Record<string, any>, options: Omit<RequestOptions, 'method' | 'params'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET', params });
  }

  post<T = any>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T = any>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T = any>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T = any>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
