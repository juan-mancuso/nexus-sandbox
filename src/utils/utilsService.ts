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

export const handleError = (error: any) => {
	const { debug } = getAppConfig();

	if (debug) {
		Logger.error(error);
	}

	// TODO: IMPLEMENT THIS
	if (isAxiosError(error)) {
		const { message, status: statusCode, response } = error;
		const { data, status } = response || {};

		throw new CustomError(message, { statusCode: status ?? statusCode ?? HttpStatusCode.InternalServerError, data: data ?? error });
	}

	throw new CustomError(HttpStatusCode[HttpStatusCode.InternalServerError], { statusCode: HttpStatusCode.InternalServerError, data: error });
};

export const generateToken = (apiKey: string, secretKey: string): string => {
	const token = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');

	return token;
};
