import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const LOGO_URL = 'https://ik.imagekit.io/x5thiitxj/branding/klub-sports-official-logo.png';
const SENDER_NAME = 'KSports';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'KSports <enquiries@ksports.co.in>';
const DESK_EMAIL = 'info@ksports.co.in';
const DESK_PHONE = '+91 88863 03030';

export interface EnquiryNotificationParams {
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  categoryName?: string;
  message: string;
  sourcePage?: string;
  referenceId?: string;
}

export interface StatusUpdateEmailParams {
  name: string;
  email: string;
  referenceId?: string;
  categoryName?: string;
  oldStatus?: string;
  newStatus: string;
  internalNotes?: string;
}

/**
 * 1. Dispatches an automated High-Level Confirmation Email to the CUSTOMER
 * upon initial form submission.
 */
export async function sendCustomerEnquiryConfirmation(params: EnquiryNotificationParams): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  if (!resend || !process.env.RESEND_API_KEY) {
    return { success: false, error: 'Resend API key is not configured.' };
  }

  const refCode = params.referenceId || `KS-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [params.email],
      replyTo: DESK_EMAIL,
      subject: `Requirement Acknowledged — KSports Commercial Desk [Ref: ${refCode}]`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Requirement Acknowledged — KSports</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f7f6f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f6f3; padding: 32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
                  
                  <!-- Top Luxury Accent Bar -->
                  <tr>
                    <td style="height: 6px; background: linear-gradient(90deg, #ee7700 0%, #ff9933 100%);"></td>
                  </tr>

                  <!-- Header with Official Logo -->
                  <tr>
                    <td style="padding: 32px 36px 24px 36px; border-bottom: 1px solid #f2f0ec; text-align: left;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <img src="${LOGO_URL}" alt="KSports" width="170" style="display: block; max-width: 170px; height: auto;" />
                          </td>
                          <td align="right">
                            <span style="display: inline-block; padding: 4px 10px; background-color: #fff7ed; color: #ea580c; border: 1px solid #fed7aa; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">
                              Commercial Desk
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 32px 36px;">
                      <h1 style="margin: 0 0 12px 0; color: #1c1917; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">
                        Requirement Acknowledged
                      </h1>
                      <p style="margin: 0 0 24px 0; color: #57534e; font-size: 14px; line-height: 1.6;">
                        Dear <strong>${params.name}</strong>, thank you for reaching out to the KSports commercial and institutional partnerships desk. We have safely logged your footwear procurement requirement.
                      </p>

                      <!-- Reference ID Pill Card -->
                      <div style="background-color: #faf9f6; border: 1px solid #e7e5e4; border-radius: 12px; padding: 14px 18px; margin-bottom: 28px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td>
                              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #a8a29e; letter-spacing: 0.8px; display: block;">Tracking Reference</span>
                              <span style="font-size: 15px; font-weight: 800; color: #1c1917; letter-spacing: 0.5px;">${refCode}</span>
                            </td>
                            <td align="right">
                              <span style="font-size: 11px; font-weight: 600; color: #059669; background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 4px 8px; border-radius: 6px;">
                                Logged in System
                              </span>
                            </td>
                          </tr>
                        </table>
                      </div>

                      <!-- Requirement Details Breakdown -->
                      <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #78716c;">
                        Submitted Requirement Specification
                      </h3>

                      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
                        <tr style="border-bottom: 1px solid #f5f5f4;">
                          <td style="padding: 10px 0; color: #78716c; width: 36%; font-weight: 600;">Organization / Academy</td>
                          <td style="padding: 10px 0; color: #1c1917; font-weight: 600;">${params.companyName || 'Institutional Submitter'}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f5f5f4;">
                          <td style="padding: 10px 0; color: #78716c; font-weight: 600;">Footwear Discipline</td>
                          <td style="padding: 10px 0; color: #1c1917; font-weight: 600;">${params.categoryName || 'General Corporate Requirement'}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f5f5f4;">
                          <td style="padding: 10px 0; color: #78716c; font-weight: 600;">Contact Telephone</td>
                          <td style="padding: 10px 0; color: #1c1917;">${params.phone}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #78716c; font-weight: 600;">Registered Email</td>
                          <td style="padding: 10px 0; color: #ea580c; font-weight: 600;">${params.email}</td>
                        </tr>
                      </table>

                      <!-- Message Quote Box -->
                      <div style="background-color: #fafaf9; border-left: 3px solid #ee7700; border-radius: 4px 8px 8px 4px; padding: 14px 18px; margin-bottom: 28px;">
                        <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #78716c; letter-spacing: 0.5px;">Requirement Notes</p>
                        <p style="margin: 0; font-size: 13px; color: #292524; line-height: 1.6; white-space: pre-wrap;">${params.message}</p>
                      </div>

                      <!-- What Happens Next SLA Card -->
                      <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 1px solid #fed7aa; border-radius: 14px; padding: 18px 20px; margin-bottom: 28px;">
                        <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #9a3412;">
                          Expected Response &amp; Next Steps
                        </h4>
                        <p style="margin: 0; font-size: 12px; color: #7c2d12; line-height: 1.6;">
                          Our commercial accounts director reviews specifications against active production schedules within <strong>24 to 48 business hours</strong>. You will receive official tier pricing, minimum batch thresholds, or sample prototype logistics directly via this email thread.
                        </p>
                      </div>

                      <!-- Direct Support Channels -->
                      <p style="margin: 0; font-size: 13px; color: #57534e; line-height: 1.6;">
                        Need urgent batch confirmation? You can reach our direct telephone desk at <a href="tel:${DESK_PHONE}" style="color: #ea580c; font-weight: 700; text-decoration: none;">${DESK_PHONE}</a> or email <a href="mailto:${DESK_EMAIL}" style="color: #ea580c; font-weight: 700; text-decoration: none;">${DESK_EMAIL}</a>.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 36px; background-color: #fafaf9; border-top: 1px solid #f2f0ec; text-align: center;">
                      <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 600; color: #78716c;">
                        KSports Manufacturing Facilities · Performance Footwear Hub, India
                      </p>
                      <p style="margin: 0; font-size: 11px; color: #a8a29e;">
                        © ${new Date().getFullYear()} KSports International. All commercial submissions remain strictly confidential.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Customer confirmation delivery error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('Customer confirmation exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 2. Dispatches an automated Status Update Email to the CUSTOMER
 * whenever an admin changes status (e.g. In Progress, Closed) or adds notes.
 */
export async function sendCustomerStatusUpdateEmail(params: StatusUpdateEmailParams): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  if (!resend || !process.env.RESEND_API_KEY) {
    return { success: false, error: 'Resend API key is not configured.' };
  }

  const refCode = params.referenceId || 'KS-ENQUIRY';

  // Dynamic status styling
  let statusBg = '#eff6ff';
  let statusBorder = '#bfdbfe';
  let statusText = '#1d4ed8';
  let statusLabel = params.newStatus;

  if (params.newStatus === 'In Progress') {
    statusBg = '#fff7ed';
    statusBorder = '#fed7aa';
    statusText = '#c2410c';
    statusLabel = 'Under Commercial Review / In Progress';
  } else if (params.newStatus === 'Closed') {
    statusBg = '#ecfdf5';
    statusBorder = '#a7f3d0';
    statusText = '#047857';
    statusLabel = 'Requirement Resolved / Closed';
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [params.email],
      replyTo: DESK_EMAIL,
      subject: `Status Update: [${params.newStatus}] on Footwear Requirement (${refCode}) — KSports`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Status Update — KSports</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f7f6f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f6f3; padding: 32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
                  
                  <!-- Top Accent Bar -->
                  <tr>
                    <td style="height: 6px; background: linear-gradient(90deg, #ee7700 0%, #1c1917 100%);"></td>
                  </tr>

                  <!-- Header with Official Logo -->
                  <tr>
                    <td style="padding: 32px 36px 24px 36px; border-bottom: 1px solid #f2f0ec;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <img src="${LOGO_URL}" alt="KSports" width="170" style="display: block; max-width: 170px; height: auto;" />
                          </td>
                          <td align="right">
                            <span style="display: inline-block; padding: 4px 10px; background-color: ${statusBg}; color: ${statusText}; border: 1px solid ${statusBorder}; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">
                              ${params.newStatus}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 32px 36px;">
                      <h1 style="margin: 0 0 12px 0; color: #1c1917; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">
                        Status Update on Your Requirement
                      </h1>
                      <p style="margin: 0 0 24px 0; color: #57534e; font-size: 14px; line-height: 1.6;">
                        Dear <strong>${params.name}</strong>, our commercial desk has updated the active processing status of your footwear procurement enquiry (Ref: <strong>${refCode}</strong>).
                      </p>

                      <!-- Updated Status Highlight Card -->
                      <div style="background-color: ${statusBg}; border: 1px solid ${statusBorder}; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${statusText}; letter-spacing: 0.8px; display: block; margin-bottom: 4px;">Current Requirement Status</span>
                        <span style="font-size: 18px; font-weight: 800; color: ${statusText}; display: block;">${statusLabel}</span>
                      </div>

                      ${
                        params.internalNotes
                          ? `
                        <!-- Official Desk Remarks -->
                        <div style="background-color: #fafaf9; border-left: 3px solid #ee7700; border-radius: 4px 8px 8px 4px; padding: 16px 20px; margin-bottom: 24px;">
                          <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #78716c; letter-spacing: 0.5px;">Message from Commercial Accounts Team</p>
                          <p style="margin: 0; font-size: 13px; color: #1c1917; line-height: 1.6; white-space: pre-wrap;">${params.internalNotes}</p>
                        </div>
                      `
                          : ''
                      }

                      <!-- Requirement Summary Info -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
                        <tr style="border-bottom: 1px solid #f5f5f4;">
                          <td style="padding: 10px 0; color: #78716c; width: 36%; font-weight: 600;">Reference Code</td>
                          <td style="padding: 10px 0; color: #1c1917; font-weight: 700;">${refCode}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f5f5f4;">
                          <td style="padding: 10px 0; color: #78716c; font-weight: 600;">Category Discipline</td>
                          <td style="padding: 10px 0; color: #1c1917; font-weight: 600;">${params.categoryName || 'General Corporate'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #78716c; font-weight: 600;">Contact Email</td>
                          <td style="padding: 10px 0; color: #ea580c; font-weight: 600;">${params.email}</td>
                        </tr>
                      </table>

                      <p style="margin: 0; font-size: 13px; color: #57534e; line-height: 1.6;">
                        If you have further questions or wish to amend your volume request, simply reply directly to this email or contact our direct telephone line at <a href="tel:${DESK_PHONE}" style="color: #ea580c; font-weight: 700; text-decoration: none;">${DESK_PHONE}</a>.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 36px; background-color: #fafaf9; border-top: 1px solid #f2f0ec; text-align: center;">
                      <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 600; color: #78716c;">
                        KSports Commercial Partnerships Desk
                      </p>
                      <p style="margin: 0; font-size: 11px; color: #a8a29e;">
                        © ${new Date().getFullYear()} KSports International. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Customer status update email delivery error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('Customer status update email exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 3. Dispatches an Internal Notification to the Corporate Admin Desk
 */
export async function sendEnquiryEmailNotification(params: EnquiryNotificationParams): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  if (!resend || !process.env.RESEND_API_KEY) {
    return { success: false, error: 'Resend API key is not configured.' };
  }

  const recipient = process.env.ENQUIRY_NOTIFICATION_EMAIL || 'info@ksports.co.in';

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [recipient],
      replyTo: params.email,
      subject: `New Corporate Footwear Enquiry: ${params.name} (${params.companyName || 'Institutional'})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #ee7700; padding-bottom: 16px; margin-bottom: 20px;">
            <img src="${LOGO_URL}" alt="KSports" width="160" style="display: block; max-width: 160px; height: auto; margin-bottom: 10px;" />
            <p style="color: #625e5d; margin: 0; font-size: 13px;">Corporate & Institutional Footwear Enquiry Desk</p>
          </div>

          <p style="color: #292524; font-size: 14px; margin-bottom: 16px;">A new business footwear requirement has been submitted through the corporate website:</p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
            <tr style="border-bottom: 1px solid #f5f5f4;">
              <td style="padding: 10px 0; color: #78716c; width: 35%; font-weight: 600; text-transform: uppercase; font-size: 11px;">Submitter Name</td>
              <td style="padding: 10px 0; color: #1c1917; font-weight: 600;">${params.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f5f5f4;">
              <td style="padding: 10px 0; color: #78716c; font-weight: 600; text-transform: uppercase; font-size: 11px;">Company / Academy</td>
              <td style="padding: 10px 0; color: #1c1917;">${params.companyName || 'Not specified'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f5f5f4;">
              <td style="padding: 10px 0; color: #78716c; font-weight: 600; text-transform: uppercase; font-size: 11px;">Official Email</td>
              <td style="padding: 10px 0; color: #ee7700; font-weight: 600;"><a href="mailto:${params.email}" style="color: #ee7700; text-decoration: none;">${params.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f5f5f4;">
              <td style="padding: 10px 0; color: #78716c; font-weight: 600; text-transform: uppercase; font-size: 11px;">Telephone Number</td>
              <td style="padding: 10px 0; color: #1c1917; font-weight: 600;"><a href="tel:${params.phone}" style="color: #1c1917; text-decoration: none;">${params.phone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f5f5f4;">
              <td style="padding: 10px 0; color: #78716c; font-weight: 600; text-transform: uppercase; font-size: 11px;">Interested Category</td>
              <td style="padding: 10px 0; color: #1c1917;">${params.categoryName || 'General Corporate Enquiry'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #78716c; font-weight: 600; text-transform: uppercase; font-size: 11px;">Source Page</td>
              <td style="padding: 10px 0; color: #78716c;">${params.sourcePage || '/contact'}</td>
            </tr>
          </table>

          <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="color: #78716c; font-size: 11px; font-weight: 700; text-transform: uppercase; margin: 0 0 8px 0;">Requirement Specification</p>
            <p style="color: #292524; font-size: 13px; margin: 0; line-height: 1.6; white-space: pre-wrap;">${params.message}</p>
          </div>

          <div style="border-top: 1px solid #e7e5e4; padding-top: 16px; font-size: 11px; color: #a8a29e; text-align: center;">
            This email was automatically dispatched by the KSports corporate notification engine.
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Admin enquiry notification delivery error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('Admin enquiry notification exception:', err);
    return { success: false, error: err.message || 'Unknown error during email dispatch' };
  }
}
