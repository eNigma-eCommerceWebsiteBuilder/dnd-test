export type ApiQueryValue = string | number | boolean | undefined | null;
export type ApiQueryParams = Record<string, ApiQueryValue>;
export type ApiMutationMethod = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiNextFetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

export interface ApiFetchRequestInit extends RequestInit {
  next?: ApiNextFetchOptions;
}

export interface ApiResponseEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
  validationErrors?: ApiValidationError[];
}

export interface ApiRequestOptions {
  params?: ApiQueryParams;
  headers?: Record<string, string>;
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
  timeout?: number;
  cookies?: string;
  accessToken?: string;
  unwrapResponse?: boolean;
}

export interface ApiValidationError {
  field: string;
  message: string;
}

export interface ApiMutateOptions {
  method?: ApiMutationMethod;
  body?: unknown;
  headers?: Record<string, string>;
  isFormData?: boolean;
  timeout?: number;
  cookies?: string;
  accessToken?: string;
  unwrapResponse?: boolean;
}
