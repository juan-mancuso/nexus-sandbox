import { AppConfigType } from '../interfaces';

const apiUrls = {
	// Map SDK env names to BambooPayments endpoints
	test: 'https://api.stage.bamboopayment.com',
	development: 'https://api.stage.bamboopayment.com',
	stage: 'https://api.stage.bamboopayment.com',
	production: 'https://api.bamboopayment.com'
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

/* The purpose of this code is to export an object called AppConfig
that contains values that are used frequently in the project and are
set when the project starts. This allows these values to be easily
accessed and used in different parts of the project, without having
to hardcode them or pass them around as arguments to different functions.
The AppConfig object is initialized with default values, but these can
be updated using the setAppConfig function if needed. This allows the
values in AppConfig to be easily changed without having to modify the
code that uses them. */
