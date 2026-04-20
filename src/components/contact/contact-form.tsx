// src/components/contact/contact-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { track } from '@vercel/analytics';
import { CheckCircle2, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { submitContact } from '@/app/actions/contact';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CONTACT_INTEREST_IDS, CONTACT_REGION_IDS, siteConfig } from '@/config/site.config';
import { contactDefaults, contactSchema, type ContactFormInput, type ContactFormValues } from '@/lib/contact-schema';

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Master client form for the contact section.
 *  - Two-layer validation: zod schema is the source of truth on both client
 *    and server; this component renders it via react-hook-form.
 *  - Anti-spam: hidden honeypot field + time-trap (renderedAt set on mount,
 *    server enforces a minimum render-to-submit delta of MIN_RENDER_TO_SUBMIT_MS).
 *  - Errors are rendered as i18n keys by the schema and resolved here.
 *  - Submission swaps to a success card with a polite re-entry CTA.
 */
export function ContactForm() {
  const t = useTranslations('contact.form');
  const tInterest = useTranslations('contact.form.fields.interest.options');
  const tRegion = useTranslations('contact.form.fields.region.options');
  const locale = useLocale();
  const [success, setSuccess] = useState(false);

  const form = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactDefaults,
    mode: 'onTouched'
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = form;

  /** Stamp the time-trap once the form mounts on the client. */
  useEffect(() => {
    setValue('renderedAt', Date.now(), { shouldValidate: false, shouldDirty: false });
  }, [setValue]);

  const resolveError = (key?: string): string | undefined => (key ? t(`errors.${key}`) : undefined);

  const onSubmit = async (values: ContactFormValues) => {
    const result = await submitContact({ ...values, locale: locale === 'en' ? 'en' : 'tr' });

    if (result.ok) {
      track('lead_captured', {
        interest: values.interest,
        region: values.region ?? 'unspecified',
        locale
      });
      setSuccess(true);
      toast.success(t('success.title'));
      reset({ ...contactDefaults, renderedAt: Date.now() });
      return;
    }

    const message = t(`errors.${result.code}`);
    toast.error(message);
  };

  const startOver = () => {
    setSuccess(false);
    reset({ ...contactDefaults, renderedAt: Date.now() });
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease }}
            className="flex flex-col items-start gap-5 py-6"
          >
            <div className="inline-flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="size-6" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">{t('success.title')}</h3>
              <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
                {t('success.description', { hours: siteConfig.contact.responseHours })}
              </p>
            </div>
            <Button type="button" variant="outline" size="md" onClick={startOver}>
              {t('success.again')}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-describedby="contact-form-required-hint"
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">{t('title')}</h3>
              <p className="text-sm text-muted-foreground">{t('description')}</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field id="contact-name" label={t('fields.name.label')} required error={resolveError(errors.name?.message)}>
                {a11y => <Input {...register('name')} {...a11y} placeholder={t('fields.name.placeholder')} autoComplete="name" spellCheck={false} />}
              </Field>

              <Field id="contact-email" label={t('fields.email.label')} required error={resolveError(errors.email?.message)}>
                {a11y => (
                  <Input
                    {...register('email')}
                    {...a11y}
                    type="email"
                    inputMode="email"
                    placeholder={t('fields.email.placeholder')}
                    autoComplete="email"
                    spellCheck={false}
                  />
                )}
              </Field>

              <Field id="contact-phone" label={t('fields.phone.label')} hint={t('fields.phone.hint')} error={resolveError(errors.phone?.message)}>
                {a11y => (
                  <Input {...register('phone')} {...a11y} type="tel" inputMode="tel" placeholder={t('fields.phone.placeholder')} autoComplete="tel" />
                )}
              </Field>

              <Field id="contact-interest" label={t('fields.interest.label')} required error={resolveError(errors.interest?.message)}>
                {a11y => (
                  <Select {...register('interest')} {...a11y} defaultValue="">
                    <option value="" disabled>
                      {t('fields.interest.placeholder')}
                    </option>
                    {CONTACT_INTEREST_IDS.map(id => (
                      <option key={id} value={id}>
                        {tInterest(id)}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>

              <Field id="contact-region" label={t('fields.region.label')} error={resolveError(errors.region?.message)} className="sm:col-span-2">
                {a11y => (
                  <Select {...register('region')} {...a11y} defaultValue="">
                    <option value="">{t('fields.region.placeholder')}</option>
                    {CONTACT_REGION_IDS.map(id => (
                      <option key={id} value={id}>
                        {tRegion(id)}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            </div>

            <Field id="contact-message" label={t('fields.message.label')} required error={resolveError(errors.message?.message)}>
              {a11y => <Textarea {...register('message')} {...a11y} rows={5} placeholder={t('fields.message.placeholder')} maxLength={1000} />}
            </Field>

            {/* Honeypot — visually hidden + out of tab order; data-* attributes opt out of password manager autofill so humans never trip the trap. */}
            <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
              <label htmlFor="contact-company">{t('honeypot')}</label>
              <input
                {...register('company')}
                id="contact-company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                data-1p-ignore="true"
                data-lpignore="true"
                data-bwignore="true"
                data-protonpass-ignore="true"
                data-form-type="other"
              />
            </div>

            <Checkbox
              {...register('consent')}
              id="contact-consent"
              required
              label={t('fields.consent.label')}
              error={resolveError(errors.consent?.message)}
            />

            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p id="contact-form-required-hint" className="text-xs text-muted-foreground">
                {t('requiredHint')}
              </p>
              <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="sm:ml-auto">
                <Send />
                {isSubmitting ? t('submitting') : t('submit')}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
