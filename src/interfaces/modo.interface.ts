export type ModoMerchant = {
	token: string; // Bearer token (JWT)
	expiresIn?: number;
};

export interface ModoTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

export interface CreatePaymentRequest {
	description: string;
	amount: number; // float two decimals
	currency: string; // e.g. "ARS"
	cc_code: string;
	processor_code: string;
	external_intention_id: string;
	expiration_date?: string; // ISO 8601
	message?: string;
	webhook_notification?: string;
	customer?: {
		full_name: string;
		email: string;
		identification: string;
		birth_date: string; // YYYY-MM-DD
		phone: string;
		id: string;
		invoice_address: {
			state: string;
			city: string;
			zip_code: string;
			street: string;
			number: string;
		};
	};
	shipping_address?: {
		state: string;
		city: string;
		zip_code: string;
		street: string;
		number: string;
	};
	items?: Array<Record<string, unknown>>;
	establishment_numbers?: string[];
}

export interface CreatePaymentResponse {
	id: string;
	qr?: string;
	deeplink?: string;
	created_at?: string;
	expiration_at?: string;
	expiration_date?: string;
	sub_payments?: any[];
	best_installment?: any;
	// additional fields permitted by API
}

export interface GetPaymentResponse {
	payment_request: CreatePaymentResponse & {
		// extend with any additional fields returned
	};
	transaction_data?: Record<string, unknown> | null;
}

export interface RefundRequest {
	amount?: number;
}

export interface RefundResponse {
	amount: number;
	status: string;
	reference_transaction_token?: string;
	currency: string;
	message?: string;
}
