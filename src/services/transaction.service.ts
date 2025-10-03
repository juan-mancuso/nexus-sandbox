import { Merchant, CreatePaymentRequest, CreatePaymentResponse, GetPaymentResponse, RefundPaymentRequest, RefundPaymentResponse } from '../interfaces/client.interface';
import { getAppConfig } from '../config';
import { handleError, getBearerHeaders } from '../utils/utilsService';
import { Logger } from '../utils/logger';
import { HttpService } from '../utils/httpService';
import { CustomError } from '../utils/error';

const createPayment = async (merchant: Merchant, payment: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();

	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService('', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<CreatePaymentResponse>('v2/payment-requests/', { data: payment });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const getPaymentDetails = async (merchant: Merchant, paymentRequestId: string): Promise<GetPaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();

	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService('', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetPaymentResponse>(`v2/payment-requests/${encodeURIComponent(paymentRequestId)}/data`);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const refundPayment = async (merchant: Merchant, paymentRequestId: string, body?: RefundPaymentRequest): Promise<RefundPaymentResponse> => {
	const { apiUrl, debug } = getAppConfig();

	const headers = getBearerHeaders(merchant.token);

	const httpService = new HttpService('', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<RefundPaymentResponse>(`v2/payment-requests/${encodeURIComponent(paymentRequestId)}/refund`, { data: body ?? {} });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const cancelPayment = async () => {
	// Not supported by the provided API
	throw new CustomError('Cancel payment is not implemented for modo API', { statusCode: 501 });
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

	createPayment = (payment: CreatePaymentRequest) => createPayment(this.merchant, payment);

	getPaymentDetails = (paymentRequestId: string) => getPaymentDetails(this.merchant, paymentRequestId);

	refundPayment = (paymentRequestId: string, body?: RefundPaymentRequest) => refundPayment(this.merchant, paymentRequestId, body);

	cancelPayment = () => cancelPayment();
}
