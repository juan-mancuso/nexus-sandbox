export type AppConfigType = {
	apiUrl: string;
	secureApiUrl?: string;
	debug?: boolean;
	env: 'production' | 'stage' | 'development' | 'test';
	userAgent: string;
};
