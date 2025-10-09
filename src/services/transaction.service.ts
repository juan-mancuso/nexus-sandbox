import { Merchant } from '../interfaces/client.interface';
import { getAppConfig } from '../config';
import { handleError, getHeaders } from '../utils/utilsService';
import { HttpService } from '../utils/httpService';
import { Logger } from '../utils/logger';
import {
	CreateTransactionRequest,
	CreateTransactionResponse,
	CancelRequest,
	CancelResponse,
	RefundRequest,
	RefundResponse,
	CaptureRequest,
	CaptureResponse,
	GetTransactionResponse
} from '../interfaces/bamboopayments.interface';

const BASE_PATH = 'v3/api';

const createTransaction = async (merchant: Merchant, payload: CreateTransactionRequest) => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<CreateTransactionResponse>('purchase', { data: payload });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const getTransactionById = async (merchant: Merchant, transactionId: string) => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetTransactionResponse>(`Purchase/${transactionId}`);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const getTransactionByOrder = async (merchant: Merchant, order: string) => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetTransactionResponse>(`Purchase/order/${order}`);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const getTransactionByUniqueId = async (merchant: Merchant, uniqueId: string) => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetTransactionResponse>(`Purchase/uniqueId/${uniqueId}`);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const captureTransaction = async (merchant: Merchant, transactionId: string, body?: CaptureRequest) => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<CaptureResponse>(`purchase/${transactionId}/capture`, { data: body ?? {} });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const cancelTransaction = async (merchant: Merchant, transactionId: string, body?: CancelRequest) => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<CancelResponse>(`purchase/${transactionId}/cancel`, { data: body ?? {} });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const refundTransaction = async (merchant: Merchant, transactionId: string, body?: RefundRequest) => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<RefundResponse>(`purchase/${transactionId}/refund`, { data: body ?? {} });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
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

	captureTransaction = (transactionId: string, body?: CaptureRequest) => captureTransaction(this.merchant, transactionId, body);

	cancelTransaction = (transactionId: string, body?: CancelRequest) => cancelTransaction(this.merchant, transactionId, body);

	refundTransaction = (transactionId: string, body?: RefundRequest) => refundTransaction(this.merchant, transactionId, body);
}
