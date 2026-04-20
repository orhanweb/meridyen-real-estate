// src/emails/contact-notification.tsx
import { Body, Container, Head, Heading, Hr, Html, Preview, Row, Section, Text } from '@react-email/components';
import type { ContactInterestId, ContactRegionId } from '@/config/site.config';

/**
 * Inbound lead notification rendered server-side by Resend.
 * Locale is intentionally `tr` only — the inbox owner reads Turkish.
 *
 * react-email components compile to inline-styled tables that render reliably
 * across major mail clients (Gmail / Outlook / Apple Mail), so prefer them
 * over plain Tailwind classes here.
 */

export type ContactNotificationProps = {
  name: string;
  email: string;
  phone?: string;
  interest: ContactInterestId;
  region?: ContactRegionId | '';
  message: string;
  /** Locale of the page the lead came from — surfaced in the footer for context. */
  locale: 'tr' | 'en';
  /** Best-effort client IP (for abuse triage). */
  ip: string;
  /** ISO timestamp of receipt. */
  receivedAt: string;
};

const INTEREST_LABEL_TR: Record<ContactInterestId, string> = {
  residential: 'Konut Alımı / Satımı',
  rental: 'Kiralama',
  investment: 'Yatırım Danışmanlığı',
  commercial: 'Ticari Gayrimenkul',
  valuation: 'Değerleme & Ekspertiz',
  portfolio: 'Portföy Yönetimi',
  other: 'Diğer'
};

const REGION_LABEL_TR: Record<ContactRegionId, string> = {
  cankaya: 'Çankaya',
  cayyolu: 'Çayyolu',
  bilkent: 'Bilkent',
  oran: 'Oran',
  beysukent: 'Beysukent',
  kecioren: 'Keçiören',
  other: 'Diğer / Belirtilmedi'
};

export function ContactNotificationEmail({ name, email, phone, interest, region, message, locale, ip, receivedAt }: ContactNotificationProps) {
  const previewText = `${name} • ${INTEREST_LABEL_TR[interest]}`;
  const regionLabel = region ? REGION_LABEL_TR[region] : '—';

  return (
    <Html lang="tr">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>Meridyen Gayrimenkul</Text>
            <Heading as="h1" style={h1}>
              Yeni iletişim talebi
            </Heading>
            <Text style={lead}>{name} sizinle iletişime geçmek istiyor.</Text>
          </Section>

          <Section style={card}>
            <Field label="Ad Soyad" value={name} />
            <Field label="E-posta" value={email} href={`mailto:${email}`} />
            {phone ? <Field label="Telefon" value={phone} href={`tel:${phone.replace(/\s+/g, '')}`} /> : null}
            <Field label="İlgi alanı" value={INTEREST_LABEL_TR[interest]} />
            <Field label="Bölge" value={regionLabel} />
          </Section>

          <Section style={messageCard}>
            <Text style={messageLabel}>Mesaj</Text>
            <Text style={messageBody}>{message}</Text>
          </Section>

          <Hr style={divider} />

          <Section>
            <Row>
              <Text style={meta}>Alındı: {receivedAt}</Text>
              <Text style={meta}>Sayfa dili: {locale.toUpperCase()}</Text>
              <Text style={meta}>IP: {ip}</Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function Field({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <Row style={fieldRow}>
      <Text style={fieldLabel}>{label}</Text>
      {href ? (
        <Text style={fieldValue}>
          <a href={href} style={link}>
            {value}
          </a>
        </Text>
      ) : (
        <Text style={fieldValue}>{value}</Text>
      )}
    </Row>
  );
}

const body: React.CSSProperties = {
  backgroundColor: '#f5f3ee',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: '32px 0'
};

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '32px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
};

const header: React.CSSProperties = { paddingBottom: '8px' };

const brand: React.CSSProperties = {
  color: '#0d2240',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  margin: '0 0 12px',
  textTransform: 'uppercase'
};

const h1: React.CSSProperties = {
  color: '#0d2240',
  fontSize: '24px',
  fontWeight: 600,
  letterSpacing: '-0.01em',
  lineHeight: 1.3,
  margin: '0 0 8px'
};

const lead: React.CSSProperties = {
  color: '#4a5468',
  fontSize: '14px',
  lineHeight: 1.6,
  margin: 0
};

const card: React.CSSProperties = {
  backgroundColor: '#fafaf7',
  border: '1px solid #e8e4dc',
  borderRadius: '8px',
  margin: '24px 0',
  padding: '20px 24px'
};

const fieldRow: React.CSSProperties = {
  borderBottom: '1px solid #ece8df',
  padding: '10px 0'
};

const fieldLabel: React.CSSProperties = {
  color: '#7a8295',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.06em',
  margin: '0 0 4px',
  textTransform: 'uppercase'
};

const fieldValue: React.CSSProperties = {
  color: '#11192b',
  fontSize: '15px',
  fontWeight: 500,
  lineHeight: 1.5,
  margin: 0
};

const link: React.CSSProperties = { color: '#11192b', textDecoration: 'underline' };

const messageCard: React.CSSProperties = {
  backgroundColor: '#fdfcf9',
  border: '1px solid #e8e4dc',
  borderLeft: '3px solid #c39e5b',
  borderRadius: '8px',
  margin: '0 0 24px',
  padding: '20px 24px'
};

const messageLabel: React.CSSProperties = {
  color: '#7a8295',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.06em',
  margin: '0 0 8px',
  textTransform: 'uppercase'
};

const messageBody: React.CSSProperties = {
  color: '#11192b',
  fontSize: '14px',
  lineHeight: 1.7,
  margin: 0,
  whiteSpace: 'pre-wrap'
};

const divider: React.CSSProperties = {
  borderColor: '#e8e4dc',
  borderStyle: 'solid',
  borderWidth: '1px 0 0',
  margin: '8px 0 16px'
};

const meta: React.CSSProperties = {
  color: '#9aa1b1',
  fontSize: '11px',
  margin: '2px 0'
};

export default ContactNotificationEmail;
