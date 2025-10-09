export function needFormat(data: unknown) {
	return typeof data !== 'string' && typeof data !== 'number';
}

export function isHttpResponse(obj: any) {
	return (
		!!obj &&
		Object.prototype.hasOwnProperty.call(obj, 'data') &&
		Object.prototype.hasOwnProperty.call(obj, 'status') &&
		Object.prototype.hasOwnProperty.call(obj, 'statusText') &&
		Object.prototype.hasOwnProperty.call(obj, 'headers') &&
		Object.prototype.hasOwnProperty.call(obj, 'config') &&
		Object.prototype.hasOwnProperty.call(obj, 'request')
	);
}

export function validationFormat(format: any) {
	return {
		isNeedFormat: needFormat(format),
		isHttpInstance: isHttpResponse(format)
	};
}

/**
 * Checks if a given status code is valid based on being a number within the valid HTTP status code range (100 to 599).
 *
 * @param {unknown} statusCode - The status code to be validated.
 * @returns {boolean} Returns true if the status code is valid; otherwise, returns false.
 */
export function isValidStatusCode(statusCode: unknown): boolean {
	return !!statusCode && typeof statusCode === 'number' && statusCode >= 100 && statusCode < 600;
}

// BambooPayments specific lightweight validators (exported but NOT automatically used by services)
// Note: Per SDK guidance, the SDK does not perform strict validation of request bodies before sending them.
// These helpers can be used by integrators if they want client-side validation.

import { CustomError } from './error';

export const validateAmount = (amount: unknown): asserts amount is number => {
	if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
		throw new CustomError('Invalid amount. Amount must be an integer greater than zero.', { statusCode: 400 });
	}
};

export const validateCreateTransactionRequest = (req: any) => {
	if (!req || typeof req !== 'object') {
		throw new CustomError('Invalid request payload', { statusCode: 400 });
	}

	if (!req.TargetCountryISO || typeof req.TargetCountryISO !== 'string') {
		throw new CustomError('TargetCountryISO is required and must be a string', { statusCode: 400 });
	}

	if (!req.Currency || typeof req.Currency !== 'string') {
		throw new CustomError('Currency is required and must be a string', { statusCode: 400 });
	}

	if (req.Amount === undefined) {
		throw new CustomError('Amount is required', { statusCode: 400 });
	}

	validateAmount(req.Amount);

	if (!req.Order || typeof req.Order !== 'string') {
		throw new CustomError('Order is required and must be a string', { statusCode: 400 });
	}

	// Customer.Email is recommended unless using CommerceToken flows. We do a light check if Customer is present.
	if (req.Customer && (!req.Customer.Email || typeof req.Customer.Email !== 'string')) {
		throw new CustomError('Customer.Email must be a string when Customer is provided', { statusCode: 400 });
	}
};

export const validateCardData = (card: any) => {
	if (!card || typeof card !== 'object') {
		throw new CustomError('CardData must be an object', { statusCode: 400 });
	}

	const required = ['CardHolderName', 'Pan', 'CVV', 'Expiration', 'Email'];

	for (const key of required) {
		if (!card[key] || typeof card[key] !== 'string') {
			throw new CustomError(`${key} is required in CardData and must be a string`, { statusCode: 400 });
		}
	}
};
