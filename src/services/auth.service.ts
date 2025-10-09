import { getAppConfig } from '../config';
import { handleError, getHeaders } from '../utils/utilsService';
import { HttpService } from '../utils/httpService';
import { Logger } from '../utils/logger';

/**
 * Exchange username/password for a Bearer access token using the provider endpoint:
 * POST /v2/stores/companies/token
 * body: { username, password }
 *
 * Returns the access_token string on success.
 */
const authenticate = async (username: string, password: string) => {
	const { apiUrl, debug } = getAppConfig();

	// No token available yet; getHeaders called without token will still include User-Agent
	const headers = getHeaders();

	const httpService = new HttpService('', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const response = await httpService.post<{ access_token: string; token_type?: string; expires_in?: number }>('v2/stores/companies/token', {
			data: {
				username,
				password
			}
		});

		if (debug) {
			Logger.info(response);
		}

		const data = response.data;

		if (!data || !data.access_token) {
			throw new Error('Token response did not include access_token');
		}

		return data.access_token;
	} catch (error) {
		return handleError(error);
	}
};

export { authenticate };
