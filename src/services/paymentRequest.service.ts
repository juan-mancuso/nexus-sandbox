import { getAppConfig } from '../config';
import { handleError, getBearerHeaders } from '../utils/utilsService';
import { Logger } from '../utils/logger';
import { HttpService } from '../utils/httpService';
import {
	ModoMerchant,
	CreatePaymentRequest,
	CreatePaymentResponse,
	GetPaymentResponse,
	RefundResponse
} from '../interfaces/modo.interface';

const createTransaction = async (merchant: ModoMerchant, payload: CreatePaymentRequest) => {
	const { apiUrl, debug } = getAppConfig();

	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService('v2/payment-requests', {
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

const getTransaction = async (merchant: ModoMerchant, paymentRequestId: string) => {
	const { apiUrl, debug } = getAppConfig();

	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService('v2/payment-requests', {
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

const refundTransaction = async (merchant: ModoMerchant, paymentRequestId: string, amount?: number) => {
	const { apiUrl, debug } = getAppConfig();

	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService('v2/payment-requests', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const body = typeof amount === 'number' ? { amount } : {};

		const response = await httpService.post<RefundResponse>(`${paymentRequestId}/refund`, { data: body });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

/**
 * cancelTransaction: Modo does not expose a distinct "cancel" endpoint in the
 * provided API. To perform a cancel operation we call the refund endpoint
 * without an amount which will trigger a full refund. This is a best-effort
 * SDK-level convenience wrapper that performs a full refund.
 */
const cancelTransaction = async (merchant: ModoMerchant, paymentRequestId: string) => {
	return refundTransaction(merchant, paymentRequestId);
};

export default class PaymentRequestService {
	merchant: {
		token: string;
	};

	constructor(token: string) {
		this.merchant = {
			token
		};
	}

	createTransaction = (payload: CreatePaymentRequest) => createTransaction(this.merchant, payload);

	getTransaction = (paymentRequestId: string) => getTransaction(this.merchant, paymentRequestId);

	refundTransaction = (paymentRequestId: string, amount?: number) => refundTransaction(this.merchant, paymentRequestId, amount);

	cancelTransaction = (paymentRequestId: string) => cancelTransaction(this.merchant, paymentRequestId);
}
