export type ModoMerchant = {
	/** Bearer token (access_token) obtained from /v2/stores/companies/token */
	token: string;
	expires_in?: number;
};

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
	id: string; // unique id in the store
	invoice_address: Address;
}

export interface CreatePaymentRequest {
	description: string;
	amount: number; // float, max 13 chars, 2 decimals
	currency: string; // e.g. ARS
	cc_code: string;
	processor_code: string;
	external_intention_id: string;
	expiration_date?: string; // ISO 8601
	message?: string;
	webhook_notification?: string;
	customer?: Customer;
	shipping_address?: Address;
	items?: Array<Record<string, unknown>>;
	establishment_numbers?: string[];
}

export interface SubPayment {
	id?: string;
	amount?: number;
	status?: string;
}

export interface BestInstallment {
	installments?: number;
	installment_amount?: number;
}

export interface CreatePaymentResponse {
	id: string;
	qr?: string;
	deeplink?: string;
	created_at?: string;
	expiration_at?: string;
	expiration_date?: string;
	sub_payments?: SubPayment[];
	best_installment?: BestInstallment;
	[extra: string]: unknown;
}

export interface TransactionData {
	status?: string;
	amount?: number;
	currency?: string;
	reference?: string;
	transaction_token?: string;
	[extra: string]: unknown;
}

export interface GetPaymentResponse {
	payment_request?: CreatePaymentResponse;
	transaction_data?: TransactionData;
	[extra: string]: unknown;
}

export interface RefundRequest {
	amount?: number; // optional; if not provided full refund
}

export interface RefundResponse {
	amount: number;
	status: string;
	reference_transaction_token?: string;
	currency?: string;
	message?: string;
}
