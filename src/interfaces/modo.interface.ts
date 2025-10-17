export type ModoMerchant = {
	/** Bearer token (JWT) obtained from /v2/stores/companies/token */
	token: string;
	tokenType?: string;
	expiresIn?: number;
};

export interface TokenRequest {
	username: string;
	password: string;
}

export interface TokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

export interface Address {
	state: string;
	city: string;
	zip_code: string;
	street: string;
	number: string;
}

export interface Customer {
	full_name: string;
	email: string;
	identification: string;
	birth_date: string; // YYYY-MM-DD
	phone: string;
	id: string;
	invoice_address: Address;
}

export type Item = Record<string, unknown>;

export interface CreatePaymentRequest {
	description: string;
	amount: number;
	currency: string; // e.g. 'ARS'
	cc_code: string;
	processor_code: string;
	external_intention_id: string;
	expiration_date?: string; // ISO8601
	message?: string;
	webhook_notification?: string;
	customer?: Customer;
	shipping_address?: Address;
	items?: Item[];
	establishment_numbers?: string[];
}

export interface CreatePaymentResponse {
	id: string;
	qr?: string;
	deeplink?: string;
	created_at?: string;
	expiration_at?: string;
	expiration_date?: string;
	sub_payments?: unknown[];
	best_installment?: unknown;
	// Additional raw response fields preserved
	[extra: string]: unknown;
}

export interface GetPaymentResponse {
	payment_request: CreatePaymentResponse;
	transaction_data?: unknown;
	[extra: string]: unknown;
}

export interface RefundRequest {
	amount?: number; // if omitted, full refund
}

export interface RefundResponse {
	amount: number;
	status: string;
	reference_transaction_token?: string;
	currency?: string;
	message?: string;
	[extra: string]: unknown;
}
