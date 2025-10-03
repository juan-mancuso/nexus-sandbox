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
	DocumentType?: string; // format DOCUMENT.COUNTRY (e.g., CPF.BR)
	Email: string;
	Address?: Address;
}

export interface NetworkToken {
	// PaymentMethod is mandatory when sending a NetworkToken.
	PaymentMethod: string;
	// Additional token fields are provider-specific and optional
	[key: string]: any;
}

export interface CardData {
	CardHolderName: string;
	Pan: string;
	CVV: string;
	Expiration: string; // MM/YY
	Email: string;
	Document?: string;
}

export interface CreatePaymentRequest {
	// Either TrxToken/NetworkToken/PaymentMethod or CardData (secure flow) are used
	TrxToken?: string;
	NetworkToken?: NetworkToken;
	PaymentMethod?: string;
	UniqueID?: string;
	Capture?: boolean;
	TargetCountryISO: string;
	Currency: string;
	Amount: number; // smallest unit (integer)
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
	CardData?: CardData; // use only for PCI direct flow (secure api)
}

export interface ActionObject {
	// action object is loosely defined by API — keep as index signature
	[type: string]: any;
}

export interface PaymentMethodObject {
	[type: string]: any;
}

export interface CreatePaymentResponse {
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
	Action?: ActionObject | null;
	PaymentMethod?: PaymentMethodObject | null;
}

export interface GetPaymentResponse extends CreatePaymentResponse {}

export interface CancelPaymentRequest {
	Amount?: number; // optional partial cancel amount in smallest unit
}

export interface CancelPaymentResponse extends CreatePaymentResponse {
	Status: 'CANCELLED';
}

export interface RefundPaymentResponse {
	// Placeholder for future refund response
	message?: string;
}
