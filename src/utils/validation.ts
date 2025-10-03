import { CreatePaymentRequest } from "../interfaces/bamboopayments.interface";

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidAmount(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 && Math.floor(value) === value;
}

export function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  // Very small / permissive email regexp — advisory only
  return /.+@.+\..+/.test(value);
}

// Advisory validator: returns an array of validation messages. Does not throw.
export function validateCreatePaymentRequest(payload: CreatePaymentRequest): string[] {
  const errors: string[] = [];
  if (!isNonEmptyString(payload.TargetCountryISO)) errors.push("TargetCountryISO is required and must be a non-empty string");
  if (!isNonEmptyString(payload.Currency)) errors.push("Currency is required and must be a non-empty string");
  if (!isValidAmount(payload.Amount)) errors.push("Amount is required, must be an integer in the smallest unit and greater than zero");
  if (!isNonEmptyString(payload.Order)) errors.push("Order is required and must be a non-empty string");
  if (!payload.Customer || !isValidEmail(payload.Customer.Email)) errors.push("Customer.email is required and must be a valid email");
  return errors;
}
