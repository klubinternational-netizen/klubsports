import { sendEnquiryEmailNotification } from './src/lib/email/resend';

async function test() {
  console.log('Sending test email via Resend...');
  const result = await sendEnquiryEmailNotification({
    name: 'Institutional Client Test',
    companyName: 'Sports Authority Testing',
    email: 'client@ksports.co.in',
    phone: '+91 98765 43210',
    categoryName: 'Marathon Shoes',
    message: 'Testing live automated email notification dispatch through Resend.',
    sourcePage: '/contact',
  });
  console.log('Result:', result);
}

test();
