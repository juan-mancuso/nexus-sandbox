export interface CustomerAddress {
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
	DocumentType?: string; // e.g., CPF.BR
	Email: string;
	Address?: CustomerAddress;
}

export interface CardData {
	CardHolderName: string;
	Pan: string;
	CVV: string;
	Expiration: string; // MM/YY
	Email: string;
	Document?: string;
}

export interface NetworkToken {
	PaymentMethod: string; // mandatory when sending NetworkToken
	[extra: string]: unknown;
}

export interface CreateTransactionRequest {
	// Common headers are built in getHeaders; body fields:
	TrxToken?: string;
	NetworkToken?: NetworkToken;
	PaymentMethod?: string;
	UniqueID?: string;
	Capture?: boolean;
	TargetCountryISO: string;
	Currency: string;
	Amount: number;
	Tip?: number;
	TaxableAmount?: number;
	Installments?: number;
	Order: string;
	InvoiceNumber?: string;
	Description?: string;
	AdditionalData?: string;
	MetadataIn?: Record<string, unknown>;
	Customer?: Customer; // required unless using CommerceToken
	SoftDescriptor?: string;
	CardData?: CardData; // for secure-api direct flows
}

export interface PurchaseResponse {
	TransactionId: string;
	Result: string;
	Status: string;
	ErrorCode?: string | null;
	ErrorDescription?: string | null;
	Created?: string;
	AuthorizationDate?: string | null;
	AuthorizationCode?: string | null;
	Amount?: number;
	Currency?: string;
	Installments?: number | null;
	TaxableAmount?: number | null;
	Tip?: number | null;
	Url?: string;
	MetadataOut?: Record<string, unknown> | null;
	Action?: Record<string, unknown> | null;
	PaymentMethod?: Record<string, unknown> | null;
}

export interface ErrorResponse {
	ErrorCode: string;
	ErrorDescription: string;
}

export interface CancelTransactionRequest {
	Amount?: number; // optional partial cancel
}

export interface CancelTransactionResponse extends PurchaseResponse {}

export interface GetTransactionResponse extends PurchaseResponse {}
