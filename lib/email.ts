import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await transporter.sendMail({
    from: `"Avira Sports" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset your Avira password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <h2 style="font-size:22px;font-weight:600;color:#1a1a1a;margin:0 0 8px">Reset your password</h2>
        <p style="font-size:14px;color:#555;margin:0 0 24px">
          Click the button below to set a new password. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 28px;background:#1a1a1a;color:#fff;font-size:14px;font-weight:600;border-radius:6px;text-decoration:none">
          Reset password
        </a>
        <p style="font-size:12px;color:#999;margin:24px 0 0">
          If you didn't request this, ignore this email — your password won't change.
        </p>
      </div>
    `,
  });
}
