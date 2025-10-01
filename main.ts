// Bamboo Payment - createPayment TypeScript implementation
// Self-contained, type-safe function with runtime validation, fetch call, and custom error class.

type Environment = 'production' | 'stage';

interface CardData {
  CardHolderName: string;
  Pan: string;
  CVV: string;
  Expiration: string; // MM/YY
  Email: string;
  Document?: string;
}

interface CustomerAddress {
  Country?: string;
  City?: string;
  State?: string;
  PostalCode?: string;
  AddressDetail?: string;
}

interface Customer {
  FirstName?: string;
  LastName?: string;
  ReferenceCode?: string;
  PhoneNumber?: string;
  DocumentNumber?: string;
  DocumentType?: string; // e.g., CPF.BR
  Email: string;
  Address?: CustomerAddress;
}

interface CreatePaymentRequest {
  TrxToken?: string;
  NetworkToken?: Record<string, unknown>;
  PaymentMethod?: string;
  CardData?: CardData;
  UniqueID?: string;
  Capture?: boolean;
  TargetCountryISO: string;
  Currency: string;
  Amount: number; // minor units
  Tip?: number;
  TaxableAmount?: number;
  Installments?: number;
  Order: string;
  InvoiceNumber?: string;
  Description?: string;
  AdditionalData?: string;
  MetadataIn?: Record<string, unknown>;
  SoftDescriptor?: string;
  Customer: Customer;
}

interface ActionResponse {
  SessionId?: string | null;
  Reason?: string | null;
  URL?: string | null;
}

interface PaymentMethodResponse {
  Brand?: string | null;
  CardOwner?: string | null;
  Bin?: string | null;
  IssuerBank?: string | null;
  Type?: string | null;
  Expiration?: string | null;
  Last4?: string | null;
}

interface CreatePaymentResponse {
  TransactionId: string;
  Result: string;
  Status: string;
  ErrorCode?: string | null;
  ErrorDescription?: string | null;
  Created: string; // ISO 8601
  AuthorizationDate?: string | null;
  AuthorizationCode?: string | null;
  Amount: number;
  Currency: string;
  Installments?: number | null;
  TaxableAmount?: number | null;
  Tip?: number | null;
  Url?: string | null;
  MetadataOut?: Record<string, unknown> | null;
  Action?: ActionResponse | null;
  PaymentMethod?: PaymentMethodResponse | null;
}

interface ApiErrorResponse {
  ErrorCode: string;
  ErrorDescription: string;
}

type PaymentErrorCode = 'VALIDATION_ERROR' | 'NETWORK_ERROR' | 'API_ERROR' | 'UNKNOWN_ERROR';

class PaymentError extends Error {
  public code: PaymentErrorCode;
  public details?: unknown;

  constructor(code: PaymentErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.details = details;
    // Set the prototype explicitly to maintain instanceof behavior in ES5 targets
    Object.setPrototypeOf(this, PaymentError.prototype);
  }
}

interface CreatePaymentOptions {
  apiKey: string; // Merchant Private Key (send as Basic {apiKey})
  environment?: Environment; // 'production' | 'stage'
  baseUrl?: string; // optional override base URL
  lang?: string; // optional 'en'|'es'|'pt' etc.
  timeoutMs?: number; // default 30000
}

/* ----------------- Helpers & Validators ----------------- */

const DEFAULT_TIMEOUT_MS = 30000;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringNonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isIntegerNonNegative(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

function validateEmail(email: string): boolean {
  // Basic email check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateExpiration(exp: string): boolean {
  // MM/YY where MM 01-12
  return /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp);
}

function buildBaseUrl(env: Environment, override?: string): string {
  if (override && isStringNonEmpty(override)) {
    return override.replace(/\/+$/, ''); // remove trailing slashes
  }
  if (env === 'stage') {
    return 'https://api.stage.bamboopayment.com/v3/api';
  }
  return 'https://api.bamboopayment.com/v3/api';
}

