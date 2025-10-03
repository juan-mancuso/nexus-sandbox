import { Merchant } from '../interfaces/client.interface';
import { getAppConfig, secureApiUrls } from '../config';
import { handleError, getHeaders } from '../utils/utilsService';
import { HttpService } from '../utils/httpService';
import { Logger } from '../utils/logger';
import {
	CreatePaymentRequest,
	CreatePaymentResponse,
	CancelPaymentRequest,
	CancelPaymentResponse,
	GetPaymentResponse,
	RefundPaymentResponse
} from '../interfaces/bamboopayments.interface';
import { CustomError, NOT_IMPLEMENTED_ERROR_CODE } from '../utils/error';

/**
 * Creates a payment (purchase) in BambooPayments.
 * Supports standard flow and PCI direct CardData flow by toggling useSecureApi in options.
 */
const createTransaction = async (
	merchant: Merchant,
	payload: CreatePaymentRequest,
	options?: { useSecureApi?: boolean; headers?: Record<string, string> }
): Promise<CreatePaymentResponse> => {
	const { apiUrl, debug, env } = getAppConfig();
	const useSecureApi = !!options?.useSecureApi;

	const baseURL = useSecureApi ? secureApiUrls[env] : apiUrl;

	const defaultHeaders = getHeaders(merchant.token);
	const headers = { ...defaultHeaders, ...(options?.headers ?? {}) } as Record<string, string>;

	// Use base path 'v3/api' so we can call 'purchase' relative to it
	const httpService = new HttpService('v3/api', {
		baseURL: `${baseURL}/`,
		headers
	});

	try {
		const response = await httpService.post<CreatePaymentResponse>('purchase', { data: payload });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

/**
 * Retrieves a payment by TransactionId.
 */
const getTransactionById = async (merchant: Merchant, transactionId: string): Promise<GetPaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('v3/api/Purchase', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetPaymentResponse>(transactionId);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

/**
 * Retrieves a payment by Order (merchant order id).
 */
const getTransactionByOrder = async (merchant: Merchant, orderId: string): Promise<GetPaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('v3/api/Purchase', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetPaymentResponse>(`order/${orderId}`);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

/**
 * Retrieves a payment by UniqueId.
 */
const getTransactionByUniqueId = async (merchant: Merchant, uniqueId: string): Promise<GetPaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('v3/api/Purchase', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetPaymentResponse>(`uniqueId/${uniqueId}`);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

/**
 * Cancel a payment (full or partial) by TransactionId.
 */
const cancelTransaction = async (
	merchant: Merchant,
	transactionId: string,
	payload?: CancelPaymentRequest
): Promise<CancelPaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('v3/api', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<CancelPaymentResponse>(`purchase/${transactionId}/cancel`, { data: payload ?? {} });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

/**
 * Refund is not implemented in BambooPayments SDK yet — placeholder that throws NOT_IMPLEMENTED.
 */
const refundTransaction = async (_merchant: Merchant): Promise<RefundPaymentResponse> => {
	throw new CustomError('Refund not implemented for BambooPayments SDK', {
		code: NOT_IMPLEMENTED_ERROR_CODE,
		statusCode: 501,
		data: { message: 'Refund endpoint not available in this SDK placeholder' }
	});
};

export default class TransactionService {
	merchant: {
		token: string;
	};

	constructor(token: string) {
		this.merchant = {
			token
		};
	}

	createTransaction = (payload: CreatePaymentRequest, options?: { useSecureApi?: boolean; headers?: Record<string, string> }) =>
		createTransaction(this.merchant, payload, options);

	getTransactionById = (transactionId: string) => getTransactionById(this.merchant, transactionId);

	getTransactionByOrder = (orderId: string) => getTransactionByOrder(this.merchant, orderId);

	getTransactionByUniqueId = (uniqueId: string) => getTransactionByUniqueId(this.merchant, uniqueId);

	cancelTransaction = (transactionId: string, payload?: CancelPaymentRequest) => cancelTransaction(this.merchant, transactionId, payload);

	refundTransaction = () => refundTransaction(this.merchant);
}
