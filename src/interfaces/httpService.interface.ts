import { AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from 'axios';

export type IHttpResponse<T = any, D = any> = AxiosResponse<T, D>;
export type IHttpConfig<D = any> = AxiosRequestConfig<D>;
export type IHttpConfigCustom<D = any> = IHttpConfig<D> & { user?: unknown };
export type IHttpInterceptorManager<D = any> = AxiosInterceptorManager<D>;

export enum TypeInterceptor {
	REQUEST = 'request',
	RESPONSE = 'response'
}
