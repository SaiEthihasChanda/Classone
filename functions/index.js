const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { defineSecret }      = require('firebase-functions/params')
const { initializeApp }     = require('firebase-admin/app')
const { getFirestore }      = require('firebase-admin/firestore')
const nodemailer            = require('nodemailer')

initializeApp()

// Gmail App Password — set once via:
//   firebase functions:secrets:set GMAIL_APP_PASSWORD
// then enter the 16-character app password from
// myaccount.google.com/apppasswords
const GMAIL_APP_PASSWORD = defineSecret('GMAIL_APP_PASSWORD')

// The Gmail account that sends the notification email.
// Must match the account used when generating the App Password.
const GMAIL_USER = 'saiethihaschanda@gmail.com'

/**
 * Fires whenever a visitor submits the enquiry form.
 * Reads the new Firestore document and sends a formatted email
 * directly via Gmail SMTP — no third-party email service involved.
 */
exports.onEnquiryCreated = onDocumentCreated(
  { document: 'enquiries/{docId}', secrets: [GMAIL_APP_PASSWORD] },
  async (event) => {
    const data = event.data.data()
    if (!data) return

    // Read the notification address from the authoritative settings doc
    // (admin-only write) rather than from the submitted document (public write),
    // which would allow anyone to use this function as an email relay.
    const settingsSnap  = await getFirestore().doc('settings/site').get()
    const toEmail       = settingsSnap.data()?.enquiryEmail || GMAIL_USER
    // Customer's email from the form — used as Reply-To so hitting Reply in
    // Gmail goes straight to the customer, not back to the ClassOne inbox.
    const customerEmail = data['Email ID'] || data['Email'] || data['email'] || ''
    const customerName  = data['Name of the Customer'] || data['Name'] || data['name'] || 'Website Visitor'

    // ── Build a clean HTML email ─────────────────────────────────
    const skipKeys = new Set(['enquiryEmail', 'submittedAt', 'selections'])
    const fieldRows = Object.entries(data)
      .filter(([k]) => !skipKeys.has(k))
      .map(([k, v]) => `
        <tr>
          <td style="padding:8px 12px;font-weight:600;color:#16265c;white-space:nowrap;border-bottom:1px solid #e5eaf5;">${escape(k)}</td>
          <td style="padding:8px 12px;color:#374151;border-bottom:1px solid #e5eaf5;">${escape(String(v || ''))}</td>
        </tr>`)
      .join('')

    const selectionsHtml = Array.isArray(data.selections) && data.selections.length
      ? `<tr>
          <td style="padding:8px 12px;font-weight:600;color:#16265c;white-space:nowrap;border-bottom:1px solid #e5eaf5;">Selections</td>
          <td style="padding:8px 12px;color:#374151;border-bottom:1px solid #e5eaf5;">${data.selections.map(escape).join(', ')}</td>
         </tr>`
      : ''

    const submittedAt = data.submittedAt?.toDate
      ? data.submittedAt.toDate().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(22,38,92,.10);">

        <!-- Header -->
        <tr>
          <td style="background:#16265c;padding:28px 32px;">
            <p style="margin:0;color:#dce4f2;font-size:12px;letter-spacing:2px;text-transform:uppercase;">ClassOne Systems</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">New Enquiry Received</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
              A visitor submitted the enquiry form on
              <a href="https://classone-systems.web.app" style="color:#16265c;">classone-systems.web.app</a>.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0"
              style="border-collapse:collapse;border:1px solid #e5eaf5;border-radius:8px;overflow:hidden;font-size:14px;">
              ${fieldRows}
              ${selectionsHtml}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f9ff;padding:16px 32px;border-top:1px solid #e5eaf5;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">
              Submitted ${submittedAt} (IST) &nbsp;·&nbsp; ClassOne Systems
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    // ── Send via Gmail SMTP ──────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD.value(),
      },
    })

    await transporter.sendMail({
      // Gmail SMTP requires the authenticated account as the technical sender.
      // The display name shows the customer's email so it's visible at a glance.
      from:    `"${customerEmail || 'ClassOne Enquiry'}" <${GMAIL_USER}>`,
      to:      toEmail,
      // Reply-To means clicking Reply in Gmail goes directly to the customer.
      ...(customerEmail ? { replyTo: `"${customerName}" <${customerEmail}>` } : {}),
      subject: `New Enquiry — ${customerName}${customerEmail ? ` <${customerEmail}>` : ''}`,
      html,
    })
  },
)

function escape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