function validateCreatePaymentRequest(payload: CreatePaymentRequest): string[] {
  const errors: string[] = [];

  if (!isStringNonEmpty(payload.TargetCountryISO)) {
    errors.push('TargetCountryISO is required and must be a non-empty string.');
  }

  if (!isStringNonEmpty(payload.Currency)) {
    errors.push('Currency is required and must be a non-empty string.');
  }

  if (!isIntegerNonNegative(payload.Amount)) {
    errors.push('Amount is required and must be a non-negative integer (minor units).');
  }

  if (!isStringNonEmpty(payload.Order)) {
    errors.push('Order is required and must be a non-empty string.');
  }

  if (!isObject(payload.Customer)) {
    errors.push('Customer is required and must be an object.');
  } else {
    if (!isStringNonEmpty(payload.Customer.Email)) {
      errors.push('Customer.Email is required and must be a non-empty string.');
    } else if (!validateEmail(payload.Customer.Email)) {
      errors.push('Customer.Email must be a valid email address.');
    }

    if (payload.Customer.Address && !isObject(payload.Customer.Address)) {
      errors.push('Customer.Address, if provided, must be an object.');
    }
  }

  if (payload.CardData) {
    const cd = payload.CardData;
    if (!isStringNonEmpty(cd.CardHolderName)) {
      errors.push('CardData.CardHolderName is required and must be a non-empty string.');
    }
    if (!isStringNonEmpty(cd.Pan)) {
      errors.push('CardData.Pan is required and must be a non-empty string.');
    }
    if (!isStringNonEmpty(cd.CVV)) {
      errors.push('CardData.CVV is required and must be a non-empty string.');
    }
    if (!isStringNonEmpty(cd.Expiration)) {
      errors.push('CardData.Expiration is required and must be a non-empty string in MM/YY format.');
    } else if (!validateExpiration(cd.Expiration)) {
      errors.push('CardData.Expiration must be in MM/YY format (e.g., 05/25).');
    }
    if (!isStringNonEmpty(cd.Email)) {
      errors.push('CardData.Email is required and must be a non-empty string.');
    } else if (!validateEmail(cd.Email)) {
      errors.push('CardData.Email must be a valid email address.');
    }
  }

  if (payload.NetworkToken) {
    if (!isStringNonEmpty(payload.PaymentMethod)) {
      errors.push('PaymentMethod is required when NetworkToken is provided.');
    }
    if (!isObject(payload.NetworkToken)) {
      errors.push('NetworkToken must be an object if provided.');
    }
  }

  // optional numeric fields checks
  if (payload.Tip !== undefined && !isIntegerNonNegative(payload.Tip)) {
    errors.push('Tip, if provided, must be a non-negative integer (minor units).');
  }
  if (payload.TaxableAmount !== undefined && !isIntegerNonNegative(payload.TaxableAmount)) {
    errors.push('TaxableAmount, if provided, must be a non-negative integer (minor units).');
  }
  if (payload.Installments !== undefined) {
    if (typeof payload.Installments !== 'number' || !Number.isInteger(payload.Installments) || payload.Installments < 1) {
      errors.push('Installments, if provided, must be an integer >= 1.');
    }
  }
  if (payload.UniqueID !== undefined && !isStringNonEmpty(payload.UniqueID)) {
    errors.push('UniqueID, if provided, must be a non-empty string.');
  }

  return errors;
}

/* ----------------- Main Function ----------------- */

