export interface Merchant {
	token: string;
}

export interface Address {
	Country?: string;
	City?: string;
	State?: string;
	PostalCode?: string;
	AddressDetail?: string;
}

export interface Customer {
	FirstName?: string;
	LastName?: string;
	ReferenceCode?: string;
	PhoneNumber?: string;
	DocumentNumber?: string;
	DocumentType?: string;
	Email: string;
	Address?: Address;
}

export interface NetworkToken {
	PaymentMethod: string;
	[custom: string]: unknown;
}

export interface CreatePaymentRequest {
	// Headers are handled by the SDK (merchant token)
	TrxToken?: string;
	NetworkToken?: NetworkToken;
	PaymentMethod?: string;
	UniqueID?: string;
	Capture?: boolean;
	TargetCountryISO: string;
	Currency: string;
	Amount: number; // in smallest unit
	Tip?: number;
	TaxableAmount?: number;
	Installments?: number;
	Order: string;
	InvoiceNumber?: string;
	Description?: string;
	AdditionalData?: string;
	MetadataIn?: Record<string, unknown>;
	Customer: Customer;
	SoftDescriptor?: string;

	// PCI direct card flow (use secure endpoint)
	CardData?: {
		CardHolderName: string;
		Pan: string;
		CVV: string;
		Expiration: string; // MM/YY
		Email: string;
		Document?: string;
	};
}

export interface ActionObject {
	// SDK keeps this generic because payloads may vary by payment method
	[custom: string]: unknown;
}

export interface PaymentMethodObject {
	[custom: string]: unknown;
}

export interface CreatePaymentResponse {
	TransactionId: string;
	Result: string;
	Status: string;
	ErrorCode: string | null;
	ErrorDescription: string | null;
	Created: string; // ISO 8601
	AuthorizationDate?: string | null;
	AuthorizationCode?: string | null;
	Amount: number;
	Currency: string;
	Installments?: number | null;
	TaxableAmount?: number | null;
	Tip?: number | null;
	Url?: string;
	MetadataOut?: Record<string, unknown> | null;
	Action?: ActionObject | null;
	PaymentMethod?: PaymentMethodObject | null;
}

export interface ErrorResponse {
	ErrorCode: string;
	ErrorDescription: string;
}
