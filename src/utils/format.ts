import { HttpStatusCode } from 'axios';
import { isValidStatusCode } from './validation';

export function formatBasePath(path: unknown): string {
	if (typeof path !== 'string' || !path.trim().length) {
		return '';
	}

	return `${path.trim()}/`;
}

export function getStatusCode(code: number, statusCode?: number) {
	if (isValidStatusCode(statusCode)) {
		return statusCode!;
	}

	if (isValidStatusCode(code)) {
		return code;
	}

	return HttpStatusCode.InternalServerError;
}
