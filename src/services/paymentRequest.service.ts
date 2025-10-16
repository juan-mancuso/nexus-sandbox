import { getAppConfig } from '../config';
import { handleError, getBearerHeaders } from '../utils/utilsService';
import { Logger } from '../utils/logger';
import { HttpService } from '../utils/httpService';
import { ModoMerchant, CreatePaymentRequest, CreatePaymentResponse, GetPaymentResponse, RefundRequest, RefundResponse } from '../interfaces/modo.interface';

const BASE_PATH = 'v2/payment-requests';

const createTransaction = async (merchant: ModoMerchant, payload: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<CreatePaymentResponse>('', { data: payload });

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
		const response = await httpService.get<GetPaymentResponse>(`${paymentRequestId}/data`);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const refundTransaction = async (merchant: ModoMerchant, paymentRequestId: string, body?: RefundRequest): Promise<RefundResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<RefundResponse>(`${paymentRequestId}/refund`, { data: body ?? {} });

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
 * Modo does not expose a dedicated "cancel" endpoint in the provided API analysis.
 * As a fallback we trigger a refund without specifying an amount to perform a full refund/cancel.
 */
const cancelTransaction = async (merchant: ModoMerchant, paymentRequestId: string): Promise<RefundResponse> => {
	// Call refund endpoint without amount to cause a full refund (as per API behaviour)
	return refundTransaction(merchant, paymentRequestId, undefined);
};

export default class PaymentRequestService {
	merchant: ModoMerchant;

	constructor(token: string, expiresIn?: number) {
		this.merchant = {
			token,
			expiresIn
		};
	}

	createTransaction = (payload: CreatePaymentRequest) => createTransaction(this.merchant, payload);

	getTransaction = (paymentRequestId: string) => getTransaction(this.merchant, paymentRequestId);

	refundTransaction = (paymentRequestId: string, body?: RefundRequest) => refundTransaction(this.merchant, paymentRequestId, body);

	cancelTransaction = (paymentRequestId: string) => cancelTransaction(this.merchant, paymentRequestId);
}
