import { getAppConfig } from '../config';
import { handleError } from '../utils/utilsService';
import { Logger } from '../utils/logger';
import { HttpService } from '../utils/httpService';
import { ModoTokenResponse } from '../interfaces/modo.interface';

/**
 * Authenticate against Modo API to obtain a Bearer JWT token.
 * POST /v2/stores/companies/token with { username, password } body and required User-Agent header.
 */
const authenticate = async (username: string, password: string): Promise<ModoTokenResponse> => {
	const { apiUrl, debug, userAgent } = getAppConfig();

	const headers = {
		'User-Agent': `${userAgent}`,
		'Content-Type': 'application/json'
	};

	const httpService = new HttpService('v2/stores/companies', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<ModoTokenResponse>('token', { data: { username, password } });

		if (debug) {
			Logger.info(response);
		}

		return response.data;
	} catch (error) {
		return handleError(error);
	}
};

export { authenticate };
