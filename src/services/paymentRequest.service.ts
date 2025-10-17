import { CreatePaymentRequest, CreatePaymentResponse, GetPaymentResponse, ModoMerchant, RefundRequest, RefundResponse } from '../interfaces/modo.interface';
import { getAppConfig } from '../config';
import { handleError, getBearerHeaders } from '../utils/utilsService';
import { Logger } from '../utils/logger';
import { HttpService } from '../utils/httpService';

const basePath = 'v2/payment-requests';

const createTransaction = async (merchant: ModoMerchant, payment: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService(basePath, {
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

	const httpService = new HttpService(basePath, {
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

const refundTransaction = async (
	merchant: ModoMerchant,
	paymentRequestId: string,
	refund?: RefundRequest
): Promise<RefundResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService(basePath, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		// POST /v2/payment-requests/{payment_request_id}/refund
		const data = refund && typeof refund.amount !== 'undefined' ? { amount: refund.amount } : {};
		const response = await httpService.post<RefundResponse>(`${paymentRequestId}/refund`, { data });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const cancelTransaction = async (merchant: ModoMerchant, paymentRequestId: string): Promise<RefundResponse> => {
	// Modo does not expose a dedicated "cancel" endpoint in the provided API.
	// A full cancel can be simulated by issuing a refund without an amount (the API will process a full refund).
	// This behaviour is implemented here as a convenience wrapper around refundTransaction.
	return refundTransaction(merchant, paymentRequestId);
};

export default class PaymentRequestService {
	merchant: ModoMerchant;

	constructor(token: string) {
		this.merchant = { token };
	}

	createTransaction = (payment: CreatePaymentRequest) => createTransaction(this.merchant, payment);

	getTransaction = (paymentRequestId: string) => getTransaction(this.merchant, paymentRequestId);

	refundTransaction = (paymentRequestId: string, refund?: RefundRequest) => refundTransaction(this.merchant, paymentRequestId, refund);

	cancelTransaction = (paymentRequestId: string) => cancelTransaction(this.merchant, paymentRequestId);
}
