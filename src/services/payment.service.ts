import { getAppConfig } from '../config';
import { HttpService } from '../utils/httpService';
import { Logger } from '../utils/logger';
import { getHeaders, handleError } from '../utils/utilsService';
import {
	CreatePaymentRequest,
	CreatePaymentResponse,
	Merchant,
	ErrorResponse
} from '../interfaces/client.interface';
import { CustomError } from '../utils/error';

class PaymentError extends CustomError {
	constructor(message: string, options?: { statusCode?: number; data?: unknown }) {
		super(message, { statusCode: options?.statusCode, data: options?.data });
	}
}

/**
 * Create a payment (purchase).
 * - If CardData is present in the request, the secure API endpoint will be used.
 * - If TrxToken is provided it will be sent as a TrxToken header.
 */
const createPayment = async (merchant: Merchant, payload: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
	const { apiUrl, secureApiUrl, debug } = getAppConfig();

	if (!merchant || !merchant.token) {
		throw new PaymentError('Missing merchant token');
	}

	if (!payload) {
		throw new PaymentError('Missing payment payload');
	}

	// Minimal runtime validation for required fields (shallow only)
	if (!payload.TargetCountryISO || typeof payload.TargetCountryISO !== 'string') {
		throw new PaymentError('TargetCountryISO is required and must be a string');
	}
	if (!payload.Currency || typeof payload.Currency !== 'string') {
		throw new PaymentError('Currency is required and must be a string');
	}
	if (typeof payload.Amount !== 'number' || payload.Amount <= 0) {
		throw new PaymentError('Amount is required and must be a number greater than zero');
	}
	if (!payload.Order || typeof payload.Order !== 'string') {
		throw new PaymentError('Order is required and must be a string');
	}
	if (!payload.Customer || !payload.Customer.Email) {
		throw new PaymentError('Customer with Email is required');
	}

	// Choose base URL depending on presence of CardData (PCI direct flow -> secure endpoint)
	const useSecure = !!payload.CardData;
	const baseURL = useSecure ? secureApiUrl ?? apiUrl : apiUrl;

	if (useSecure && !secureApiUrl) {
		throw new PaymentError('Secure API URL not configured for PCI direct card flow');
	}

	const headers = getHeaders(merchant.token);
	if ((payload as any).TrxToken && typeof (payload as any).TrxToken === 'string') {
		// TrxToken is expected as header in the Bamboo API
		(headers as Record<string, string>)['TrxToken'] = (payload as any).TrxToken;
	}

	const httpService = new HttpService('', {
		baseURL: `${baseURL}/`,
		headers
	});

	try {
		// The API expects a POST to /purchase
		const response = await httpService.post<CreatePaymentResponse | ErrorResponse>('purchase', { data: payload });

		if (debug) {
			Logger.info(response);
		}

		const data = response.data as CreatePaymentResponse | ErrorResponse;

		// If the API returns an ErrorCode/ErrorDescription, treat it as an error
		if ((data as ErrorResponse).ErrorCode) {
			throw new PaymentError('API returned an error', { statusCode: 400, data });
		}

		return data as CreatePaymentResponse;
	} catch (error) {
		return handleError(error);
	}
};

/**
 * Retrieve payment details. Supports lookup by TransactionId, Order or UniqueId.
 * Pass one of: transactionId, order, uniqueId.
 */
const getPaymentDetails = async (
	merchant: Merchant,
	options: { transactionId?: string; order?: string; uniqueId?: string }
): Promise<CreatePaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();

	if (!merchant || !merchant.token) {
		throw new PaymentError('Missing merchant token');
	}

	if (!options || (!options.transactionId && !options.order && !options.uniqueId)) {
		throw new PaymentError('Provide transactionId, order or uniqueId to retrieve payment details');
	}

	const headers = getHeaders(merchant.token);
	const httpService = new HttpService('', {
		baseURL: `${apiUrl}/`,
		headers
	});

	let path = '';
	let param = '';

	if (options.transactionId) {
		path = 'Purchase/';
		param = options.transactionId;
	} else if (options.order) {
		path = 'Purchase/order/';
		param = options.order;
	} else if (options.uniqueId) {
		path = 'Purchase/uniqueId/';
		param = options.uniqueId;
	}

	try {
		const response = await httpService.get<CreatePaymentResponse>(`${path}${param}`);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

/**
 * Cancel a payment (full or partial).
 * - transactionId: required path param
 * - amount: optional body param for partial cancel (amount in smallest unit)
 */
const cancelPayment = async (merchant: Merchant, transactionId: string, amount?: number): Promise<CreatePaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();

	if (!merchant || !merchant.token) {
		throw new PaymentError('Missing merchant token');
	}

	if (!transactionId || typeof transactionId !== 'string') {
		throw new PaymentError('transactionId is required');
	}

	const headers = getHeaders(merchant.token);
	const httpService = new HttpService('', {
		baseURL: `${apiUrl}/`,
		headers
	});

	const body: { Amount?: number } = {};
	if (typeof amount === 'number') {
		if (amount <= 0) {
			throw new PaymentError('If provided, amount must be greater than zero');
		}
		body.Amount = amount;
	}

	try {
		const response = await httpService.post<CreatePaymentResponse | ErrorResponse>(`purchase/${transactionId}/cancel`, { data: body });

		if (debug) {
			Logger.info(response);
		}

		const data = response.data as CreatePaymentResponse | ErrorResponse;

		if ((data as ErrorResponse).ErrorCode) {
			throw new PaymentError('API returned an error during cancel', { statusCode: 400, data });
		}

		return data as CreatePaymentResponse;
	} catch (error) {
		return handleError(error);
	}
};

export default class PaymentService {
	merchant: Merchant;

	constructor(token: string) {
		this.merchant = { token };
	}

	createPayment = (payload: CreatePaymentRequest) => createPayment(this.merchant, payload);
	getPaymentDetails = (options: { transactionId?: string; order?: string; uniqueId?: string }) =>
		getPaymentDetails(this.merchant, options);
	cancelPayment = (transactionId: string, amount?: number) => cancelPayment(this.merchant, transactionId, amount);
}
