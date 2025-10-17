import { getAppConfig } from '../config';
import { handleError } from '../utils/utilsService';
import { Logger } from '../utils/logger';
import { HttpService } from '../utils/httpService';
import { ModoTokenResponse, ModoMerchant } from '../interfaces/modo.interface';

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
		const response = await httpService.post<ModoTokenResponse>('token', { data: { username, password } });

		if (debug) {
			Logger.info(response);
		}

		const { access_token, token_type, expires_in } = response.data;

		const merchant: ModoMerchant = {
			token: access_token,
			tokenType: token_type,
			expiresIn: expires_in
		};

		return merchant;
	} catch (error) {
		return handleError(error);
	}
};

export { authenticate };
