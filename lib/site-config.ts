/**
 * Site-wide configuration. Everything that has to be filled in before going
 * live is in this file — nothing else in the codebase carries a placeholder.
 */

/* On Vercel the deployment knows its own address. It is used for absolute
   links (share image, canonical) until a real domain is configured — but it
   does not make the site indexable; only NEXT_PUBLIC_SITE_URL does that. */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

/** Public origin, without a trailing slash. Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')
).replace(/\/$/, '');

/**
 * True once a real domain is configured. Until then robots.txt keeps crawlers
 * out, so a preview deployment can never be indexed by accident.
 */
export const SITE_IS_LIVE = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

/** Shown as the fallback contact when the form cannot send. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';

/**
 * Interest form delivery (app/api/interest). The sender's domain must be a
 * verified SES identity in SES_REGION, or SES rejects the message.
 */
export const INTEREST_MAIL_TO = process.env.INTEREST_MAIL_TO || CONTACT_EMAIL;
export const INTEREST_MAIL_FROM = process.env.INTEREST_MAIL_FROM || '';

/**
 * Provider details for the legal notice (§ 5 DDG) and the privacy policy.
 * Leave a field empty and the page prints "to be added" in its place.
 *
 * LEGAL_DRAFT keeps both pages out of search engines and shows a visible
 * draft notice. Set it to false only after the texts have been completed and
 * legally reviewed.
 */
export const LEGAL_DRAFT = true;

export const LEGAL = {
  operator: 'Katharina Heinschke',
  street: '',
  postalCity: '',
  country: 'Deutschland',
  email: CONTACT_EMAIL,
  phone: '',
  vatId: '',
  hosting: '',
} as const;
