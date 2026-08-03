import { Connection, SfError } from '@salesforce/core';

type SalesforceErrorItem = {
  message?: string;
  errorCode?: string;
};

type JsforceLikeError = {
  message?: string;
  errorCode?: string;
  statusCode?: number;
  data?: unknown;
  response?: {
    statusCode?: number;
    body?: unknown;
  };
};

const isNonBlank = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const formatSalesforceErrorData = (data: unknown): string | undefined => {
  if (!Array.isArray(data) || data.length === 0) return undefined;
  const messages = data
    .map((item) => {
      const entry = item as SalesforceErrorItem;
      if (!isNonBlank(entry?.message)) return undefined;
      return isNonBlank(entry.errorCode) ? `${entry.errorCode}: ${entry.message}` : entry.message;
    })
    .filter((message): message is string => Boolean(message));
  return messages.length > 0 ? messages.join('; ') : undefined;
};

const formatRawBody = (body: unknown): string | undefined => {
  if (body === undefined || body === null) return undefined;
  if (typeof body === 'string') {
    const trimmed = body.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  try {
    const serialized = JSON.stringify(body);
    return serialized && serialized !== '{}' ? serialized : undefined;
  } catch {
    return String(body);
  }
};

/**
 * Turns a jsforce/request failure into a non-empty human-readable string.
 * Prefer error.message; otherwise surface Salesforce-shaped data, raw body, or a status fallback.
 */
const formatJsforceError = (error: unknown): string => {
  const err = (error ?? {}) as JsforceLikeError;

  if (isNonBlank(err.message)) {
    return err.message.trim();
  }

  const fromData = formatSalesforceErrorData(err.data);
  if (fromData) return fromData;

  const rawBody = formatRawBody(err.response?.body) ?? formatRawBody(err.data);
  if (rawBody) return rawBody;

  const status = err.response?.statusCode ?? err.statusCode;
  const errorCode = isNonBlank(err.errorCode) ? err.errorCode.trim() : undefined;
  if (status !== undefined && errorCode) {
    return `Request failed: HTTP ${status} (${errorCode})`;
  }
  if (status !== undefined) {
    return `Request failed: HTTP ${status}`;
  }
  if (errorCode) {
    return `Request failed: ${errorCode}`;
  }

  return 'Request failed';
};

/**
 * hubConn.request wrapper that rethrows blank jsforce errors as SfError with a usable message.
 */
const hubRequest = async <T>(hubConn: Connection, requestInfo: Parameters<Connection['request']>[0]): Promise<T> => {
  try {
    return (await hubConn.request(requestInfo)) as T;
  } catch (error) {
    throw new SfError(formatJsforceError(error));
  }
};

export { formatJsforceError, hubRequest };
