const PHONE_FORMAT_REGEX = /^\+?[\d\s\-()]+$/;
const MIN_PHONE_DIGITS = 8;
const MAX_PHONE_DIGITS = 15;

export function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed || !PHONE_FORMAT_REGEX.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "").length;
  return digits >= MIN_PHONE_DIGITS && digits <= MAX_PHONE_DIGITS;
}

export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

export const PHONE_VALIDATION_MESSAGE =
  "Enter a valid international number (e.g. +1 555 000 0000).";

export const PHONE_PLACEHOLDER = "+1 555 000 0000";
