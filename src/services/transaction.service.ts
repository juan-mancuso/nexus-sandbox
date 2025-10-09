import { getAppConfig } from '../config';
import { handleError, getHeaders } from '../utils/utilsService';
import { HttpService } from '../utils/httpService';
import { Logger } from '../utils/logger';
import { Merchant } from '../interfaces/client.interface';
import {
	CreatePaymentRequest,
	CreatePaymentResponse,
	GetPaymentResponse,
	RefundResponse
} from '../interfaces/modotesting2.interface';

// Legacy interfaces (kept for backward compatibility in existing methods)
import { GetTransactionsResponse } from '../interfaces/client.interface';

// Legacy: getTransactions (payments endpoint) — preserved
const getTransactions = async (merchant: Merchant) => {
	const { apiUrl, debug } = getAppConfig();

	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetTransactionsResponse>('payments');

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

// Legacy: getTransaction by receiptNo (payments/receipt-no) — preserved
const getTransactionByReceipt = async (merchant: Merchant, receiptNo: string) => {
	const { apiUrl, debug } = getAppConfig();

	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('payments/receipt-no', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetTransactionsResponse>(receiptNo);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

// New API: create payment request -> POST /v2/payment-requests/
const createPayment = async (merchant: Merchant, body: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<CreatePaymentResponse>('v2/payment-requests/', { data: body });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

// New API: get payment details -> GET /v2/payment-requests/{payment_request_id}/data
const getPaymentDetails = async (merchant: Merchant, paymentRequestId: string): Promise<GetPaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const url = `v2/payment-requests/${encodeURIComponent(paymentRequestId)}/data`;
		const response = await httpService.get<GetPaymentResponse>(url);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

// New API: refund -> POST /v2/payment-requests/{payment_request_id}/refund with optional { amount }
const refundPayment = async (merchant: Merchant, paymentRequestId: string, amount?: number): Promise<RefundResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const url = `v2/payment-requests/${encodeURIComponent(paymentRequestId)}/refund`;
		const payload = typeof amount === 'number' ? { amount } : {};
		const response = await httpService.post<RefundResponse>(url, { data: payload });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

// New API: cancel -> for now perform a full refund (POST refund with no amount)
const cancelPayment = async (merchant: Merchant, paymentRequestId: string): Promise<RefundResponse> => {
	try {
		// Full refund: call refund with no amount
		const result = await refundPayment(merchant, paymentRequestId);
		return result;
	} catch (error) {
		// Wrap error to provide clearer context
		throw error; // handleError already normalized errors
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

	// Legacy methods
	getTransactions = () => getTransactions(this.merchant);
	getTransactionByReceipt = (receiptNo: string) => getTransactionByReceipt(this.merchant, receiptNo);

	// New payment-requests methods
	createTransaction = (body: CreatePaymentRequest) => createPayment(this.merchant, body);
	createPayment = (body: CreatePaymentRequest) => createPayment(this.merchant, body); // alias

	getTransaction = (paymentRequestId: string) => getPaymentDetails(this.merchant, paymentRequestId); // implements required getTransaction for new API
	getPaymentDetails = (paymentRequestId: string) => getPaymentDetails(this.merchant, paymentRequestId); // alias

	refundTransaction = (paymentRequestId: string, amount?: number) => refundPayment(this.merchant, paymentRequestId, amount);
	refundPayment = (paymentRequestId: string, amount?: number) => refundPayment(this.merchant, paymentRequestId, amount); // alias

	cancelTransaction = (paymentRequestId: string) => cancelPayment(this.merchant, paymentRequestId);
	cancelPayment = (paymentRequestId: string) => cancelPayment(this.merchant, paymentRequestId); // alias
}
