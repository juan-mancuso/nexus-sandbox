export type Currency = 'ARS';

export interface Merchant {
	token: string;
}

// Auth
export interface AuthRequest {
	username: string;
	password: string;
}

export interface AuthResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

// Address
export interface Address {
	state: string;
	city: string;
	zip_code: string;
	street: string;
	number: string;
}

// Customer
export interface Customer {
	full_name: string;
	email: string;
	identification: string;
	birth_date: string; // YYYY-MM-DD
	phone: string;
	id: string;
	invoice_address: Address;
}

// Items are not strictly specified by the API description; keep generic typed objects
export type Item = Record<string, unknown>;

// Create payment request
export interface CreatePaymentRequest {
	description: string;
	amount: number;
	currency: Currency;
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

// Create payment response (partial, include common fields)
export interface CreatePaymentResponse {
	id: string;
	qr?: string;
	deeplink?: string;
	created_at: string;
	expiration_at?: string;
	expiration_date?: string;
	sub_payments?: Record<string, unknown>;
	best_installment?: Record<string, unknown>;
}

// Get payment response (payment request + transaction data when available)
export interface GetPaymentResponse {
	id: string;
	description: string;
	amount: number;
	currency: Currency;
	status?: string;
	created_at?: string;
	transaction_data?: Record<string, unknown> | null;
	[other: string]: unknown;
}

// Refund request/response
export interface RefundPaymentRequest {
	amount?: number;
}

export interface RefundPaymentResponse {
	amount: number;
	status: string;
	reference_transaction_token?: string;
	currency: Currency;
	message?: string;
}
