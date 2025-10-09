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
		type AxiosLikeError = {
			message?: string;
			response?: { data?: unknown; status?: number };
			status?: number;
		};

		const axiosError = error as AxiosLikeError;
		const message = axiosError.message ?? 'Request failed';
		const statusCode = axiosError.response?.status ?? axiosError.status ?? HttpStatusCode.InternalServerError;
		const data = axiosError.response?.data ?? axiosError;

		throw new CustomError(message, {
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
