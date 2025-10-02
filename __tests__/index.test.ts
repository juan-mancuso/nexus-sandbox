import CheckoutService from '../src/services/checkout.service';
import { ClientSDK } from '../src';

describe('ClientSDK', () => {
	test('stores the userId and accessToken when instantiated', () => {
		const token = 'my-token';
		const sdk = new ClientSDK(token);

		expect(sdk.merchant.token).toBe(token);
	});

	test('instantiates the Checkout service when instantiated', () => {
		const sdk = new ClientSDK('my-token');

		expect(sdk.Checkout).toBeInstanceOf(CheckoutService);
	});
});
