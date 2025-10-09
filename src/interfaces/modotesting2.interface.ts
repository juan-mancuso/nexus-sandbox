// Interfaces for modo-testing2 (playdigital) integration

export interface AuthRequest {
	username: string;
	password: string;
}

export interface AuthResponse {
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

export interface Item {
	description: string;
	quantity: number;
	unit_price: number;
	image: string;
	sku: string;
	category_name: string;
}

export interface EstablishmentNumber {
	establishment_number: string;
	card_issuer: string; // VISA, MASTER, etc.
	card_type?: string; // CREDIT, DEBIT
}

export interface CreatePaymentRequest {
	description: string;
	amount: number; // float, max 13 chars, 2 decimals
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
	establishment_numbers?: EstablishmentNumber[];
}

export interface CreatePaymentResponse {
	id: string;
	qr?: string;
	deeplink?: string;
	created_at: string;
	expiration_date?: string;
	sub_payments?: unknown[];
	best_installment?: unknown;
}

export interface GetPaymentResponse {
	id: string;
	qr?: string;
	deeplink?: string;
	created_at: string;
	expiration_date?: string;
	status?: string;
	transaction_data?: unknown;
	// additional fields may be present depending on gateway
	[extra: string]: unknown;
}

export type RefundStatus = 'PARTIAL_REFUND' | 'REFUNDED';

export interface RefundResponse {
	amount: number;
	status: RefundStatus;
	reference_transaction_token?: string;
	currency: string;
	message?: string;
}
