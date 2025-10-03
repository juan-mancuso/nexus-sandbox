import { HttpStatusCode, isAxiosError } from 'axios';
import { getAppConfig } from '../config';
import { CustomError } from './error';
import { Logger } from './logger';

export function getHeaders(token: string) {
	const { userAgent } = getAppConfig();

	return {
		Authorization: `Basic ${token}`,
		'User-Agent': `${userAgent}`,
		'Content-Type': 'application/json'
	};
}

export function getBearerHeaders(token: string) {
	const { userAgent } = getAppConfig();

	return {
		Authorization: `Bearer ${token}`,
		'User-Agent': `${userAgent}`,
		'Content-Type': 'application/json'
	};
}

export function getPublicHeaders() {
	const { userAgent } = getAppConfig();

	return {
		'User-Agent': `${userAgent}`,
		'Content-Type': 'application/json'
	};
}

export const handleError = (error: unknown) => {
	const { debug } = getAppConfig();

	if (debug) {
		Logger.error(error);
	}

	if (isAxiosError(error)) {
		const { message, status: statusCode, response } = error;
		const { data, status } = response || {};

		throw new CustomError(typeof message === 'string' ? message : 'Request error', {
			statusCode: (status ?? statusCode) as number,
			data: data ?? error
		});
	}

	throw new CustomError('Internal Server Error', { statusCode: HttpStatusCode.InternalServerError, data: error });
};

export const generateToken = (apiKey: string, secretKey: string): string => {
	const token = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');

	return token;
};
