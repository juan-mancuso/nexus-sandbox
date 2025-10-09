import { HttpStatusCode, isAxiosError } from 'axios';
import { getAppConfig } from '../config';
import { CustomError } from './error';
import { Logger } from './logger';

export function getHeaders(token?: string) {
	const { userAgent } = getAppConfig();

	const headers: Record<string, string> = {
		'User-Agent': `${userAgent}`,
		'Content-Type': 'application/json'
	};

	// If a token is provided, include Bearer Authorization
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	return headers;
}

export const handleError = (error: any) => {
	const { debug } = getAppConfig();

	if (debug) {
		Logger.error(error);
	}

	if (isAxiosError(error)) {
		const { message, status: statusCode, response } = error;
		const { data, status } = response || {};

		throw new CustomError(message, { statusCode: status ?? statusCode ?? HttpStatusCode.InternalServerError, data: data ?? error });
	}

	throw new CustomError(HttpStatusCode[HttpStatusCode.InternalServerError], { statusCode: HttpStatusCode.InternalServerError, data: error });
};

/**
 * Legacy helper to build a Basic auth token from apiKey:secretKey.
 * For modo-integration the authentication flow requires exchanging
 * username/password for a Bearer access_token via POST /v2/stores/companies/token
 * and then using getHeaders(access_token) to include Authorization: Bearer <token>.
 */
export const generateToken = (apiKey: string, secretKey: string): string => {
	const token = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');

	return token;
};
