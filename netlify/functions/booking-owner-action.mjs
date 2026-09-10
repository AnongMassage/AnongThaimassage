// netlify/functions/booking-owner-action.mjs
//
// Ziel der drei Buttons aus der Mail an das Massagestudio (notify-owner.mjs).
// Jede Aktion führt jetzt zuerst zu einer kleinen Zwischenseite mit einem
// optionalen Textfeld ("Persönliche Nachricht") - damit Saranya z.B. auf
// einen Kommentar des Kunden eingehen kann, bevor die Mail verschickt wird.
//
// - action=confirm      (GET)  -> Zwischenseite mit optionalem Nachrichtenfeld
// - action=confirm-send (POST) -> verschickt die Bestätigung (+ ggf. Nachricht)
// - action=decline      (GET)  -> Zwischenseite mit optionalem Nachrichtenfeld
// - action=decline-send (POST) -> verschickt die Absage (+ ggf. Nachricht)
// - action=alt-form     (GET)  -> Formular für Alternativtermin + Nachricht
// - action=alt-confirm  (POST) -> verschickt Bestätigung mit Alternativtermin
//
// Jede Aktion prüft zuerst die Signatur, damit niemand durch Verändern der
// URL eine andere Aktion/andere Daten auslösen kann. Die Nachricht selbst
// ist bewusst nicht Teil der Signatur (freier Text von Saranya, die sich ja
// bereits über den signierten Link authentisiert hat).
//
// E-Mail-Versand läuft über das bestehende web.de-Postfach (SMTP via
// nodemailer).

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

  // Die Signatur bezieht sich immer nur auf die ursprünglichen, aus der
  // Owner-Mail stammenden Felder - nicht auf action-send-Varianten oder die
  // freie Nachricht.
  const baseAction =
    action === 'confirm-send' ? 'confirm' :
    action === 'decline-send' ? 'decline' :
    action === 'alt-confirm' ? 'alt-form' :
    action;
  const signedFields = { action: baseAction, name, email, date, time };
  if (!verify(signedFields, sig)) {
    return page('Ungültiger Link', '<p>Die Signatur dieses Links ist ungültig oder wurde manipuliert.</p>');
  }

  // --- Schritt 1: Zwischenseiten mit optionalem Nachrichtenfeld ---

  if (action === 'confirm') {
    return messageFormPage({
      title: 'Termin bestätigen',
      intro: `<p>Termin: <strong>${escapeHtml(date)}, ${escapeHtml(time)} Uhr</strong> für ${escapeHtml(name)} (${escapeHtml(email)})</p>`,
      nextAction: 'confirm-send',
      buttonLabel: 'Bestätigung jetzt senden',
      buttonColor: '#2e7d32',
      fields: signedFields,
      sig,
    });
  }

  if (action === 'decline') {
    return messageFormPage({
      title: 'Termin absagen',
      intro: `<p>Angefragter Termin: <strong>${escapeHtml(date)}, ${escapeHtml(time)} Uhr</strong> für ${escapeHtml(name)} (${escapeHtml(email)})</p>`,
      nextAction: 'decline-send',
      buttonLabel: 'Absage jetzt senden',
      buttonColor: '#c62828',
      fields: signedFields,
      sig,
    });
  }

  if (action === 'alt-form') {
    return page(
      'Alternativtermin eintragen',
      `<form method="POST" action="/.netlify/functions/booking-owner-action" style="display:flex;flex-direction:column;gap:12px;max-width:360px;">
        <input type="hidden" name="action" value="alt-confirm" />
        <input type="hidden" name="name" value="${escapeHtml(name)}" />
        <input type="hidden" name="email" value="${escapeHtml(email)}" />
        <input type="hidden" name="date" value="${escapeHtml(date)}" />
        <input type="hidden" name="time" value="${escapeHtml(time)}" />
        <input type="hidden" name="sig" value="${sig}" />
        <label>Vereinbartes Datum<br/><input type="date" name="altDate" required /></label>
        <label>Vereinbarte Uhrzeit<br/><input type="time" name="altTime" required /></label>
        <label>Persönliche Nachricht (optional)<br/>
          <textarea name="customMessage" rows="4" style="width:100%;font-family:inherit;" placeholder="z.B. Antwort auf den Kommentar des Kunden..."></textarea>
        </label>
        <button type="submit" style="padding:10px 16px;background:#8a5a2b;color:#fff;border:none;border-radius:6px;cursor:pointer;">
          Bestätigungsmail mit diesem Termin senden
        </button>
      </form>`
    );
  }

  // --- Schritt 2: tatsächlicher Versand ---

  if (action === 'confirm-send') {
    await sendCustomerConfirmation({ name, email, date, time, customMessage: params.customMessage });
    return page('Termin bestätigt', `<p>Die Bestätigungsmail für <strong>${escapeHtml(date)}, ${escapeHtml(time)} Uhr</strong> wurde an ${escapeHtml(email)} verschickt.</p>`);
  }

  if (action === 'decline-send') {
    await sendCustomerDecline({ name, email, date, customMessage: params.customMessage });
    return page('Absage verschickt', `<p>Dem Kunden wurde mitgeteilt, dass der Termin am ${escapeHtml(date)} leider nicht möglich ist.</p>`);
  }

  if (action === 'alt-confirm') {
    const { altDate, altTime, customMessage } = params;
    if (!altDate || !altTime) {
      return page('Angaben fehlen', '<p>Bitte Datum und Uhrzeit ausfüllen.</p>');
    }
    await sendCustomerConfirmation({ name, email, date: altDate, time: altTime, isAlternative: true, customMessage });
    return page('Alternativtermin bestätigt', `<p>Die Bestätigungsmail für den neu vereinbarten Termin am <strong>${escapeHtml(altDate)}, ${escapeHtml(altTime)} Uhr</strong> wurde an ${escapeHtml(email)} verschickt.</p>`);
  }

  return page('Unbekannte Aktion', '<p>Diese Aktion wird nicht unterstützt.</p>');
}

