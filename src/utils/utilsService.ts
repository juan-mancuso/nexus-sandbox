import { HttpStatusCode, isAxiosError } from 'axios';
import { getAppConfig } from '../config';
import { CustomError } from './error';
import { Logger } from './logger';

export function getHeaders(token: string, extraHeaders?: Record<string, string>) {
	const { userAgent } = getAppConfig();

	const baseHeaders: Record<string, string> = {
		Authorization: `Basic ${token}`,
		'User-Agent': `${userAgent}`,
		'Content-Type': 'application/json'
	};

	if (!extraHeaders) return baseHeaders;

	return {
		...baseHeaders,
		...extraHeaders
	};
}

export const handleError = (error: unknown) => {
	const { debug } = getAppConfig();

	if (debug) {
		Logger.error(error);
	}

	if (isAxiosError(error)) {
		const { message, response } = error;
		const statusCode = response?.status ?? HttpStatusCode.InternalServerError;
		const data = response?.data ?? error;

		throw new CustomError(message, { statusCode, data });
	}

	throw new CustomError(String(HttpStatusCode[HttpStatusCode.InternalServerError]), {
		statusCode: HttpStatusCode.InternalServerError,
		data: error
	});
};

export const generateToken = (apiKey: string, secretKey: string): string => {
	const token = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');

	return token;
};
