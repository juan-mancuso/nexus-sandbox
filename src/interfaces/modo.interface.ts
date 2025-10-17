export type ModoTokenResponse = {
	access_token: string;
	token_type: string;
	expires_in: number;
};

export type ModoMerchant = {
	token: string; // Bearer token (JWT)
	expires_in?: number;
};

export type Address = {
	state: string;
	city: string;
	zip_code: string;
	street: string;
	number: string;
};

export type Customer = {
	full_name: string;
	email: string;
	identification: string;
	birth_date: string; // YYYY-MM-DD
	phone: string;
	id: string;
	invoice_address: Address;
};

export type Item = {
	id?: string;
	description?: string;
	quantity?: number;
	unit_price?: number;
	amount?: number;
	[extra: string]: unknown;
};

export type SubPayment = {
	id?: string;
	amount?: number;
	status?: string;
	[extra: string]: unknown;
};

export type BestInstallment = {
	count?: number;
	installment_value?: number;
	total?: number;
};

export type CreatePaymentRequest = {
	description: string;
	amount: number;
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
};

export type CreatePaymentResponse = {
	id: string;
	qr?: string;
	deeplink?: string;
	created_at?: string;
	expiration_at?: string;
	expiration_date?: string;
	sub_payments?: SubPayment[];
	best_installment?: BestInstallment;
	[extra: string]: unknown;
};

export type TransactionData = {
	status?: string;
	amount?: number;
	currency?: string;
	reference?: string;
	transaction_token?: string;
	[extra: string]: unknown;
};

export type GetPaymentResponse = {
	payment_request?: CreatePaymentResponse;
	transaction_data?: TransactionData;
	[extra: string]: unknown;
};

export type RefundRequest = {
	amount?: number; // if omitted, full refund
};

export type RefundResponse = {
	amount?: number;
	status?: string;
	reference_transaction_token?: string;
	currency?: string;
	message?: string;
	[extra: string]: unknown;
};
