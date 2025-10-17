export type ModoEnv = 'production' | 'stage' | 'development' | 'test';

export interface ModoTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

export interface ModoMerchant {
	token: string; // Bearer token (JWT)
	tokenType?: string;
	expiresIn?: number;
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

export interface Item {
	id?: string;
	description?: string;
	quantity?: number;
	unit_price?: number; // cents or float depending on API; keep number
}

export interface CreatePaymentRequest {
	description: string;
	amount: number; // float - max 13 chars, 2 decimals
	currency: string; // e.g. 'ARS'
	cc_code: string;
	processor_code: string;
	external_intention_id: string;
	expiration_date?: string; // ISO 8601
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
	sub_payments?: any;
	best_installment?: any;
	// additional fields may be present depending on Modo response
}

export interface GetPaymentResponse {
	payment_request: CreatePaymentResponse;
	transaction_data?: any;
}

export interface RefundRequest {
	amount?: number; // optional - if omitted full refund is performed
}

export interface RefundResponse {
	amount: number;
	status: string;
	reference_transaction_token?: string;
	currency?: string;
	message?: string;
}
