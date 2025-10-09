export type AppConfigType = {
	apiUrl: string;
	debug?: boolean;
	env: 'production' | 'stage' | 'development' | 'test';
	userAgent: string;
	// Optional default language header for BambooPayments: 'en' | 'es' | 'pt'
	defaultLang?: 'en' | 'es' | 'pt';
};
