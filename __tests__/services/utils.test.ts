import { AxiosError, AxiosRequestHeaders, AxiosResponse, HttpStatusCode } from 'axios';
import { handleError } from '../../src/utils/utilsService';

describe('handleError', () => {
	test('handles an error with a response and a response data object', () => {
		const error = new AxiosError('Not Found', '404', { headers: { 'Content-Type': 'application/json' } as AxiosRequestHeaders }, {}, {
			data: {
				code_message: '404',
				message: 'Not Found',
				detail: 'The requested resource was not found'
			}
		} as AxiosResponse);

		expect(() => handleError(error)).toThrow('Not Found');
	});

	test('handles an error with a response but no response data object', () => {
		const error = {
			response: {}
		};

		expect(() => handleError(error)).toThrow(HttpStatusCode[HttpStatusCode.InternalServerError]);
	});

	test('handles an error without a response object', () => {
		const error = {};

		expect(() => handleError(error)).toThrow(HttpStatusCode[HttpStatusCode.InternalServerError]);
	});
});
