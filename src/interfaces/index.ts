export type AppConfigType = {
	apiUrl: string;
	debug?: boolean;
	env: 'production' | 'stage' | 'development' | 'test';
	userAgent: string;
};
