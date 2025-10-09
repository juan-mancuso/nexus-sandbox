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

// Simple helpers for modo-testing2 — lightweight validators (not enforced before requests per SDK guidelines)
export const validateAmount = (value: unknown): boolean => {
	if (typeof value !== 'number') return false;
	// ensure at most 2 decimals
	const rounded = Math.round(value * 100) / 100;
	return Math.abs(value - rounded) < Number.EPSILON || value === rounded;
};

export const validateCurrency = (currency: unknown): boolean => {
	if (typeof currency !== 'string') return false;
	// basic check — allow 'ARS' for this integration
	return currency.toUpperCase() === 'ARS';
};

export const validateISODate = (dateStr: unknown): boolean => {
	if (typeof dateStr !== 'string') return false;
	// basic ISO8601 check (YYYY-MM-DD or datetime)
	return /^\d{4}-\d{2}-\d{2}(T.*Z?)?$/.test(dateStr);
};
