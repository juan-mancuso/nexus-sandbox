import { Merchant } from './client.interface';

export interface NetworkToken {
	[key: string]: unknown;
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

export interface CardData {
	CardHolderName: string;
	Pan: string;
	CVV: string;
	Expiration: string;
	Email: string;
	Document?: string;
}

export interface CreateTransactionRequest {
	TrxToken?: string;
	NetworkToken?: NetworkToken | null;
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
	MetadataIn?: Record<string, string>;
	Customer?: Customer;
	SoftDescriptor?: string;
	CardData?: CardData;
}

export type PurchaseResponse = Record<string, unknown>;

export interface CreateTransactionResponse extends PurchaseResponse {}

export interface CaptureRequest {
	Amount?: number;
}

export interface CancelRequest {
	Amount?: number;
}

export interface RefundRequest {
	Amount?: number;
	MetadataIn?: {
		Description?: string;
	};
}

export interface CaptureResponse extends PurchaseResponse {}
export interface CancelResponse extends PurchaseResponse {}
export interface RefundResponse extends PurchaseResponse {}
export interface GetTransactionResponse extends PurchaseResponse {}

export { Merchant };
