import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

const resendApiKey = process.env.RESEND_API_KEY;

export async function sendNewReportNotification(
  to: string,
  trackingId: string,
  org: string,
  city?: string
) {
  const subject = `New report submitted - ${org}${
    city ? " (" + city + ")" : ""
  }`;
  const html = `<p>A new report has been submitted.</p><p>Tracking ID: <strong>${trackingId}</strong></p>`;
  if (!resendApiKey) {
    console.log("Resend API key not set - skipping email to", to);
    return;
  }
  try {
    await resend.emails.send({
      from: "no-reply@egov.example",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending verification email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}

export async function sendTrackingEmail(to: string, trackingId: string) {
  const subject = `Your report tracking ID`;
  const html = `<p>Your report has been received. Tracking ID: <strong>${trackingId}</strong></p>`;
  if (!resendApiKey) {
    console.log("Resend API key not set - skipping email to", to);
    return;
  }
  try {
    await resend.emails.send({
      from: "no-reply@egov.example",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending tracking email", error);
  }
}

export async function sendOtpEmail(
  to: string,
  token: string,

) {
  const subject = `Your verification code`;
  const html = `<p>Your verification code is <strong>${token}</strong>. It expires in 10 minutes.</p>`;

  try {
    await resend.emails.send({
      from: "Satark  <verification@resend.dev>",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending OTP email", error);
  }
}

// sendVerificationEmail renders the React email component and sends via Resend
export async function sendVerificationEmail(email: string, verifyCode: string) {
  const subject = `Verification Code`;
  const html = `
    <html>
      <body>
        <h2>Hello,</h2>
        <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
        <p style="font-size:20px;font-weight:bold">${escapeHtml(verifyCode)}</p>
        <p>If you did not request this code please ignore.</p>
      </body>
    </html>`;
  if (!resendApiKey) {
    console.log(
      "Resend API key not set - skipping verification email to",
      email
    );
    return { success: false, message: "no_resend_key" };
  }
  try {
    await resend.emails.send({
      from: "singhelboyankit@gmail.com",
      to: email,
      subject,
      html,
    });
    return { success: true, message: "Email Sent successfully" };
  } catch (e) {
    console.error("sendVerificationEmail error", e);
    return { success: false, message: "send_failed" };
  }
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
