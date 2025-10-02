export enum TypeLogger {
	INFO = 'info',
	ERROR = 'error',
	WARN = 'warn',
	DEBUG = 'debug',
	HTTP = 'http',
	HTTP_FAIL = 'httpFail'
}

export type CustomLogger = {
	[TypeLogger.ERROR]: (...msgs: any[]) => void;
	[TypeLogger.WARN]: (...msgs: any[]) => void;
	[TypeLogger.INFO]: (...msgs: any[]) => void;
	[TypeLogger.HTTP]: (...msgs: any[]) => void;
	[TypeLogger.HTTP_FAIL]: (...msgs: any[]) => void;
	[TypeLogger.DEBUG]: (...msgs: any[]) => void;
	level: TypeLogger;
};
