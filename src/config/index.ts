import { AppConfigType } from '../interfaces';

const apiUrls = {
	test: 'https://api.bamboopayment.com/v3/api',
	development: 'https://api.bamboopayment.com/v3/api',
	stage: 'https://api.bamboopayment.com/v3/api',
	production: 'https://api.bamboopayment.com/v3/api'
};

const secureApiUrls = {
	test: 'https://secure-api.bamboopayment.com/v3/api',
	development: 'https://secure-api.bamboopayment.com/v3/api',
	stage: 'https://secure-api.bamboopayment.com/v3/api',
	production: 'https://secure-api.bamboopayment.com/v3/api'
};

const AppConfig: AppConfigType & { secureApiUrl?: string } = {
	apiUrl: apiUrls.development,
	secureApiUrl: secureApiUrls.development,
	debug: true,
	userAgent: 'Example SDK',
	env: 'development'
};

export const setAppConfig = (newConfig: Partial<AppConfigType & { secureApiUrl?: string }>): void => {
	const { debug, env = 'development', userAgent = '' } = newConfig;

	AppConfig.debug = !!debug;
	AppConfig.apiUrl = apiUrls[env];
	AppConfig.secureApiUrl = secureApiUrls[env];
	AppConfig.env = env;
	AppConfig.userAgent = userAgent ?? '';
};

export function getAppConfig(): AppConfigType & { secureApiUrl?: string } {
	return AppConfig;
}

/* AppConfig exposes apiUrl and secureApiUrl for Bamboo Payment endpoints
   and provides a simple setter to change environment-specific URLs and
   runtime flags (debug, userAgent). */
