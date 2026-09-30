// Deliberately loose: something@something.something, no spaces.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Error for an email field, or undefined when it looks right. */
export function emailError(value: string) {
  if (!value) return "Please enter your email.";
  if (!EMAIL.test(value)) return "That email doesn’t look right — e.g. you@email.com.";
}
