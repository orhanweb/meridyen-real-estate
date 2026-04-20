// src/lib/contact-schema.ts
import type { DefaultValues } from 'react-hook-form';
import * as z from 'zod';
import { CONTACT_INTEREST_IDS, CONTACT_REGION_IDS } from '@/config/site.config';

/**
 * Shared contact-form contract used by:
 *   - the client form (react-hook-form + zodResolver),
 *   - the server runtime (Server Action / API route).
 *
 * Error messages are i18n keys (relative to `contact.form.errors.*`) — the
 * UI resolves them via next-intl. This keeps the schema locale-agnostic.
 *
 * Anti-spam fields (`company` honeypot, `renderedAt` time-trap) live on the
 * schema so client and server share one source of truth.
 *
 * NOTE: with Zod v4 + @hookform/resolvers you must `import * as z from 'zod'`
 *       (named import breaks resolver typings).
 */

/** Permissive but realistic phone shape: country code optional, 7–20 digits. */
const PHONE_REGEX = /^[+()\d\s-]{7,24}$/;

/** Window (ms) below which a submit is treated as a bot — humans need ~2s+. */
export const MIN_RENDER_TO_SUBMIT_MS = 2000;

export const contactSchema = z.object({
  name: z.string().trim().min(2, { message: 'name' }).max(80, { message: 'nameMax' }),

  email: z.email({ message: 'email' }).max(254, { message: 'email' }),

  phone: z.string().trim().regex(PHONE_REGEX, { message: 'phone' }).optional().or(z.literal('')),

  interest: z.enum(CONTACT_INTEREST_IDS, { message: 'interest' }),

  region: z.enum(CONTACT_REGION_IDS).optional().or(z.literal('')),

  message: z.string().trim().min(10, { message: 'messageMin' }).max(1000, { message: 'messageMax' }),

  consent: z.literal(true, { message: 'consent' }),

  /** Honeypot — must stay empty. Hidden from real users via CSS + aria. */
  company: z.string().max(0, { message: 'spamSuspected' }).optional().default(''),

  /** Epoch ms set when the form mounts; server enforces MIN_RENDER_TO_SUBMIT_MS. */
  renderedAt: z.number().int().nonnegative()
});

/**
 * Raw form values as the user types — what react-hook-form drives.
 * Differs from the output type because of `.optional().default(...)` and
 * `z.literal(true)` fields that may legitimately be `undefined` pre-submit.
 */
export type ContactFormInput = z.input<typeof contactSchema>;

/** Parsed values after schema validation — what the server consumes. */
export type ContactFormValues = z.output<typeof contactSchema>;

/**
 * Default values applied at form mount. Required fields with literal/enum
 * shapes (`consent`, `interest`, `region`) start `undefined` — the schema
 * blocks submission until the user supplies a real value, and the controls
 * carry their own placeholder/unchecked state.
 * `renderedAt` is overwritten with `Date.now()` inside the form on mount.
 */
export const contactDefaults: DefaultValues<ContactFormInput> = {
  name: '',
  email: '',
  phone: '',
  interest: undefined,
  region: undefined,
  message: '',
  consent: undefined,
  company: '',
  renderedAt: 0
};
