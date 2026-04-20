// src/app/actions/contact.ts
'use server';

import { ContactNotificationEmail } from '@/emails/contact-notification';
import { contactSchema, MIN_RENDER_TO_SUBMIT_MS, type ContactFormInput } from '@/lib/contact-schema';
import { getClientIp, limitContact } from '@/lib/rate-limit';
import { getResend, resolveFromAddress, resolveToAddress } from '@/lib/resend';

/**
 * Result contract shared with the client form. Error codes are i18n keys
 * resolved against `contact.form.errors.*`. The shape is intentionally narrow
 * so the UI never has to branch on transport-level concerns.
 */
export type ContactSubmitResult = { ok: true } | { ok: false; code: 'rateLimited' | 'spamSuspected' | 'generic' };

/**
 * Server boundary takes the raw client-side input shape (`z.input`); after
 * `safeParse` succeeds the action operates on the parsed output internally.
 */
type SubmitInput = ContactFormInput & { locale?: 'tr' | 'en' };

/** Simulated server-side latency in mock mode so the UI submitting state is visible. */
const MOCK_LATENCY_MS = 700;

/**
 * Inbound lead pipeline: schema validation → honeypot/time-trap → IP rate-limit
 * → notification dispatch.
 *
 * Dispatch has two modes, switched by a single env var:
 *  - `RESEND_API_KEY` set    → real email via Resend (production path).
 *  - `RESEND_API_KEY` absent → mock mode: nothing leaves the server, the
 *                              payload is logged for inspection, the client
 *                              receives `{ ok: true }`. All anti-spam checks
 *                              still run so the demo behaves authentically.
 *
 * Treats every dispatch failure as a generic error so attackers can't probe
 * the pipeline by reading distinct error codes.
 */
export async function submitContact(input: SubmitInput): Promise<ContactSubmitResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, code: 'generic' };

  const values = parsed.data;

  if (values.company && values.company.length > 0) {
    return { ok: false, code: 'spamSuspected' };
  }

  if (Date.now() - values.renderedAt < MIN_RENDER_TO_SUBMIT_MS) {
    return { ok: false, code: 'spamSuspected' };
  }

  const ip = await getClientIp();
  const limit = await limitContact(`ip:${ip}`);
  if (!limit.success) return { ok: false, code: 'rateLimited' };

  const locale: 'tr' | 'en' = input.locale === 'en' ? 'en' : 'tr';
  const receivedAt = new Date().toISOString();

  const resend = getResend();

  if (!resend) {
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY_MS));
    console.info('[contact:mock] Submission accepted (no email sent — RESEND_API_KEY not set).', {
      receivedAt,
      locale,
      ip,
      name: values.name,
      email: values.email,
      phone: values.phone || null,
      interest: values.interest,
      region: values.region || null,
      messagePreview: values.message.slice(0, 120)
    });
    return { ok: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: resolveFromAddress(),
      to: resolveToAddress(),
      replyTo: values.email,
      subject: `Yeni iletişim talebi · ${values.name}`,
      react: ContactNotificationEmail({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        interest: values.interest,
        region: values.region || '',
        message: values.message,
        locale,
        ip,
        receivedAt
      })
    });

    if (error) {
      console.error('[contact] Resend send failed:', error);
      return { ok: false, code: 'generic' };
    }

    return { ok: true };
  } catch (err) {
    console.error('[contact] Unexpected send failure:', err);
    return { ok: false, code: 'generic' };
  }
}
