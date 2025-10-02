import { ICustomErrorOptions } from '../interfaces/error.interface';
import { Logger } from './logger';
import { getStatusCode } from './format';

/**
 * CustomError class to standardize error handling.
 *
 * This class allows for structured error handling, providing additional context
 * through metadata and data properties. It supports both a new object-based constructor
 * and a deprecated numeric code-based approach for backward compatibility.
 *
 * @template M - Type of metadata (default: `any`).
 * @template D - Type of additional data (default: `any`).
 */
export class CustomError<M = any, D = any> extends Error {
	/**
	 * Indicates whether the error represents a failed operation.
	 */
	public success: boolean;

	/**
	 * Unique error code, either provided explicitly or automatically assigned.
	 */
	public code: number;

	/**
	 * HTTP status code associated with the error.
	 */
	public statusCode: number;

	/**
	 * Metadata containing additional contextual information about the error.
	 */
	public metadata?: M;

	/**
	 * Additional data related to the error, such as response details from an HTTP request.
	 */
	public data?: D;

	/**
	 * Creates a new `CustomError` instance using an object-based constructor.
	 *
	 * @param {string} message - The error message.
	 * @param {ICustomErrorOptions<M, D>} options - Additional error details.
	 * @param {number} options.code - The error code (default: timestamp).
	 * @param {number} options.statusCode - HTTP status code associated with the error.
	 * @param {M} [options.metadata] - Optional metadata providing context.
	 * @param {D} [options.data] - Optional additional data related to the error.
	 */
	constructor(message: string, options?: ICustomErrorOptions<M, D>) {
		super(message);

		this.name = this.constructor.name;
		this.success = false;

		const { code, statusCode, metadata, data } = options || {};

		this.code = code ?? Date.now();

		this.statusCode = getStatusCode(this.code, statusCode);

		if (metadata) {
			this.metadata = metadata;
		}

		if (data) {
			this.data = data;
		}

		Error.captureStackTrace(this, this.constructor);
		Logger.warn(this);
	}
}
