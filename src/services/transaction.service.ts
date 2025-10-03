import { getAppConfig, resolveApiUrl } from "../config";
import { HttpService } from "../utils/httpService";
import { getHeaders, handleError } from "../utils/utilsService";
import { Logger } from "../utils/logger";
import { CustomError, NOT_IMPLEMENTED } from "../utils/error";
import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  GetPaymentResponse,
  CancelPaymentResponse,
} from "../interfaces/bamboopayments.interface";

export interface MerchantContext {
  token: string;
}

export interface CreateTransactionOptions {
  useSecureApi?: boolean; // when true use secure-api.bamboopayment.com (PCI direct card flow)
  headers?: Record<string, string>;
  validate?: boolean; // advisory only — SDK will not perform blocking validation by default
}

export class TransactionService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public async createTransaction(
    payload: CreatePaymentRequest,
    options: CreateTransactionOptions = {},
  ): Promise<CreatePaymentResponse> {
    const { debug } = getAppConfig();

    const baseUrl = resolveApiUrl(options.useSecureApi ?? false);

    const headers = { ...getHeaders(this.token), ...(options.headers || {}) };

    const httpService = new HttpService("v3/api", { baseURL: `${baseUrl}/`, headers });

    try {
      const response = await httpService.post<CreatePaymentResponse>("purchase", { data: payload });
      if (debug) Logger.info({ msg: "createTransaction response", response });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async getTransactionById(transactionId: string): Promise<GetPaymentResponse> {
    if (!transactionId) throw new CustomError("transactionId is required", { statusCode: 400, code: "INVALID_ARGUMENT" });
    const { apiUrl, debug } = getAppConfig();
    const headers = getHeaders(this.token);
    const httpService = new HttpService("v3/api", { baseURL: `${apiUrl}/`, headers });

    try {
      const response = await httpService.get<GetPaymentResponse>(`Purchase/${encodeURIComponent(transactionId)}`);
      if (debug) Logger.info({ msg: "getTransactionById response", response });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async getTransactionByOrder(order: string): Promise<GetPaymentResponse> {
    if (!order) throw new CustomError("order is required", { statusCode: 400, code: "INVALID_ARGUMENT" });
    const { apiUrl, debug } = getAppConfig();
    const headers = getHeaders(this.token);
    const httpService = new HttpService("v3/api", { baseURL: `${apiUrl}/`, headers });

    try {
      const response = await httpService.get<GetPaymentResponse>(`Purchase/order/${encodeURIComponent(order)}`);
      if (debug) Logger.info({ msg: "getTransactionByOrder response", response });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async getTransactionByUniqueId(uniqueId: string): Promise<GetPaymentResponse> {
    if (!uniqueId) throw new CustomError("uniqueId is required", { statusCode: 400, code: "INVALID_ARGUMENT" });
    const { apiUrl, debug } = getAppConfig();
    const headers = getHeaders(this.token);
    const httpService = new HttpService("v3/api", { baseURL: `${apiUrl}/`, headers });

    try {
      const response = await httpService.get<GetPaymentResponse>(`Purchase/uniqueId/${encodeURIComponent(uniqueId)}`);
      if (debug) Logger.info({ msg: "getTransactionByUniqueId response", response });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * Cancel a transaction fully or partially.
   * If amount is omitted the API will attempt to cancel the full original amount.
   */
  public async cancelTransaction(transactionId: string, amount?: number): Promise<CancelPaymentResponse> {
    if (!transactionId) throw new CustomError("transactionId is required", { statusCode: 400, code: "INVALID_ARGUMENT" });
    const { apiUrl, debug } = getAppConfig();
    const headers = getHeaders(this.token);
    const httpService = new HttpService("v3/api", { baseURL: `${apiUrl}/`, headers });

    try {
      const body = typeof amount === "number" ? { Amount: amount } : {};
      const response = await httpService.post<CancelPaymentResponse>(`purchase/${encodeURIComponent(transactionId)}/cancel`, { data: body });
      if (debug) Logger.info({ msg: "cancelTransaction response", response });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * Refund is not implemented in the provided BambooPayments API spec. Return a NOT_IMPLEMENTED error.
   */
  public async refundTransaction(): Promise<never> {
    throw new CustomError("Refund operation is not implemented for BambooPayments in this SDK", { statusCode: 501, code: NOT_IMPLEMENTED });
  }
}

// Convenience helpers following existing SDK patterns: functions that accept merchant context first
export async function createTransaction(
  merchant: MerchantContext,
  payload: CreatePaymentRequest,
  options?: CreateTransactionOptions,
): Promise<CreatePaymentResponse> {
  const svc = new TransactionService(merchant.token);
  return svc.createTransaction(payload, options);
}

export async function getTransaction(
  merchant: MerchantContext,
  identifiers: { transactionId?: string; order?: string; uniqueId?: string },
): Promise<GetPaymentResponse> {
  const svc = new TransactionService(merchant.token);
  if (identifiers.transactionId) return svc.getTransactionById(identifiers.transactionId);
  if (identifiers.order) return svc.getTransactionByOrder(identifiers.order);
  if (identifiers.uniqueId) return svc.getTransactionByUniqueId(identifiers.uniqueId);
  throw new CustomError("One of transactionId, order, or uniqueId must be provided", { statusCode: 400, code: "INVALID_ARGUMENT" });
}

export async function cancelTransaction(
  merchant: MerchantContext,
  transactionId: string,
  amount?: number,
): Promise<CancelPaymentResponse> {
  const svc = new TransactionService(merchant.token);
  return svc.cancelTransaction(transactionId, amount);
}

export async function refundTransaction(): Promise<never> {
  // Expose the same behavior as the class method
  throw new CustomError("Refund operation is not implemented for BambooPayments in this SDK", { statusCode: 501, code: NOT_IMPLEMENTED });
}
