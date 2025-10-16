import { getAppConfig } from '../config';
import { handleError } from '../utils/utilsService';
import { Logger } from '../utils/logger';
import { HttpService } from '../utils/httpService';
import { TokenResponse, ModoMerchant } from '../interfaces/modo.interface';

/**
 * Authenticate against Modo to obtain a Bearer access token.
 * POST /v2/stores/companies/token
 */
const authenticate = async (username: string, password: string): Promise<ModoMerchant> => {
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
		const response = await httpService.post<TokenResponse>('token', { data: { username, password } });

		if (debug) {
			Logger.info(response);
		}

		const data = response.data;

		if (!data || !data.access_token) {
			throw new Error('Invalid authentication response');
		}

		return {
			token: data.access_token,
			expires_in: data.expires_in
		};
	} catch (error) {
		return handleError(error);
	}
};

export { authenticate };
