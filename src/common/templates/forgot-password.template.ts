// email-templates/buildForgotPasswordEmail.ts
export function buildForgotPasswordEmail(opts: {
  otpCode: string;
  appName?: string;
  supportEmail?: string;
  expiresInMinutes?: number;
}) {
  const {
    otpCode,
    appName = 'GGS',
    supportEmail = 'support@ggs.app',
    expiresInMinutes = 10,
  } = opts;

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${appName} — Password Reset OTP</title>
        <style>
          .preheader { display:none; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all; }
          @media (prefers-color-scheme: dark) {
            .bg { background-color:#0b0b0b !important; }
            .card { background-color:#121212 !important; border-color:#1f1f1f !important; }
            .text { color:#eaeaea !important; }
            .muted { color:#b5b5b5 !important; }
            .btn { background:#4a90e2 !important; color:#ffffff !important; }
            .code { background:#1b1b1b !important; color:#ffffff !important; border-color:#2a2a2a !important; }
          }
        </style>
      </head>
      <body style="margin:0; padding:0;" class="bg">
        <div class="preheader">
          Your ${appName} password reset OTP is ${otpCode}. It expires in ${expiresInMinutes} minutes.
        </div>
  
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f7fb; padding:24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; margin:0 auto;">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 0 24px 16px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="left" style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,'Apple Color Emoji','Segoe UI Emoji'; font-size:14px; color:#94a3b8; padding:8px 0;">
                          <strong style="color:#111827; font-size:18px;">${appName}</strong>
                        </td>
                        <td align="right" style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,'Apple Color Emoji','Segoe UI Emoji'; font-size:12px; color:#94a3b8; padding:8px 0;">
                          Password Reset OTP
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
                <!-- Card -->
                <tr>
                  <td style="padding: 0 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card" style="background:#ffffff; border:1px solid #e5e7eb; border-radius:12px;">
                      <tr>
                        <td style="padding: 32px;">
                          <h1 class="text" style="margin:0 0 8px 0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial; font-weight:700; font-size:20px; color:#111827;">
                            Your Password Reset OTP
                          </h1>
                          <p class="text" style="margin:0 0 16px 0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial; font-size:14px; line-height:1.6; color:#374151;">
                            Use the following OTP to reset your password. Enter this code in the app to proceed with setting a new password.
                          </p>
  
                          <!-- OTP box -->
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 16px 0 8px 0;">
                            <tr>
                              <td class="code" style="font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace; font-size:28px; letter-spacing:4px; padding:14px 20px; border:1px dashed #e5e7eb; border-radius:10px; background:#f9fafb; color:#111827;">
                                ${otpCode}
                              </td>
                            </tr>
                          </table>
  
                          <p class="muted" style="margin:4px 0 20px 0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial; font-size:12px; color:#6b7280;">
                            This code will expire in ${expiresInMinutes} minutes.
                          </p>
  
                          <p class="text" style="margin:0 0 12px 0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial; font-size:14px; line-height:1.6; color:#374151;">
                            If you did not request a password reset, please ignore this email or contact our support team immediately.
                          </p>
  
                          <p class="muted" style="margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial; font-size:12px; color:#6b7280;">
                            Best regards,<br/>
                            The ${appName} Team
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 16px 24px 0 24px;">
                    <p class="muted" style="margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial; font-size:12px; color:#94a3b8; line-height:1.6;">
                      Need help? Contact us at
                      <a href="mailto:${supportEmail}" style="color:#2563eb; text-decoration:none;">${supportEmail}</a>
                    </p>
                    <p class="muted" style="margin:6px 0 0 0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial; font-size:11px; color:#94a3b8;">
                      © ${new Date().getFullYear()} ${appName}. All rights reserved.
                    </p>
                  </td>
                </tr>
  
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
