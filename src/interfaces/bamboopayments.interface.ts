export interface NetworkToken {
  PaymentMethod: string;
  // Additional properties returned by network token providers — keep generic but strongly typed as record
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
  DocumentType?: string; // e.g. CPF.BR
  Email: string;
  Address?: Address;
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
  // Headers like Authorization and Content-Type are handled by the SDK — not part of the request body types
  TrxToken?: string;
  NetworkToken?: NetworkToken;
  PaymentMethod?: string;
  UniqueID?: string;
  Capture?: boolean;
  TargetCountryISO: string;
  Currency: string;
  Amount: number; // integer in smallest unit
  Tip?: number;
  TaxableAmount?: number;
  Installments?: number;
  Order: string;
  InvoiceNumber?: string;
  Description?: string;
  AdditionalData?: string;
  MetadataIn?: Record<string, string> | null;
  Customer: Customer;
  SoftDescriptor?: string;
  // PCI direct card flow
  CardData?: CardData;
}

export interface CreatePaymentResponse {
  TransactionId: string;
  Result: string;
  Status: string;
  ErrorCode?: string | null;
  ErrorDescription?: string | null;
  Created?: string; // ISO 8601
  AuthorizationDate?: string | null;
  AuthorizationCode?: string | null;
  Amount?: number;
  Currency?: string;
  Installments?: number | null;
  TaxableAmount?: number | null;
  Tip?: number | null;
  Url?: string | null;
  MetadataOut?: Record<string, unknown> | null;
  Action?: Record<string, unknown> | null;
  PaymentMethod?: Record<string, unknown> | null;
}

export interface GetPaymentResponse extends CreatePaymentResponse {}

export interface CancelPaymentRequest {
  Amount?: number; // optional partial cancel amount in smallest unit
}

export interface CancelPaymentResponse extends CreatePaymentResponse {
  Status: "CANCELLED" | string;
}

export interface RefundPaymentResponse {
  // Placeholder: BambooPayments does not expose a refund endpoint in the provided API spec
  // When/if implemented this interface should mirror the API response for refunds
  Message: string;
  Code?: string;
}
