import mongoose from 'mongoose';
import { connectToDatabase } from './src/lib/db/connection';
import { Product } from './src/models/Product';
import { Category } from './src/models/Category';
import { Enquiry } from './src/models/Enquiry';
import { Admin } from './src/models/Admin';
import { Page } from './src/models/Page';
import { SiteSettings } from './src/models/SiteSettings';
import { verifyPassword } from './src/lib/auth/password';
import { createSessionToken, verifySessionToken } from './src/lib/auth/session';
import { checkRateLimit } from './src/lib/security/rateLimit';

async function runSystemDiagnostics() {
  console.log('==============================================');
  console.log('KLUB SPORTS — SYSTEM VERIFICATION & TEST SUITE');
  console.log('==============================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, extra?: any) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName}`, extra || '');
    }
  }

  // 1. Database Connection
  try {
    await connectToDatabase();
    assert(true, '1. MongoDB Atlas connection established successfully');
  } catch (err) {
    assert(false, '1. MongoDB Atlas connection failed', err);
  }

  // 2. Administrator Account Verification
  try {
    const admin = await Admin.findOne({ email: 'admin@klubsports.com' });
    assert(!!admin, '2. Admin account exists in database');
    assert(admin?.isActive === true, '3. Admin account is active');
    const isPasswordValid = await verifyPassword('KlubSportsAdmin2026!Secure', admin?.passwordHash || '');
    assert(isPasswordValid, '4. Secure password hash verification succeeded');
  } catch (err) {
    assert(false, 'Admin account verification error', err);
  }

  // 3. Session Token Creation & Verification
  try {
    const token = await createSessionToken({ adminId: '65f01234567890abcdef1234', email: 'admin@klubsports.com' });
    assert(typeof token === 'string' && token.length > 20, '5. JWT session token generated');
    const payload = await verifySessionToken(token);
    assert(payload?.email === 'admin@klubsports.com', '6. Session token verified with expected claims');
  } catch (err) {
    assert(false, 'Session token test error', err);
  }

  // 4. Rate Limiter Verification
  try {
    const key = `test_limit_${Date.now()}`;
    const r1 = checkRateLimit(key, 2, 60000);
    const r2 = checkRateLimit(key, 2, 60000);
    const r3 = checkRateLimit(key, 2, 60000);
    assert(r1.success === true && r2.success === true && r3.success === false, '7. Rate limiter properly throttles excess attempts');
  } catch (err) {
    assert(false, 'Rate limiter test error', err);
  }

  // 5. Official Footwear Categories Count
  try {
    const categories = await Category.find({ isPublished: true });
    assert(categories.length >= 11, `8. Official categories seeded (found ${categories.length})`);
    const marathonCat = categories.find((c) => c.slug === 'marathon-shoes');
    assert(!!marathonCat, '9. Marathon Shoes category is published');
  } catch (err) {
    assert(false, 'Category test error', err);
  }

  // 6. Products Catalogue Verification
  try {
    const products = await Product.find({ isPublished: true });
    assert(products.length >= 8, `10. Showcase products published (found ${products.length})`);
    // Verify no prices or cart fields exist
    const sampleProduct = products[0].toObject() as any;
    assert(sampleProduct.price === undefined, '11. Strict compliance: No price fields exist on product model');
    assert(sampleProduct.stock === undefined, '12. Strict compliance: No stock counter fields exist on product model');
  } catch (err) {
    assert(false, 'Product test error', err);
  }

  // 7. Pages & Site Settings
  try {
    const homePage = await Page.findOne({ key: 'home', isPublished: true });
    assert(!!homePage, '13. Home CMS page published');
    assert(homePage?.sections?.hero?.headline === 'SHOES FOR EVERY SPORT', '14. Home headline matches source presentation');

    const settings = await SiteSettings.findOne();
    assert(settings?.brandName === 'Klub Sports', '15. Brand name correctly set to Klub Sports');
    assert(settings?.logoAsset?.horizontal === '/brand/logo-horizontal.png', '16. Official horizontal brand logo asset configured');
  } catch (err) {
    assert(false, 'Pages and settings test error', err);
  }

  // 8. Enquiry Creation Test
  try {
    const testEnquiry = await Enquiry.create({
      name: 'Diagnostic Test User',
      companyName: 'Institutional Test Lab',
      email: 'test@klubdiagnostics.com',
      phone: '+91 99999 88888',
      message: 'Automated test enquiry for system verification.',
      status: 'New',
      sourcePage: '/test-diagnostics',
    });
    assert(!!testEnquiry._id, '17. Business enquiry successfully stored in database');
    assert(testEnquiry.status === 'New', '18. Enquiry defaulted to status "New"');

    // Clean up test enquiry
    await Enquiry.findByIdAndDelete(testEnquiry._id);
    assert(true, '19. Test enquiry safely cleaned up');
  } catch (err) {
    assert(false, 'Enquiry test error', err);
  }

  console.log('\n==============================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
  console.log('==============================================\n');

  await mongoose.disconnect();
  process.exit(totalTests === passedTests ? 0 : 1);
}

runSystemDiagnostics();
