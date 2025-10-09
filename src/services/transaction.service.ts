import { Merchant } from '../interfaces/client.interface';
import { getAppConfig } from '../config';
import { handleError, getHeaders } from '../utils/utilsService';
import { HttpService } from '../utils/httpService';
import { Logger } from '../utils/logger';
import {
	CreatePaymentRequest,
	CreatePaymentResponse,
	RefundResponse,
	RefundRequest,
	PaymentDetailsResponse
} from '../interfaces/modo.interface';

const BASE_PATH = 'v2/payment-requests/';

const createTransaction = async (merchant: Merchant, payment: CreatePaymentRequest) => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<CreatePaymentResponse>('', { data: payment });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const getTransaction = async (merchant: Merchant, paymentRequestId: string) => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<PaymentDetailsResponse>(`${paymentRequestId}/data`);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const refundTransaction = async (merchant: Merchant, paymentRequestId: string, refund?: RefundRequest) => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<RefundResponse>(`${paymentRequestId}/refund`, { data: refund ?? {} });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

/**
 * cancelTransaction: Modo API does not provide a dedicated cancel endpoint in the analysis.
 * We implement cancel as a full refund (no amount provided) by calling the refund endpoint
 * with no amount. If merchant requires a different behavior, replace this implementation.
 */
const cancelTransaction = async (merchant: Merchant, paymentRequestId: string) => {
	return refundTransaction(merchant, paymentRequestId);
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

	createTransaction = (payment: CreatePaymentRequest) => createTransaction(this.merchant, payment);

	getTransaction = (paymentRequestId: string) => getTransaction(this.merchant, paymentRequestId);

	refundTransaction = (paymentRequestId: string, refund?: RefundRequest) => refundTransaction(this.merchant, paymentRequestId, refund);

	cancelTransaction = (paymentRequestId: string) => cancelTransaction(this.merchant, paymentRequestId);
}

// Convenience standalone functions matching requested naming in integration guides
export const createPayment = (accessToken: string, payment: CreatePaymentRequest) => {
	const svc = new TransactionService(accessToken);
	return svc.createTransaction(payment);
};

export const getPaymentDetails = (accessToken: string, paymentRequestId: string) => {
	const svc = new TransactionService(accessToken);
	return svc.getTransaction(paymentRequestId);
};

export const cancelPayment = (accessToken: string, paymentRequestId: string) => {
	const svc = new TransactionService(accessToken);
	return svc.cancelTransaction(paymentRequestId);
};
