import mongoose from 'mongoose';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://klubinternational_db_user:sNr5fKt7g5sYWJr3@cluster0.unco14l.mongodb.net/klub_sports?retryWrites=true&w=majority';

async function cleanCatalog() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected successfully.');

  const allowedCategorySlugs = [
    'jogging-shoes-men',
    'jogging-shoes-women',
    'walk-shoes-men',
    'walk-shoes-women',
    'badminton-shoes',
    'cricket-shoes',
    'socks',
    'bamboo-socks',
    'insoles',
  ];

  const allowedProductSlugs = [
    'ksports-stridepro-jogger-men',
    'ksports-swiftair-jogger-women',
    'ksports-pacewalk-comfort-men',
    'ksports-cloudwalk-daily-women',
    'ksports-courtmaster-badminton-pro',
    'ksports-strikemaster-cricket-shoes',
    'ksports-3-pairs-pouch-basic-range',
    'ksports-3-pairs-pouch-economy-range',
    'ksports-7-days-signature-pack',
    'bamboo-socks-3-pack',
    'ksports-ortho-align-arch-support-insoles',
    'ksports-shockshield-gel-sport-insoles',
  ];

  // 1. Delete all old products not in allowedProductSlugs (or duplicate legacy products like klub-courtmaster-badminton-pro)
  const delProdResult = await Product.deleteMany({
    slug: { $nin: allowedProductSlugs },
  });
  console.log('Deleted old products count:', delProdResult.deletedCount);

  // 2. Delete all old categories not in allowedCategorySlugs
  const delCatResult = await Category.deleteMany({
    slug: { $nin: allowedCategorySlugs },
  });
  console.log('Deleted old categories count:', delCatResult.deletedCount);

  // 3. Ensure all remaining categories and products are published and have valid sortOrders
  await Category.updateMany(
    { slug: { $in: allowedCategorySlugs } },
    { $set: { isPublished: true } }
  );

  await Product.updateMany(
    { slug: { $in: allowedProductSlugs } },
    { $set: { isPublished: true } }
  );

  const remainingCats = await Category.find().sort({ sortOrder: 1 }).lean();
  console.log('Remaining Categories in Database:');
  remainingCats.forEach((c) => console.log(` - ${c.name} (${c.slug})`));

  const remainingProds = await Product.find().populate('categoryId', 'name slug').sort({ sortOrder: 1 }).lean();
  console.log('Remaining Products in Database:');
  remainingProds.forEach((p: any) =>
    console.log(` - ${p.name} [Category: ${p.categoryId?.name}] (${p.slug})`)
  );

  console.log('Catalog clean complete!');
  await mongoose.disconnect();
}

cleanCatalog().catch((e) => {
  console.error('Clean failed:', e);
  process.exit(1);
});
