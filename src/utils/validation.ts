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

/** Modo-specific validators (helpers only — service implementations do not enforce them). */
export function isValidAmount(amount: unknown): boolean {
	if (typeof amount !== 'number') return false;
	// max 13 characters incl decimals -> we validate numeric precision (2 decimals) and magnitude
	// Accept up to 11 digits before decimal and 2 after -> max value ~ 99999999999.99
	const maxValue = 99999999999.99;
	const fixed = Number(amount.toFixed(2));
	return fixed === amount && amount >= 0 && amount <= maxValue;
}

export function isValidExpirationDate(isoDate: unknown): boolean {
	if (typeof isoDate !== 'string') return false;
	const d = Date.parse(isoDate);
	if (Number.isNaN(d)) return false;
	// optional rule: expiration must be between now +5min and now +10min
	const now = Date.now();
	const min = now + 5 * 60 * 1000;
	const max = now + 10 * 60 * 1000;
	return d >= min && d <= max;
}

export function isValidExternalIntentionId(id: unknown): boolean {
	return typeof id === 'string' && id.trim().length > 0;
}

export function isValidEstablishmentNumbers(arr: unknown): boolean {
	if (!Array.isArray(arr)) return false;
	return arr.every((v) => typeof v === 'string' && v.trim().length > 0);
}
