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

// Modo-specific validators (provided for informational/use by SDK consumers).
// Note: per SDK rules we do not perform request body validation before sending; these helpers are available
// for callers who wish to pre-validate data.

export function isValidAmount(amount: unknown): boolean {
	// Accept number and numeric strings; ensure max 13 characters when serialized and at most 2 decimal places
	if (typeof amount === 'number') {
		const asString = amount.toFixed(2);
		return asString.replace('.', '').length <= 13;
	}

	if (typeof amount === 'string') {
		if (!/^-?\d+(?:\.\d{1,2})?$/.test(amount)) return false;
		return amount.replace('.', '').length <= 13;
	}

	return false;
}

export function isValidExpirationDate(dateStr: unknown): boolean {
	if (typeof dateStr !== 'string') return false;
	const date = new Date(dateStr);
	if (Number.isNaN(date.getTime())) return false;

	// Optionally enforce that expiration is between 5 and 10 minutes from now
	const now = Date.now();
	const diff = date.getTime() - now;
	const min = 5 * 60 * 1000; // 5 minutes
	const max = 10 * 60 * 1000; // 10 minutes

	return diff >= min && diff <= max;
}

export function isValidExternalIntentionId(id: unknown): boolean {
	return typeof id === 'string' && id.length > 0;
}

export function isValidEstablishmentNumbers(arr: unknown): boolean {
	return Array.isArray(arr) && arr.every((v) => typeof v === 'string' && v.length > 0);
}
