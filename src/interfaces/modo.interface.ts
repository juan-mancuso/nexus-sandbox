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
	id: string; // merchant customer id
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
	card_issuer: string;
	card_type?: string;
}

export interface CreatePaymentRequest {
	description: string;
	amount: number; // float (max 13 chars, 2 decimals)
	currency: string;
	cc_code: string;
	processor_code: string;
	external_intention_id: string;
	expiration_date?: string; // ISO 8601
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
	expiration_at?: string;
	expiration_date?: string;
	sub_payments?: any;
	best_installment?: any;
	// raw provider response may include more fields
	[extra: string]: any;
}

export interface PaymentDetailsResponse {
	id: string;
	status: string;
	qr?: string;
	deeplink?: string;
	created_at: string;
	expiration_date?: string;
	transaction_data?: any;
	sub_payments?: any;
	// more fields possible
	[extra: string]: any;
}

export interface RefundRequest {
	amount?: number;
}

export interface RefundResponse {
	amount: number;
	status: string;
	reference_transaction_token?: string;
	currency?: string;
	message?: string;
	[extra: string]: any;
}

export interface TokenResponse {
	access_token: string;
	token_type?: string;
	expires_in?: number;
}
