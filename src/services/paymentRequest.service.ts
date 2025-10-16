import { getAppConfig } from '../config';
import { handleError, getBearerHeaders } from '../utils/utilsService';
import { Logger } from '../utils/logger';
import { HttpService } from '../utils/httpService';
import { ModoMerchant, CreateModoPaymentRequest, CreateModoPaymentResponse, GetModoPaymentResponse, RefundModoResponse } from '../interfaces/modo.interface';

const BASE_PATH = 'v2/payment-requests';

const createTransaction = async (merchant: ModoMerchant, payload: CreateModoPaymentRequest): Promise<CreateModoPaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<CreateModoPaymentResponse>('', { data: payload });

		if (debug) Logger.info(response);

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const getTransaction = async (merchant: ModoMerchant, paymentRequestId: string): Promise<GetModoPaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetModoPaymentResponse>(`${paymentRequestId}/data`);

		if (debug) Logger.info(response);

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const refundTransaction = async (merchant: ModoMerchant, paymentRequestId: string, amount?: number | string): Promise<RefundModoResponse> => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService(BASE_PATH, {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const body = typeof amount !== 'undefined' ? { amount } : {};
		const response = await httpService.post<RefundModoResponse>(`${paymentRequestId}/refund`, { data: body });

		if (debug) Logger.info(response);

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

/**
 * cancelTransaction
 * Modo API does not expose a separate cancel endpoint in the provided spec.
 * The SDK implements cancelTransaction as a full refund (refund without amount)
 * which is the recommended fallback to cancel a payment request.
 */
const cancelTransaction = async (merchant: ModoMerchant, paymentRequestId: string): Promise<RefundModoResponse> => {
	// perform full refund by calling refund endpoint without amount
	return refundTransaction(merchant, paymentRequestId);
};

export default class PaymentRequestService {
	merchant: ModoMerchant;

	constructor(token: string, expires_in?: number) {
		if (typeof expires_in !== 'undefined') {
			this.merchant = { token, expires_in } as ModoMerchant;
		} else {
			this.merchant = { token } as ModoMerchant;
		}
	}

	createTransaction = (payload: CreateModoPaymentRequest) => createTransaction(this.merchant, payload);

	getTransaction = (paymentRequestId: string) => getTransaction(this.merchant, paymentRequestId);

	refundTransaction = (paymentRequestId: string, amount?: number | string) => refundTransaction(this.merchant, paymentRequestId, amount);

	cancelTransaction = (paymentRequestId: string) => cancelTransaction(this.merchant, paymentRequestId);
}
