export type Status = 'CHECKOUT_CREATED' | 'CHECKOUT_EXPIRED' | 'CHECKOUT_CANCELED' | 'CHECKOUT_COMPLETED' | 'CHECKOUT_PENDING';

export interface Merchant {
	token: string;
}

export interface CreateCheckoutRequest {
	amount: number;
	currency: string;
	purchase_description: string;
	redirection_url: {
		success: string;
		error: string;
		default: string;
	};
	metadata: {
		me_reference_id: string;
		customer_info: {
			name: string;
			email: string;
			phone: string;
		};
	};
}

export interface CreateCheckoutResponse {
	payment_request_id: string;
	payment_request_url: string;
	object_type: string;
	status: Status;
	last_status_message: string;
	created_at: string;
	modified_at: string;
	expired_at: string;
}

export interface GetCheckoutResponse extends CreateCheckoutResponse, CreateCheckoutRequest {
	expired_at: string;
	receipt_no: string;
}

interface Transaction {
	receipt_no: string;
	created_at: string;
	location: {
		longitude: string;
		latitude: string;
	};
	user_email: string;
	status: string;
	payment_method: string;
	sub_type: string;
	card: {
		brand: string;
		issuer: string;
		last4: string;
	};
	currency: string;
	terms: any;
	amount: string;
	tip: string;
	total: string;
	merchant_invoice: string;
}

interface QueryPagination {
	pagination_token: string;
	limit: string;
	from: string;
	to: string;
	last4: string;
	status: string;
}

interface MetaPagination {
	limit: string;
	pagination_token: string;
	from: string;
	to: string;
	item_type: string;
}

export interface GetTransactionsResponse {
	items: Transaction[];
	query: QueryPagination;
	response_messages: string[];
	meta: MetaPagination;
}

export interface GetTransactionResponse {
	query: {
		receipt_no: string;
	};
	meta: {
		item_type: string;
	};
	item: Transaction;
	response_messages: string[];
}
