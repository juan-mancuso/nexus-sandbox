import { getAppConfig, setAppConfig } from './config';

// Services
import { authenticate } from './services/auth.service';
import CheckoutService from './services/checkout.service';
import TransactionService from './services/transaction.service';
import * as ClientTypes from './interfaces/client.interface';
import * as BambooTypes from './interfaces/bamboopayments.interface';

class ClientSDK {
	merchant: {
		token: string;
	};

	Checkout: CheckoutService;

	Transaction: TransactionService;

	constructor(token: string) {
		this.merchant = {
			token
		};
		this.Checkout = new CheckoutService(token);
		this.Transaction = new TransactionService(token);
	}
}

export {
	ClientSDK,
	ClientTypes,
	BambooTypes,
	authenticate,

	// SDK Configuration
	getAppConfig,
	setAppConfig
};
