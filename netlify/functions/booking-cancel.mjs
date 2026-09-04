// netlify/functions/booking-cancel.mjs
//
// Wird aufgerufen, wenn der KUNDE in seiner Bestätigungsmail auf
// "Termin stornieren" klickt. Verschickt eine Stornierungs-Mail ans
// Massagestudio und zeigt dem Kunden eine kurze Bestätigungsseite.
//
// E-Mail-Versand läuft über das bestehende web.de-Postfach (SMTP via
// nodemailer), nicht mehr über Resend.

import crypto from 'node:crypto';
import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL;
const LINK_SECRET = process.env.LINK_SECRET;

const transporter = nodemailer.createTransport({
  host: 'smtp.web.de',
  port: 587,
  secure: false, // STARTTLS
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

export async function handler(event) {
  const { name = '', email, date, time, sig } = event.queryStringParameters || {};

  if (!email || !date || !time || !sig) {
    return page('Fehlerhafter Link', '<p>Dieser Stornierungslink ist unvollständig oder ungültig.</p>');
  }

  const signedFields = { action: 'cancel', name, email, date, time };
  if (!verify(signedFields, sig)) {
    return page('Ungültiger Link', '<p>Die Signatur dieses Links ist ungültig oder wurde manipuliert.</p>');
  }

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;color:#222;">
      <h2 style="color:#c62828;">Termin storniert</h2>
      <p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) hat folgenden Termin storniert:</p>
      <p style="font-size:18px;font-weight:bold;">${escapeHtml(date)}, ${escapeHtml(time)} Uhr</p>
    </div>`;

  try {
    await sendMail(BUSINESS_EMAIL, `Terminstornierung: ${name || email}`, html);
  } catch (err) {
    console.error(err);
    return page('Fehler', '<p>Die Stornierung konnte nicht verschickt werden. Bitte kontaktiere uns direkt.</p>');
  }

  return page('Dein Termin wurde storniert', `<p>Wir haben deine Stornierung für den Termin am ${escapeHtml(date)}, ${escapeHtml(time)} Uhr erhalten und das Studio informiert.</p>`);
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
