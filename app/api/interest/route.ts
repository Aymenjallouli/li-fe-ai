import {SESClient, SendEmailCommand} from '@aws-sdk/client-ses';
import {INTEREST_MAIL_FROM, INTEREST_MAIL_TO} from '@/lib/site-config';

/**
 * POST /api/interest — a registration of interest from the landing page.
 *
 * Takes the fields itself and sends the mail server-side through Amazon SES,
 * with Reply-To set to the visitor so that answering the notification reaches
 * them directly.
 *
 * What it needs deployed: INTEREST_MAIL_TO and INTEREST_MAIL_FROM (see
 * .env.example), the sender's domain verified as an SES identity in
 * SES_REGION, and ses:SendEmail on the server's role or credentials.
 *
 * Until that is configured the route refuses honestly: in development it logs
 * the submission and answers ok, so the form can be exercised; in production
 * it answers 503 and the form shows its fallback. It never reports a delivery
 * that did not happen.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Deliberately not AWS_REGION: a Lambda sets that itself to wherever it runs,
   and SES identities are per-region. Frankfurt by default. */
const REGION = process.env.SES_REGION || 'eu-central-1';

/* Module scope, so a warm instance reuses credentials and the socket.
   Construction is lazy — nothing is resolved until the first send. */
const ses = new SESClient({region: REGION});

const LIMITS = {name: 120, email: 254, message: 3000} as const;

/* Deliberately loose. Strict address grammar rejects real addresses more often
   than it catches typos; the address is proven by whether the reply arrives. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * One submission per address per minute, held in module scope. It resets when
 * the instance is recycled, so it is a courtesy brake on a double-tapped
 * button, not a security control; the honeypot turns away drive-by bots.
 */
const recent = new Map<string, number>();
const WINDOW_MS = 60_000;

function tooSoon(key: string) {
  const now = Date.now();
  for (const [k, at] of recent) if (now - at > WINDOW_MS) recent.delete(k);
  const last = recent.get(key);
  if (last && now - last < WINDOW_MS) return true;
  recent.set(key, now);
  return false;
}

const bad = (error: string, status = 400) => Response.json({ok: false, error}, {status});

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad('invalid');
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const name = str(body.name);
  const email = str(body.email);
  const message = str(body.message);
  const role = str(body.role) === 'partner' ? 'partner' : 'private';
  const pilot = body.pilot === true && role === 'private';
  const locale = str(body.locale) === 'en' ? 'en' : 'de';

  /* Filled only by bots. Answered with 200 so there is nothing to tune against. */
  if (str(body.website)) return Response.json({ok: true});

  if (!name || name.length > LIMITS.name) return bad('name');
  if (!EMAIL.test(email) || email.length > LIMITS.email) return bad('email');
  if (message.length > LIMITS.message) return bad('message');
  if (body.consent !== true) return bad('consent');

  if (tooSoon(email.toLowerCase())) return bad('rate', 429);

  const lines = [
    `Name:      ${name}`,
    `E-Mail:    ${email}`,
    `Interesse: ${role === 'partner' ? 'Organisation / Partner' : 'Privatperson'}`,
    ...(role === 'private' ? [`Pilotphase: ${pilot ? 'ja, möchte teilnehmen' : 'nicht angegeben'}`] : []),
    `Sprache:   ${locale === 'en' ? 'Englisch' : 'Deutsch'}`,
    `Einwilligung zur Kontaktaufnahme: erteilt am ${new Date().toISOString()}`,
    '',
    message || '(keine Nachricht)',
    '',
    '— gesendet über das Formular auf der Website von Projekt L.E.B.E.N.',
  ].join('\n');

  if (!INTEREST_MAIL_TO || !INTEREST_MAIL_FROM) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[interest] mail delivery is not configured — submission logged instead:\n' + lines);
      return Response.json({ok: true, dev: true});
    }
    console.error('[interest] INTEREST_MAIL_TO / INTEREST_MAIL_FROM are not set; submission refused');
    return bad('send', 503);
  }

  try {
    await ses.send(
      new SendEmailCommand({
        Source: INTEREST_MAIL_FROM,
        Destination: {ToAddresses: [INTEREST_MAIL_TO]},
        ReplyToAddresses: [email],
        Message: {
          Subject: {
            Data: `${role === 'partner' ? 'Kooperationsanfrage' : pilot ? 'Vormerkung (Pilotphase)' : 'Vormerkung'} — ${name}`,
            Charset: 'UTF-8',
          },
          Body: {Text: {Data: lines, Charset: 'UTF-8'}},
        },
      }),
    );
  } catch (err) {
    console.error('[interest] SES send failed', err);
    return bad('send', 502);
  }

  return Response.json({ok: true});
}
