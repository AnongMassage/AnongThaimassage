// netlify/functions/notify-owner.mjs
//
// Wird automatisch aufgerufen, sobald über das Buchungsformular eine neue
// Terminanfrage eingeht (Netlify "Outgoing Webhook" auf das Formular,
// siehe SETUP.md). Verschickt eine Mail ANS MASSAGESTUDIO mit drei
// klickbaren Optionen:
//
//   1. "Termin bestätigen"            -> bestätigt den angefragten Termin
//   2. "Alternativtermin bestätigen"  -> öffnet ein kleines Formular, in
//                                        das Saranya den tatsächlich
//                                        vereinbarten Termin einträgt
//                                        (z.B. den in den Anmerkungen
//                                        genannten) - wird NIE automatisch
//                                        aus dem Freitext geraten
//   3. "Termin geht leider nicht"     -> schickt dem Kunden eine Absage
//
// Jeder Link ist signiert (siehe sign()), damit niemand durch Verändern
// der URL eine falsche Aktion auslösen kann.
//
// E-Mail-Versand läuft über das bestehende web.de-Postfach (SMTP via
// nodemailer), nicht mehr über Resend.

import crypto from 'node:crypto';
import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL;
const LINK_SECRET = process.env.LINK_SECRET;
const SITE_URL = process.env.URL; // von Netlify automatisch gesetzt

const transporter = nodemailer.createTransport({
  host: 'smtp.web.de',
  port: 587,
  secure: false, // STARTTLS
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  if (!EMAIL_USER || !EMAIL_PASS || !BUSINESS_EMAIL || !LINK_SECRET) {
    console.error('EMAIL_USER, EMAIL_PASS, BUSINESS_EMAIL oder LINK_SECRET fehlt.');
    return { statusCode: 500, body: 'Server nicht korrekt konfiguriert.' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    console.error('Konnte Webhook-Body nicht parsen:', err, event.body);
    return { statusCode: 400, body: 'Ungültiger Payload.' };
  }

  console.log('Eingehender Webhook-Payload:', JSON.stringify(body));
  const data = body?.payload?.data || body?.data || {};

  // ⚠️ ANPASSEN, falls eure echten Formular-Feldnamen anders heißen.
  const name = data.name || data.Name || '';
  const email = data.email || data.Email || '';
  const date = data.date || data.datum || '';
  const time = data.time || data.uhrzeit || '';
  const notes = data.notes || data.anmerkungen || data.message || '';

  if (!email || !date || !time) {
    console.error('Pflichtfelder fehlen, breche ab.', { name, email, date, time });
    return { statusCode: 200, body: 'Fehlende Pflichtfelder – keine Mail verschickt.' };
  }

  const base = { name, email, date, time };
  const confirmLink = buildLink('confirm', base);
  const altFormLink = buildLink('alt-form', base);
  const declineLink = buildLink('decline', base);

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:auto;color:#222;">
      <h2 style="color:#8a5a2b;">Neue Terminanfrage</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}<br/>
         <strong>E-Mail:</strong> ${escapeHtml(email)}<br/>
         <strong>Angefragter Termin:</strong> ${escapeHtml(date)}, ${escapeHtml(time)} Uhr</p>
      ${notes ? `<p><strong>Anmerkung des Kunden:</strong><br/>${escapeHtml(notes)}</p>` : ''}
      <div style="margin:28px 0;">
        <a href="${confirmLink}" style="display:inline-block;margin:4px 0;padding:12px 18px;
           background:#2e7d32;color:#fff;text-decoration:none;border-radius:6px;">
           ✅ Termin bestätigen
        </a><br/>
        <a href="${altFormLink}" style="display:inline-block;margin:4px 0;padding:12px 18px;
           background:#8a5a2b;color:#fff;text-decoration:none;border-radius:6px;">
           📅 Alternativtermin bestätigen
        </a><br/>
        <a href="${declineLink}" style="display:inline-block;margin:4px 0;padding:12px 18px;
           background:#c62828;color:#fff;text-decoration:none;border-radius:6px;">
           ❌ Termin geht leider nicht
        </a>
      </div>
      <p style="font-size:13px;color:#666;">Ein Klick genügt – der Kunde bekommt danach
      automatisch die passende Mail von uns.</p>
    </div>`;

  try {
    await transporter.sendMail({
      from: `"Anong Thai-Massage" <${EMAIL_USER}>`,
      to: BUSINESS_EMAIL,
      subject: `Neue Terminanfrage: ${name || email}`,
      html,
    });
  } catch (err) {
    console.error('SMTP-Fehler:', err);
    return { statusCode: 502, body: 'Mail konnte nicht verschickt werden.' };
  }

  return { statusCode: 200, body: 'OK' };
}

function buildLink(action, params) {
  const withAction = { action, ...params };
  const sig = sign(withAction);
  const qs = new URLSearchParams({ ...withAction, sig }).toString();
  return `${SITE_URL}/.netlify/functions/booking-owner-action?${qs}`;
}

function sign(params) {
  const base = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return crypto.createHmac('sha256', LINK_SECRET).update(base).digest('hex').slice(0, 16);
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
