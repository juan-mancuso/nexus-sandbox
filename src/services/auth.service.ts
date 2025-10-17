import { getAppConfig } from '../config';
import { handleError } from '../utils/utilsService';
import { Logger } from '../utils/logger';
import { HttpService } from '../utils/httpService';
import { TokenRequest, TokenResponse, ModoMerchant } from '../interfaces/modo.interface';

const authenticate = async (username: string, password: string): Promise<ModoMerchant | unknown> => {
	const { apiUrl, debug } = getAppConfig();

	const headers = {
		'User-Agent': getAppConfig().userAgent,
		'Content-Type': 'application/json'
	};

	const httpService = new HttpService('v2/stores/companies', {
		baseURL: `${apiUrl}/`,
		headers
	});

	try {
		const data: TokenRequest = { username, password };

		const response = await httpService.post<TokenResponse>('token', { data });

		if (debug) {
			Logger.info(response);
		}

		const tokenResp = response.data;

		if (!tokenResp || !tokenResp.access_token) {
			throw new Error('Invalid authentication response');
		}

		const merchant: ModoMerchant = {
			token: tokenResp.access_token,
			tokenType: tokenResp.token_type,
			expiresIn: tokenResp.expires_in
		};

		return merchant;
	} catch (error) {
		return handleError(error);
	}
};

export { authenticate };
