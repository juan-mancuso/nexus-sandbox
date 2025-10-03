import { AppConfigType } from '../interfaces';

const apiUrls = {
	test: 'https://merchants.preprod.playdigital.com.ar',
	development: 'https://merchants.preprod.playdigital.com.ar',
	stage: 'https://merchants.preprod.playdigital.com.ar',
	production: 'https://merchants.modo.com.ar'
};

const AppConfig: AppConfigType = {
	apiUrl: apiUrls.development,
	debug: true,
	userAgent: 'Example SDK',
	env: 'development'
};

export const setAppConfig = (newConfig: Partial<AppConfigType>): void => {
	const { debug, env = 'development', userAgent = '' } = newConfig;

	AppConfig.debug = !!debug;
	AppConfig.apiUrl = apiUrls[env];
	AppConfig.env = env;
	AppConfig.userAgent = userAgent ?? '';
};

export function getAppConfig(): AppConfigType {
	return AppConfig;
}
