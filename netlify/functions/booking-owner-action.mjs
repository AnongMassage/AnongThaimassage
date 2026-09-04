// netlify/functions/booking-owner-action.mjs
//
// Ziel der drei Buttons aus der Mail an das Massagestudio (notify-owner.mjs).
// - action=confirm    (GET)  -> bestätigt den angefragten Termin beim Kunden
// - action=decline    (GET)  -> sagt dem Kunden ab, bittet um neuen Termin
// - action=alt-form   (GET)  -> zeigt Saranya ein kleines Formular, um den
//                                tatsächlich vereinbarten Alternativtermin
//                                einzutragen (z.B. den aus den Anmerkungen)
// - action=alt-confirm(POST) -> verschickt die Bestätigung mit dem von
//                                Saranya eingetragenen Alternativtermin
//
// Jede Aktion prüft zuerst die Signatur, damit niemand durch Verändern der
// URL eine andere Aktion/andere Daten auslösen kann.
//
// E-Mail-Versand läuft über das bestehende web.de-Postfach (SMTP via
// nodemailer), nicht mehr über Resend.

import crypto from 'node:crypto';
import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const LINK_SECRET = process.env.LINK_SECRET;
const SITE_URL = process.env.URL;

const transporter = nodemailer.createTransport({
  host: 'smtp.web.de',
  port: 587,
  secure: false, // STARTTLS
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

export async function handler(event) {
  const params =
    event.httpMethod === 'POST'
      ? Object.fromEntries(new URLSearchParams(event.body))
      : event.queryStringParameters || {};

  const { action, name = '', email, date, time, sig } = params;

  if (!action || !email || !date || !time || !sig) {
    return page('Fehlerhafter Link', '<p>Dieser Link ist unvollständig oder ungültig.</p>');
  }

  // alt-confirm hat zusätzlich altDate/altTime, die nicht signiert sind
  // (Saranya trägt sie im Formular ein). Die Signatur bezieht sich immer
  // nur auf die ursprünglichen, aus der Owner-Mail stammenden Felder.
  const signedFields = { action: action === 'alt-confirm' ? 'alt-form' : action, name, email, date, time };
  if (!verify(signedFields, sig)) {
    return page('Ungültiger Link', '<p>Die Signatur dieses Links ist ungültig oder wurde manipuliert.</p>');
  }

  if (action === 'confirm') {
    await sendCustomerConfirmation({ name, email, date, time });
    return page('Termin bestätigt', `<p>Die Bestätigungsmail für <strong>${escapeHtml(date)}, ${escapeHtml(time)} Uhr</strong> wurde an ${escapeHtml(email)} verschickt.</p>`);
  }

  if (action === 'decline') {
    await sendCustomerDecline({ name, email, date, time });
    return page('Absage verschickt', `<p>Dem Kunden wurde mitgeteilt, dass der Termin am ${escapeHtml(date)} leider nicht möglich ist, und er um einen neuen Termin gebeten.</p>`);
  }

  if (action === 'alt-form') {
    const hiddenSig = sign(signedFields);
    return page(
      'Alternativtermin eintragen',
      `<form method="POST" action="/.netlify/functions/booking-owner-action" style="display:flex;flex-direction:column;gap:12px;max-width:320px;">
        <input type="hidden" name="action" value="alt-confirm" />
        <input type="hidden" name="name" value="${escapeHtml(name)}" />
        <input type="hidden" name="email" value="${escapeHtml(email)}" />
        <input type="hidden" name="date" value="${escapeHtml(date)}" />
        <input type="hidden" name="time" value="${escapeHtml(time)}" />
        <input type="hidden" name="sig" value="${hiddenSig}" />
        <label>Vereinbartes Datum<br/><input type="date" name="altDate" required /></label>
        <label>Vereinbarte Uhrzeit<br/><input type="time" name="altTime" required /></label>
        <button type="submit" style="padding:10px 16px;background:#8a5a2b;color:#fff;border:none;border-radius:6px;cursor:pointer;">
          Bestätigungsmail mit diesem Termin senden
        </button>
      </form>`
    );
  }

  if (action === 'alt-confirm') {
    const { altDate, altTime } = params;
    if (!altDate || !altTime) {
      return page('Angaben fehlen', '<p>Bitte Datum und Uhrzeit ausfüllen.</p>');
    }
    await sendCustomerConfirmation({ name, email, date: altDate, time: altTime, isAlternative: true });
    return page('Alternativtermin bestätigt', `<p>Die Bestätigungsmail für den neu vereinbarten Termin am <strong>${escapeHtml(altDate)}, ${escapeHtml(altTime)} Uhr</strong> wurde an ${escapeHtml(email)} verschickt.</p>`);
  }

  return page('Unbekannte Aktion', '<p>Diese Aktion wird nicht unterstützt.</p>');
}

async function sendCustomerConfirmation({ name, email, date, time, isAlternative }) {
  const cancelParams = { action: 'cancel', name, email, date, time };
  const cancelSig = sign(cancelParams);
  const cancelLink = `${SITE_URL}/.netlify/functions/booking-cancel?${new URLSearchParams({ ...cancelParams, sig: cancelSig })}`;

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;color:#222;">
      <h2 style="color:#2e7d32;">Dein Termin ist bestätigt</h2>
      <p>Hallo ${escapeHtml(name)},</p>
      <p>${isAlternative ? 'wir haben uns auf folgenden Termin geeinigt:' : 'dein Termin bei Anong Thai-Massage ist bestätigt:'}</p>
      <p style="font-size:18px;font-weight:bold;margin:8px 0 20px;">${escapeHtml(date)}, ${escapeHtml(time)} Uhr</p>
      <p>Solltest du doch verhindert sein:</p>
      <a href="${cancelLink}" style="display:inline-block;padding:12px 20px;background:#c62828;color:#fff;text-decoration:none;border-radius:6px;">
        Termin stornieren
      </a>
      <p style="margin-top:24px;">Wir freuen uns auf dich!<br/>Anong Thai-Massage</p>
    </div>`;

  await sendMail(email, 'Dein Termin bei Anong Thai-Massage ist bestätigt', html);
}

async function sendCustomerDecline({ name, email, date }) {
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;color:#222;">
      <h2 style="color:#c62828;">Dein Wunschtermin ist leider nicht verfügbar</h2>
      <p>Hallo ${escapeHtml(name)},</p>
      <p>leider ist dein angefragter Termin am ${escapeHtml(date)} bei uns nicht möglich.
      Bitte wähle gerne einen anderen Termin über unsere Website oder melde dich direkt bei uns.</p>
      <a href="${SITE_URL}" style="display:inline-block;margin-top:12px;padding:12px 20px;background:#8a5a2b;color:#fff;text-decoration:none;border-radius:6px;">
        Neuen Termin wählen
      </a>
      <p style="margin-top:24px;">Viele Grüße<br/>Anong Thai-Massage</p>
    </div>`;

  await sendMail(email, 'Zu deiner Terminanfrage bei Anong Thai-Massage', html);
}

async function sendMail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Anong Thai-Massage" <${EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('SMTP-Fehler:', err);
    throw new Error('Mailversand fehlgeschlagen');
  }
}

function sign(params) {
  const base = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join('&');
  return crypto.createHmac('sha256', LINK_SECRET).update(base).digest('hex').slice(0, 16);
}

function verify(params, sig) {
  try {
    const expected = sign(params);
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  } catch {
    return false;
  }
}

function page(title, bodyHtml) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: `<!doctype html><html lang="de"><head><meta charset="utf-8" />
      <title>${escapeHtml(title)}</title></head>
      <body style="font-family:sans-serif;max-width:480px;margin:60px auto;color:#222;">
        <h2>${escapeHtml(title)}</h2>
        ${bodyHtml}
      </body></html>`,
  };
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
