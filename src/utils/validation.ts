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
 * Validate amount: up to 13 characters total, with up to 2 decimal places.
 * Accepts number or string.
 */
export function isValidAmount(amount: number | string): boolean {
	if (amount === null || amount === undefined) return false;
	const str = typeof amount === 'number' ? amount.toFixed(2) : String(amount);
	// Allow up to 11 digits before decimal and up to 2 decimals => 13 chars max
	const regex = /^\d{1,11}(\.\d{1,2})?$/;
	return regex.test(str);
}

/**
 * Validate expiration date: must be ISO8601 and between 5 and 10 minutes in the future (if provided).
 */
export function isValidExpirationDate(expiration?: string): boolean {
	if (!expiration) return true; // optional
	const date = new Date(expiration);
	if (Number.isNaN(date.getTime())) return false;
	const now = Date.now();
	const diff = date.getTime() - now;
	const min = 5 * 60 * 1000; // 5 minutes
	const max = 10 * 60 * 1000; // 10 minutes
	return diff >= min && diff <= max;
}
