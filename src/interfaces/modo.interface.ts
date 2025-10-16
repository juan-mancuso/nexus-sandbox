export type ModoMerchant = {
	/** Bearer token (JWT) obtained from /v2/stores/companies/token */
	token: string;
	expires_in?: number;
};

export interface ModoTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

export interface ModoAddress {
	state: string;
	city: string;
	zip_code: string;
	street: string;
	number: string;
}

export interface ModoCustomer {
	full_name: string;
	email: string;
	identification: string;
	birth_date: string; // YYYY-MM-DD
	phone: string;
	id: string;
	invoice_address: ModoAddress;
}

export interface ModoItem {
	// The API accepts arbitrary item shapes; keep a flexible typed record
	[id: string]: unknown;
}

export interface CreateModoPaymentRequest {
	description: string;
	amount: string | number;
	currency: string;
	cc_code: string;
	processor_code: string;
	external_intention_id: string;
	expiration_date?: string;
	message?: string;
	webhook_notification?: string;
	customer?: ModoCustomer;
	shipping_address?: ModoAddress;
	items?: ModoItem[];
	establishment_numbers?: string[];
}

export interface CreateModoPaymentResponse {
	id: string;
	qr?: string;
	deeplink?: string;
	created_at?: string;
	expiration_at?: string;
	expiration_date?: string;
	sub_payments?: unknown[];
	best_installment?: unknown;
	// raw response may contain other fields
	[extra: string]: unknown;
}

export interface GetModoPaymentResponse {
	payment_request: Record<string, unknown>;
	transaction_data?: Record<string, unknown>;
}

export interface RefundModoResponse {
	amount?: number | string;
	status?: string;
	reference_transaction_token?: string;
	currency?: string;
	message?: string;
	[extra: string]: unknown;
}
