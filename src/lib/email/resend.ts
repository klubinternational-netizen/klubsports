import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface EnquiryNotificationParams {
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  categoryName?: string;
  message: string;
  sourcePage?: string;
}

export async function sendEnquiryEmailNotification(params: EnquiryNotificationParams): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  if (!resend || !process.env.RESEND_API_KEY) {
    return { success: false, error: 'Resend API key is not configured.' };
  }

  const recipient = process.env.ENQUIRY_NOTIFICATION_EMAIL || 'info@klubsports.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Klub Sports <enquiries@ksports.co.in>';

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [recipient],
      replyTo: params.email,
      subject: `New Corporate Footwear Enquiry: ${params.name} (${params.companyName || 'Institutional'})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #ee7700; padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #1c1917; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 0.5px;">Klub Sports</h2>
            <p style="color: #625e5d; margin: 4px 0 0 0; font-size: 13px;">Corporate & Institutional Footwear Enquiry Desk</p>
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
              <td style="padding: 10px 0; color: #78716c; font-family: monospace;">${params.sourcePage || '/contact'}</td>
            </tr>
          </table>

          <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="color: #78716c; font-size: 11px; font-weight: 700; text-transform: uppercase; margin: 0 0 8px 0;">Requirement Specification</p>
            <p style="color: #292524; font-size: 13px; margin: 0; line-height: 1.6; white-space: pre-wrap;">${params.message}</p>
          </div>

          <div style="border-top: 1px solid #e7e5e4; padding-top: 16px; font-size: 11px; color: #a8a29e; text-align: center;">
            This email was automatically dispatched by the Klub Sports corporate website notification engine.
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend delivery error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('Resend exception:', err);
    return { success: false, error: err.message || 'Unknown error during email dispatch' };
  }
}
