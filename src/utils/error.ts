import { Logger } from "./logger";

export interface CustomErrorOptions {
  statusCode?: number;
  code?: string;
  metadata?: Record<string, unknown> | null;
  data?: unknown;
}

export const NOT_IMPLEMENTED = "NOT_IMPLEMENTED";

export class CustomError extends Error {
  public success = false;
  public code: string;
  public statusCode: number;
  public metadata: Record<string, unknown> | null;
  public data: unknown;

  constructor(message: string, opts: CustomErrorOptions = {}) {
    super(message);
    this.name = "CustomError";
    this.code = opts.code || "UNKNOWN_ERROR";
    this.statusCode = opts.statusCode ?? 500;
    this.metadata = opts.metadata ?? null;
    this.data = opts.data;

    // Log a concise warning to help debugging
    try {
      Logger.warn({ msg: message, code: this.code, statusCode: this.statusCode, metadata: this.metadata });
    } catch (e) {
      // swallow logger errors
      // eslint-disable-next-line no-console
      console.warn("CustomError logger failed", e);
    }
  }
}
