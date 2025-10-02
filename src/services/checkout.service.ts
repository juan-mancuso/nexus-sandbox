import { CreateCheckoutRequest, CreateCheckoutResponse, GetCheckoutResponse, Merchant } from '../interfaces/client.interface';
import { getAppConfig } from '../config';
import { handleError, getHeaders } from '../utils/utilsService';
import { Logger } from '../utils/logger';
import { HttpService } from '../utils/httpService';

const createCheckout = async (merchant: Merchant, checkout: CreateCheckoutRequest) => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<CreateCheckoutResponse>('checkout', { data: checkout });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

const getCheckout = async (merchant: Merchant, paymentRequestId: string) => {
	const { apiUrl, debug } = getAppConfig();
	const headers = getHeaders(merchant.token);

	const httpService = new HttpService('checkout', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.get<GetCheckoutResponse>(paymentRequestId);

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

export default class CheckoutService {
	merchant: {
		token: string;
	};

	constructor(token: string) {
		this.merchant = {
			token
		};
	}

	createCheckout = (checkout: CreateCheckoutRequest) => createCheckout(this.merchant, checkout);

	getCheckout = (paymentRequestId: string) => getCheckout(this.merchant, paymentRequestId);
}
