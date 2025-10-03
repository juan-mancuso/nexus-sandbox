import { AuthRequest, AuthResponse } from '../interfaces/client.interface';
import { getAppConfig } from '../config';
import { handleError, getPublicHeaders } from '../utils/utilsService';
import { Logger } from '../utils/logger';
import { HttpService } from '../utils/httpService';
import { CustomError } from '../utils/error';

const authenticate = async (username: string, password: string): Promise<string> => {
	const { apiUrl, debug } = getAppConfig();

	const httpService = new HttpService('', {
		baseURL: `${apiUrl}/`,
		headers: getPublicHeaders()
	});

	try {
		const body: AuthRequest = { username, password };

		const response = await httpService.post<AuthResponse>('v2/stores/companies/token', { data: body });

		if (debug) {
			Logger.info(response);
		}

		const data = response.data;

		if (!data || typeof data.access_token !== 'string') {
			throw new CustomError('Invalid authentication response', { statusCode: response.status, data });
		}

		return data.access_token;
	} catch (error) {
		return handleError(error);
	}
};

export { authenticate };
