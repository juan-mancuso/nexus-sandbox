import { getAppConfig } from '../config';
import { handleError, getHeaders } from '../utils/utilsService';
import { HttpService } from '../utils/httpService';
import { Logger } from '../utils/logger';
import {
	CreateTransactionRequest,
	PurchaseResponse,
	CancelTransactionRequest,
	CancelTransactionResponse,
	GetTransactionResponse
} from '../interfaces/test1.interface';

import { Merchant } from '../interfaces/client.interface';
import { validateCreateTransactionPayload, validateCancelPayload } from '../utils/validation';

const createTransaction = async (merchant: Merchant, payload: CreateTransactionRequest) => {
	const { apiUrl, secureApiUrl, debug } = getAppConfig();

	try {
		// Basic payload validation (will throw descriptive errors)
		validateCreateTransactionPayload(payload);

		const useSecure = !!payload.CardData;
		const base = useSecure ? secureApiUrl ?? apiUrl : apiUrl;

		const headers = getHeaders(merchant.token, {});

		const httpService = new HttpService('api/', {
			baseURL: `${base}/`,
			headers
		});

		const response = await httpService.post<PurchaseResponse>('purchase', { data: payload });

		if (debug) Logger.info(response);

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const getTransactionById = async (merchant: Merchant, transactionId: string) => {
	const { apiUrl, debug } = getAppConfig();

	if (!transactionId) {
		return handleError(new Error('TransactionId is required'));
	}

	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('api/Purchase', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetTransactionResponse>(`${transactionId}`);

		if (debug) Logger.info(response);

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const getTransactionByOrder = async (merchant: Merchant, order: string) => {
	const { apiUrl, debug } = getAppConfig();

	if (!order) return handleError(new Error('Order is required'));

	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('api/Purchase/order', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetTransactionResponse>(`${order}`);

		if (debug) Logger.info(response);

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const getTransactionByUniqueId = async (merchant: Merchant, uniqueId: string) => {
	const { apiUrl, debug } = getAppConfig();

	if (!uniqueId) return handleError(new Error('UniqueId is required'));

	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('api/Purchase/uniqueId', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetTransactionResponse>(`${uniqueId}`);

		if (debug) Logger.info(response);

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const cancelTransaction = async (merchant: Merchant, transactionId: string, body?: CancelTransactionRequest) => {
	const { apiUrl, debug } = getAppConfig();

	if (!transactionId) return handleError(new Error('TransactionId is required'));

	try {
		validateCancelPayload(body);

		const headers = getHeaders(merchant.token);

		const httpService = new HttpService('api/purchase', {
			baseURL: `${apiUrl}/`,
			headers
		});

		const url = `${transactionId}/cancel`;

		const response = await httpService.post<CancelTransactionResponse>(url, { data: body ?? {} });

		if (debug) Logger.info(response);

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

// RefundTransaction maps to cancelTransaction partial amount (BambooPayment exposes cancel endpoint for refunds)
const refundTransaction = async (merchant: Merchant, transactionId: string, amount: number) => {
	if (!transactionId) return handleError(new Error('TransactionId is required'));

	try {
		if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
			throw new Error('Amount must be a number greater than zero');
		}

		return cancelTransaction(merchant, transactionId, { Amount: amount });
	} catch (error) {
		return handleError(error);
	}
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

	createTransaction = (payload: CreateTransactionRequest) => createTransaction(this.merchant, payload);

	getTransaction = (transactionId: string) => getTransactionById(this.merchant, transactionId);

	getTransactionByOrder = (order: string) => getTransactionByOrder(this.merchant, order);

	getTransactionByUniqueId = (uniqueId: string) => getTransactionByUniqueId(this.merchant, uniqueId);

	cancelTransaction = (transactionId: string, body?: CancelTransactionRequest) => cancelTransaction(this.merchant, transactionId, body);

	refundTransaction = (transactionId: string, amount: number) => refundTransaction(this.merchant, transactionId, amount);
}
