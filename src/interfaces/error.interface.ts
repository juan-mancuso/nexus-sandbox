export interface ICustomError<M = any, D = any> {
	success: boolean;
	statusCode: number;
	message: string;
	code: number;
	metadata?: M;
	data?: D;
}

export interface ICustomErrorOptions<M = any, D = any> {
	code?: number;
	statusCode?: number;
	metadata?: M;
	data?: D;
}
