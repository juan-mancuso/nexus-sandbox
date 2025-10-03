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

// BambooPayment specific validators
export function validateCreateTransactionPayload(payload: any) {
	if (!payload || typeof payload !== 'object') {
		throw new Error('Invalid payload: expected object');
	}

	const required = ['TargetCountryISO', 'Currency', 'Amount', 'Order'];

	for (const field of required) {
		if (payload[field] === undefined || payload[field] === null) {
			throw new Error(`Missing required field: ${field}`);
		}
	}

	if (typeof payload.Amount !== 'number' || payload.Amount <= 0) {
		throw new Error('Amount must be a number greater than zero');
	}

	if (!payload.Customer || typeof payload.Customer !== 'object') {
		// CommerceToken flows may omit Customer but our SDK expects Customer in most cases
		throw new Error('Customer object is required');
	}

	if (!payload.Customer.Email || typeof payload.Customer.Email !== 'string') {
		throw new Error('Customer.Email is required');
	}

	// If CardData is present, validate required card fields
	if (payload.CardData) {
		const cd = payload.CardData;
		const cardRequired = ['CardHolderName', 'Pan', 'CVV', 'Expiration', 'Email'];
		for (const field of cardRequired) {
			if (!cd[field]) {
				throw new Error(`CardData.${field} is required for direct PCI purchase`);
			}
		}
	}

	return true;
}

export function validateCancelPayload(payload: any) {
	if (!payload) return true;

	if (typeof payload !== 'object') {
		throw new Error('Invalid cancel payload');
	}

	if (payload.Amount !== undefined && typeof payload.Amount !== 'number') {
		throw new Error('Cancel Amount must be a number');
	}

	return true;
}
