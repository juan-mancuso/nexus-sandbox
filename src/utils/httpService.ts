import axios from 'axios';
import { formatBasePath } from './format';
import { IHttpConfig, IHttpResponse, TypeInterceptor } from '../interfaces/httpService.interface';

export class HttpService {
	private basePath: string;

	private readonly httpInstance;

	constructor(path = '', config: IHttpConfig = {}) {
		this.basePath = formatBasePath(path);
		this.httpInstance = axios.create(config);
	}

	public configureInterceptors(type: TypeInterceptor, first: (value: any) => any | Promise<any>, second?: (error: any) => any) {
		return this.httpInstance.interceptors[type].use(first, second);
	}

	public get<T = any, D = any>(url: string, options: IHttpConfig = {}): Promise<IHttpResponse<T, D>> {
		return this.httpInstance.get(`${this.basePath}${url}`, options);
	}

	public post<T = any, D = any>(url: string, options: IHttpConfig = {}): Promise<IHttpResponse<T, D>> {
		const { data = {}, ...rest } = options;

		return this.httpInstance.post(`${this.basePath}${url}`, data, rest);
	}

	public put<T = any, D = any>(url: string, options: IHttpConfig = {}): Promise<IHttpResponse<T, D>> {
		const { data = {}, ...rest } = options;

		return this.httpInstance.put(`${this.basePath}${url}`, data, rest);
	}

	public patch<T = any, D = any>(url: string, body: unknown): Promise<IHttpResponse<T, D>> {
		return this.httpInstance.patch(`${this.basePath}${url}`, body);
	}

	public delete<T = any, D = any>(url: string, options: IHttpConfig = {}): Promise<IHttpResponse<T, D>> {
		return this.httpInstance.delete(`${this.basePath}${url}`, options);
	}
}
