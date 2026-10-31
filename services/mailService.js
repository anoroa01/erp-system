const nodemailer = require("nodemailer");

const smtpPort = Number(process.env.SMTP_PORT || 587);
const apiBase = process.env.API_BASE || "/api/v1";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_NAME,
    pass: process.env.SMTP_PASS,
  },
});

const resolveAppUrl = () =>
  (
    process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 8000}`
  ).replace(/\/$/, "");

const deliverEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"ERP System" <${process.env.SMTP_NAME}>`,
    to,
    subject,
    html,
  });
};

const sendConfirmationEmail = async (email, username, plainToken) => {
  const confirmUrl = `${resolveAppUrl()}${apiBase}/account/confirm-email/${plainToken}`;

  await deliverEmail({
    to: email,
    subject: "Confirm your email",
    html: `
      <table role="presentation" width="100%" cellpadding="0"
             cellspacing="0" border="0"
             style="background-color:#f4f6f8; padding:30px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0"
                   cellspacing="0" border="0"
                   style="width:100%; max-width:600px;
                          background-color:#ffffff;
                          border-radius:8px; overflow:hidden;">

              <tr>
                <td align="center"
                    style="background-color:#2563eb; padding:30px 20px;">
                  <h1 style="margin:0; color:#ffffff;
                             font-size:26px; font-weight:bold;">
                    ERP System
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding:40px 30px 20px; color:#333333;">
                  <h2 style="margin:0 0 20px; font-size:24px; color:#111827;">
                    Confirm Your Email Address
                  </h2>

                  <p style="margin:0 0 16px; font-size:16px; line-height:26px;">
                    Hello ${username},
                  </p>

                  <p style="margin:0 0 24px; font-size:16px; line-height:26px;
                            color:#4b5563;">
                    Thank you for creating an account. Please confirm your
                    email address by clicking the button below.
                  </p>

                  <table role="presentation" cellpadding="0"
                         cellspacing="0" border="0" align="center"
                         style="margin:0 auto 25px;">
                    <tr>
                      <td align="center" bgcolor="#2563eb"
                          style="border-radius:6px;">
                        <a href="${confirmUrl}" target="_blank"
                           style="display:inline-block; padding:14px 30px;
                                  color:#ffffff; font-size:16px;
                                  font-weight:bold; text-decoration:none;
                                  border-radius:6px;">
                          Confirm Email
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 16px; font-size:14px; line-height:23px;
                            color:#6b7280;">
                    This confirmation link will expire in 24 hours.
                  </p>

                  <p style="margin:0 0 16px; font-size:14px; line-height:23px;
                            color:#6b7280;">
                    If the button doesn't work, copy and paste the following
                    link into your browser:
                  </p>

                  <p style="margin:0 0 25px; font-size:14px; line-height:23px;
                            word-break:break-all;">
                    <a href="${confirmUrl}" style="color:#2563eb;">
                      ${confirmUrl}
                    </a>
                  </p>

                  <p style="margin:0 0 10px; font-size:15px; line-height:24px;
                            color:#4b5563;">
                    If you didn't create an account, you can safely ignore
                    this email.
                  </p>

                  <p style="margin:25px 0 0; font-size:15px; line-height:24px;
                            color:#333333;">
                    Best regards,<br>
                    <strong>The ERP Team</strong>
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center"
                    style="padding:20px 30px; background-color:#f9fafb;
                           border-top:1px solid #e5e7eb;">
                  <p style="margin:0 0 8px; font-size:12px; line-height:20px;
                            color:#9ca3af;">
                    &copy; 2026 ERP System. All rights reserved.
                  </p>
                  <p style="margin:0; font-size:12px; line-height:20px;
                            color:#9ca3af;">
                    This is an automated email. Please do not reply.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    `,
  });
};

const sendResetEmail = async (email, plainToken) => {
  const frontendResetUrl = `${resolveAppUrl()}/reset-password?token=${plainToken}`;
  const apiResetUrl = `${resolveAppUrl()}${apiBase}/account/password-reset/${plainToken}`;

  await deliverEmail({
    to: email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset (valid for 1 hour).</p>
      <p><a href="${frontendResetUrl}">Reset password in the app</a></p>
      <p>API: POST <code>${apiResetUrl}</code> with body
         <code>{ "password": "yourNewPassword" }</code></p>
      <p>If you did not request this, ignore this email.</p>
    `,
  });
};

module.exports = {
  sendConfirmationEmail,
  sendResetEmail,
};
