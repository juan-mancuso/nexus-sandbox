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

// Modo-specific validators (helpers only; do not enforce validation in service layer per SDK rules)
export function isValidAmount(amount: number | string): boolean {
	// Accept numbers or numeric strings. Ensure max 13 chars when represented and max 2 decimals.
	if (amount === null || amount === undefined) return false;

	const str = typeof amount === 'number' ? amount.toFixed(2) : String(amount);
	// Remove potential thousand separators and whitespace
	const cleaned = str.replace(/[,\s]/g, '');

	// Check numeric format
	if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return false;

	// Check length constraint (max 13 chars excluding decimal point?) Interpretation: overall chars <= 13
	if (cleaned.replace('.', '').length > 13) return false;

	return true;
}

export function isValidExpirationDate(isoDate?: string): boolean {
	if (!isoDate) return true; // optional

	const date = new Date(isoDate);
	if (Number.isNaN(date.getTime())) return false;

	const now = Date.now();
	const diffMs = date.getTime() - now;
	const diffMinutes = diffMs / (1000 * 60);

	// According to docs: min 5 min, max 10 min
	return diffMinutes >= 5 && diffMinutes <= 10;
}

export function isValidExternalIntentionId(id?: string): boolean {
	if (!id) return false;
	return typeof id === 'string' && id.trim().length > 0;
}
