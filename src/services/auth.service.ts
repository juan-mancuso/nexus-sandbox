import { getAppConfig } from '../config';
import { handleError } from '../utils/utilsService';
import { HttpService } from '../utils/httpService';
import { Logger } from '../utils/logger';
import { AuthResponse } from '../interfaces/modotesting2.interface';

/**
 * Authenticate using username/password and obtain a Bearer JWT access_token
 * from POST /v2/stores/companies/token. Returns the raw access_token string
 * on success. Throws a CustomError via handleError on failure.
 */
const authenticate = async (username: string, password: string): Promise<string> => {
	const { apiUrl, debug, userAgent } = getAppConfig();

	const headers = {
		'User-Agent': userAgent,
		'Content-Type': 'application/json'
	};

	const httpService = new HttpService('', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<AuthResponse>('v2/stores/companies/token', { data: { username, password } });

		if (debug) {
			Logger.info(response);
		}

		const data = response.data;

		if (!data || !data.access_token) {
			throw new Error('Authentication failed: access_token missing in response');
		}

		return data.access_token;
	} catch (error) {
		return handleError(error);
	}
};

export { authenticate };