async function createPayment(
  request: CreatePaymentRequest,
  options: CreatePaymentOptions
): Promise<CreatePaymentResponse> {
  if (!isObject(options) || !isStringNonEmpty(options.apiKey)) {
    throw new PaymentError('VALIDATION_ERROR', 'options.apiKey is required and must be a non-empty string.');
  }

  const validationErrors = validateCreatePaymentRequest(request);
  if (validationErrors.length > 0) {
    throw new PaymentError('VALIDATION_ERROR', 'Request validation failed.', { errors: validationErrors });
  }

  const env: Environment = options.environment ?? 'production';
  const baseUrl = buildBaseUrl(env, options.baseUrl);
  const endpoint = `${baseUrl}/purchase`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${options.apiKey}`,
  };
  if (options.lang && isStringNonEmpty(options.lang)) {
    headers['lang'] = options.lang;
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  let timeoutHandle: number | undefined;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  if (controller) {
    timeoutHandle = setTimeout(() => {
      try {
        controller.abort();
      } catch {
        // ignore
      }
    }, timeoutMs) as unknown as number;
  }

  let resp: Response;
  try {
    resp = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
      signal: controller ? controller.signal : undefined,
    });
  } catch (err) {
    // Clear timeout
    if (timeoutHandle !== undefined) {
      clearTimeout(timeoutHandle);
    }

    // Distinguish abort (timeout) vs other network errors
    if ((err as Error).name === 'AbortError') {
      throw new PaymentError('NETWORK_ERROR', `Request timed out after ${timeoutMs}ms.`, { timeoutMs });
    }
    throw new PaymentError('NETWORK_ERROR', 'Network error while making payment request.', { originalError: err as unknown });
  }

  if (timeoutHandle !== undefined) {
    clearTimeout(timeoutHandle);
  }

  const contentType = resp.headers.get('content-type') ?? '';

  const parseJsonSafe = async <T>(): Promise<T | null> => {
    try {
      if (contentType.includes('application/json')) {
        const parsed = (await resp.json()) as T;
        return parsed;
      }
      // if not JSON, attempt to read text and return null to allow error handling
      await resp.text();
      return null;
    } catch {
      return null;
    }
  };

  const parsedBody = await parseJsonSafe<unknown>();

  if (resp.ok) {
    // 2xx success
    if (!isObject(parsedBody)) {
      throw new PaymentError('API_ERROR', 'API returned an unexpected response format.', { status: resp.status, body: parsedBody });
    }

    // Minimal runtime validation for important response fields
    const bodyObj = parsedBody as Record<string, unknown>;
    if (!isStringNonEmpty(bodyObj.TransactionId)) {
      throw new PaymentError('API_ERROR', 'API response missing TransactionId or it is invalid.', { body: parsedBody });
    }
    if (!isStringNonEmpty(bodyObj.Result)) {
      throw new PaymentError('API_ERROR', 'API response missing Result or it is invalid.', { body: parsedBody });
    }
    if (!isStringNonEmpty(bodyObj.Status)) {
      throw new PaymentError('API_ERROR', 'API response missing Status or it is invalid.', { body: parsedBody });
    }
    if (!isStringNonEmpty(bodyObj.Created)) {
      throw new PaymentError('API_ERROR', 'API response missing Created or it is invalid.', { body: parsedBody });
    }
    if (!isIntegerNonNegative(bodyObj.Amount as unknown)) {
      throw new PaymentError('API_ERROR', 'API response missing Amount or it is invalid.', { body: parsedBody });
    }
    if (!isStringNonEmpty(bodyObj.Currency)) {
      throw new PaymentError('API_ERROR', 'API response missing Currency or it is invalid.', { body: parsedBody });
    }

    // Cast to typed response after minimal checks
    const typedResponse = parsedBody as CreatePaymentResponse;
    return typedResponse;
  }

  // Non-OK responses
  // Try to extract API error payload if available
  if (isObject(parsedBody)) {
    const bodyObj = parsedBody as Record<string, unknown>;
    if (isStringNonEmpty(bodyObj.ErrorCode) || isStringNonEmpty(bodyObj.ErrorDescription)) {
      const apiErr: ApiErrorResponse = {
        ErrorCode: String(bodyObj.ErrorCode ?? ''),
        ErrorDescription: String(bodyObj.ErrorDescription ?? ''),
      };
      throw new PaymentError('API_ERROR', `API responded with status ${resp.status}: ${apiErr.ErrorDescription}`, { status: resp.status, apiError: apiErr });
    }
  }

  // If JSON but unexpected or non-json body
  const rawText = contentType.includes('application/json') ? JSON.stringify(parsedBody) : await resp.text().catch(() => '<unreadable>');
  throw new PaymentError('API_ERROR', `API responded with HTTP ${resp.status}`, { status: resp.status, body: rawText });
}

/* ----------------- Exported items ----------------- */

// Export types and function for external usage
export {
  createPayment,
  CreatePaymentRequest,
  CreatePaymentResponse,
  CreatePaymentOptions,
  PaymentError,
  PaymentError as TransactionError, // alias for consumer convenience
};