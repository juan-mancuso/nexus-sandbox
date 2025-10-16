import { CreatePaymentRequest, CreatePaymentResponse, GetPaymentResponse, ModoMerchant, RefundPaymentRequest, RefundPaymentResponse } from '../interfaces/modo.interface';
import { getAppConfig } from '../config';
import { handleError, getBearerHeaders } from '../utils/utilsService';
import { Logger } from '../utils/logger';
import { HttpService } from '../utils/httpService';

const BASE_PATH = 'v2/payment-requests';

const createTransaction = async (merchant: ModoMerchant, payment: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		// POST to /v2/payment-requests/
		const response = await httpService.post<CreatePaymentResponse>('', { data: payment });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const getTransaction = async (merchant: ModoMerchant, paymentRequestId: string): Promise<GetPaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		// GET /v2/payment-requests/{payment_request_id}/data
		const response = await httpService.get<GetPaymentResponse>(`${paymentRequestId}/data`);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const refundTransaction = async (merchant: ModoMerchant, paymentRequestId: string, body?: RefundPaymentRequest): Promise<RefundPaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		// POST /v2/payment-requests/{payment_request_id}/refund
		const response = await httpService.post<RefundPaymentResponse>(`${paymentRequestId}/refund`, { data: body ?? {} });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

/**
 * cancelTransaction
 * Modo does not expose a dedicated cancel endpoint. The SDK implements cancel
 * as a full refund by calling the refund endpoint without an amount. This will
 * refund the whole payment if allowed by the platform.
 */
const cancelTransaction = async (merchant: ModoMerchant, paymentRequestId: string): Promise<RefundPaymentResponse> => {
	// Cancel implemented as a full refund (no amount provided)
	return refundTransaction(merchant, paymentRequestId);
};

export default class PaymentRequestService {
	merchant: ModoMerchant;

	constructor(token: string) {
		this.merchant = { token };
	}

	createTransaction = (payment: CreatePaymentRequest) => createTransaction(this.merchant, payment);

	getTransaction = (paymentRequestId: string) => getTransaction(this.merchant, paymentRequestId);

	refundTransaction = (paymentRequestId: string, body?: RefundPaymentRequest) => refundTransaction(this.merchant, paymentRequestId, body);

	cancelTransaction = (paymentRequestId: string) => cancelTransaction(this.merchant, paymentRequestId);
}
