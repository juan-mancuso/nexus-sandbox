export type ModoTokenResponse = {
	access_token: string;
	token_type: string;
	expires_in: number;
};

export type ModoMerchant = {
	token: string; // Bearer token
	expiresAt?: string | number;
};

export type ModoAddress = {
	state: string;
	city: string;
	zip_code: string;
	street: string;
	number: string;
};

export type ModoCustomer = {
	full_name: string;
	email: string;
	identification: string;
	birth_date: string; // YYYY-MM-DD
	phone: string;
	id: string;
	invoice_address: ModoAddress;
};

export type ModoItem = {
	reference?: string;
	description?: string;
	quantity?: number;
	unit_price?: number;
};

export type CreatePaymentRequest = {
	description: string;
	amount: number; // up to 13 chars, 2 decimals
	currency: string; // e.g. 'ARS'
	cc_code: string;
	processor_code: string;
	external_intention_id: string;
	expiration_date?: string; // ISO 8601
	message?: string;
	webhook_notification?: string;
	customer?: ModoCustomer;
	shipping_address?: ModoAddress;
	items?: ModoItem[];
	establishment_numbers?: string[];
};

export type CreatePaymentResponse = {
	id: string;
	qr?: string;
	deeplink?: string;
	created_at?: string;
	expiration_at?: string;
	expiration_date?: string;
	sub_payments?: unknown[];
	best_installment?: unknown;
	// Raw additional fields allowed by Modo
	[extra: string]: unknown;
};

export type GetPaymentResponse = {
	payment_request: CreatePaymentResponse;
	transaction_data?: unknown;
};

export type RefundPaymentRequest = {
	amount?: number; // if omitted -> full refund
};

export type RefundPaymentResponse = {
	amount: number;
	status: string;
	reference_transaction_token?: string;
	currency?: string;
	message?: string;
};
