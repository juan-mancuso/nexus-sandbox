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

/**
 * Modo specific validators
 */
export function isValidAmount(amount: string | number | undefined): boolean {
	if (typeof amount === 'undefined' || amount === null) return false;

	let str: string;

	if (typeof amount === 'number') {
		// ensure at most 2 decimals
		if (!Number.isFinite(amount)) return false;
		str = amount.toFixed(2);
	} else {
		str = amount;
	}

	// must be numeric with up to 2 decimals and total length <= 13
	const matches = /^\d{1,10}(?:\.\d{1,2})?$/.test(str);
	return matches && str.length <= 13;
}

export function isValidExpirationDate(dateStr: string | undefined): boolean {
	if (!dateStr) return true; // optional field

	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return false;

	const now = Date.now();
	const diffMs = date.getTime() - now;
	const diffMin = diffMs / 60000;

	// must be at least 5 minutes and at most 10 minutes in the future
	return diffMin >= 5 && diffMin <= 10;
}

export function isValidExternalIntentionId(id: string | undefined): boolean {
	if (!id) return false;
	return typeof id === 'string' && id.trim().length > 0 && id.length <= 255;
}