function messageFormPage({ title, intro, nextAction, buttonLabel, buttonColor, fields, sig }) {
  return page(
    title,
    `${intro}
    <form method="POST" action="/.netlify/functions/booking-owner-action" style="display:flex;flex-direction:column;gap:12px;max-width:360px;margin-top:16px;">
      <input type="hidden" name="action" value="${nextAction}" />
      <input type="hidden" name="name" value="${escapeHtml(fields.name)}" />
      <input type="hidden" name="email" value="${escapeHtml(fields.email)}" />
      <input type="hidden" name="date" value="${escapeHtml(fields.date)}" />
      <input type="hidden" name="time" value="${escapeHtml(fields.time)}" />
      <input type="hidden" name="sig" value="${sig}" />
      <label>Persönliche Nachricht (optional)<br/>
        <textarea name="customMessage" rows="4" style="width:100%;font-family:inherit;" placeholder="z.B. Antwort auf den Kommentar des Kunden..."></textarea>
      </label>
      <button type="submit" style="padding:10px 16px;background:${buttonColor};color:#fff;border:none;border-radius:6px;cursor:pointer;">
        ${buttonLabel}
      </button>
    </form>`
  );
}

async function sendCustomerConfirmation({ name, email, date, time, isAlternative, customMessage }) {
  const cancelParams = { action: 'cancel', name, email, date, time };
  const cancelSig = sign(cancelParams);
  const cancelLink = `${SITE_URL}/.netlify/functions/booking-cancel?${new URLSearchParams({ ...cancelParams, sig: cancelSig })}`;

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;color:#222;">
      <h2 style="color:#2e7d32;">Dein Termin ist bestätigt</h2>
      <p>Hallo ${escapeHtml(name)},</p>
      <p>${isAlternative ? 'wir haben uns auf folgenden Termin geeinigt:' : 'dein Termin bei Anong Thai-Massage ist bestätigt:'}</p>
      <p style="font-size:18px;font-weight:bold;margin:8px 0 20px;">${escapeHtml(date)}, ${escapeHtml(time)} Uhr</p>
      ${customMessage ? `<div style="background:#f5f0e8;border-radius:8px;padding:14px 16px;margin-bottom:20px;">
        <p style="margin:0;white-space:pre-wrap;">${escapeHtml(customMessage)}</p>
      </div>` : ''}
      <p>Solltest du doch verhindert sein:</p>
      <a href="${cancelLink}" style="display:inline-block;padding:12px 20px;background:#c62828;color:#fff;text-decoration:none;border-radius:6px;">
        Termin stornieren
      </a>
      <p style="margin-top:24px;">Wir freuen uns auf dich!<br/>Anong Thai-Massage</p>
    </div>`;

  await sendMail(email, 'Dein Termin bei Anong Thai-Massage ist bestätigt', html);
}

async function sendCustomerDecline({ name, email, date, customMessage }) {
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;color:#222;">
      <h2 style="color:#c62828;">Dein Wunschtermin ist leider nicht verfügbar</h2>
      <p>Hallo ${escapeHtml(name)},</p>
      <p>leider ist dein angefragter Termin am ${escapeHtml(date)} bei uns nicht möglich.
      Bitte wähle gerne einen anderen Termin über unsere Website oder melde dich direkt bei uns.</p>
      ${customMessage ? `<div style="background:#f5f0e8;border-radius:8px;padding:14px 16px;margin:16px 0;">
        <p style="margin:0;white-space:pre-wrap;">${escapeHtml(customMessage)}</p>
      </div>` : ''}
      <a href="${SITE_URL}" style="display:inline-block;margin-top:8px;padding:12px 20px;background:#8a5a2b;color:#fff;text-decoration:none;border-radius:6px;">
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
