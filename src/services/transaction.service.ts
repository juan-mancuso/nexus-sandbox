import { GetTransactionsResponse, Merchant } from '../interfaces/client.interface';
import { getAppConfig } from '../config';
import { handleError, getHeaders } from '../utils/utilsService';
import { HttpService } from '../utils/httpService';
import { Logger } from '../utils/logger';

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

const getTransaction = async (merchant: Merchant, receiptNo: string) => {
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

export default class TransactionService {
	merchant: {
		token: string;
	};

	constructor(token: string) {
		this.merchant = {
			token
		};
	}

	getTransactions = () => getTransactions(this.merchant);

	getTransaction = (receiptNo: string) => getTransaction(this.merchant, receiptNo);
}
