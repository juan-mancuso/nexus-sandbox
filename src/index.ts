import { getAppConfig, setAppConfig } from './config';

// Services
import { authenticate } from './services/auth.service';
import CheckoutService from './services/checkout.service';
import TransactionService from './services/transaction.service';
import PaymentRequestService from './services/paymentRequest.service';
import * as ClientTypes from './interfaces/client.interface';

class ClientSDK {
	merchant: {
		token: string;
	};

	Checkout: CheckoutService;

	Transaction: TransactionService;

	PaymentRequest: PaymentRequestService;

	constructor(token: string) {
		this.merchant = {
			token
		};
		this.Checkout = new CheckoutService(token);
		this.Transaction = new TransactionService(token);
		this.PaymentRequest = new PaymentRequestService(token);
	}
}

export {
	ClientSDK,
	ClientTypes,
	authenticate,

	// SDK Configuration
	getAppConfig,
	setAppConfig
};
