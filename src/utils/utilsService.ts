import { HttpStatusCode, isAxiosError } from 'axios';
import { getAppConfig } from '../config';
import { CustomError } from './error';
import { Logger } from './logger';

export function getHeaders(token: string, lang?: 'en' | 'es' | 'pt') {
	const { userAgent } = getAppConfig();

	const headers: { [key: string]: string } = {
		Authorization: `Basic ${token}`,
		'User-Agent': `${userAgent}`,
		'Content-Type': 'application/json'
	};

	if (lang) {
		headers.lang = lang;
	}

	return headers;
}

export const handleError = (error: unknown) => {
	const { debug } = getAppConfig();

	if (debug) {
		Logger.error(error);
	}

	if (isAxiosError(error)) {
		const axiosError = error as any; // narrowed below with guards
		const { message } = axiosError;
		const response = axiosError.response as { data?: unknown; status?: number } | undefined;
		const statusCode = response?.status ?? axiosError.status ?? HttpStatusCode.InternalServerError;
		const data = response?.data ?? axiosError;

		throw new CustomError(typeof message === 'string' ? message : 'Request failed', {
			statusCode,
			data
		});
	}

	throw new CustomError('Internal Server Error', { statusCode: HttpStatusCode.InternalServerError, data: error });
};

export const generateToken = (apiKey: string, secretKey: string): string => {
	const token = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');

	return token;
};
