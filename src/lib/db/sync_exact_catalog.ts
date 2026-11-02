import mongoose from 'mongoose';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://klubinternational_db_user:sNr5fKt7g5sYWJr3@cluster0.unco14l.mongodb.net/klub_sports?retryWrites=true&w=majority';

async function updateDB() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected successfully.');

  // The EXACT categories specified by the user:
  // Shoes:
  // 1. Jogging shoes men
  // 2. Jogging shoes women
  // 3. Walk shoes men
  // 4. Walk shoes women
  // 5. Badminton shoes
  // 6. Cricket shoes
  // Other Divisions:
  // 7. Socks
  // 8. Insoles
  const allowedCategories = [
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

  // Unpublish all other categories from database
  const resCat = await Category.updateMany(
    { slug: { $nin: allowedCategories } },
    { $set: { isPublished: false } }
  );
  console.log('Unpublished old categories count:', resCat.modifiedCount);

  // Set sort orders for the 6 shoes categories: 1 to 6
  const shoeOrder = [
    'jogging-shoes-men',
    'jogging-shoes-women',
    'walk-shoes-men',
    'walk-shoes-women',
    'badminton-shoes',
    'cricket-shoes',
  ];
  for (let i = 0; i < shoeOrder.length; i++) {
    await Category.updateOne(
      { slug: shoeOrder[i] },
      { $set: { sortOrder: i + 1, isPublished: true } }
    );
  }

  // Ensure socks and insoles are published with sortOrder 7 & 8
  await Category.updateOne({ slug: 'socks' }, { $set: { sortOrder: 7, isPublished: true } });
  await Category.updateOne({ slug: 'insoles' }, { $set: { sortOrder: 8, isPublished: true } });
  // Also keep bamboo-socks published for backwards compatibility
  await Category.updateOne({ slug: 'bamboo-socks' }, { $set: { sortOrder: 9, isPublished: true } });

  // Check active categories
  const activeCats = await Category.find({ isPublished: true }).sort({ sortOrder: 1 }).lean();
  console.log('Active published categories now:');
  activeCats.forEach((c) =>
    console.log(` - ${c.name} (${c.slug}) sortOrder: ${c.sortOrder}`)
  );

  // Unpublish old products that belong to unpublished categories
  const activeCatIds = activeCats.map((c) => c._id);
  const resProd = await Product.updateMany(
    { categoryId: { $nin: activeCatIds } },
    { $set: { isPublished: false } }
  );
  console.log('Unpublished old products count:', resProd.modifiedCount);

  // Ensure new products are published
  const activeProds = await Product.find({ isPublished: true }).sort({ sortOrder: 1 }).lean();
  console.log('Active published products count:');
  activeProds.forEach((p) => console.log(` - ${p.name} (${p.slug})`));

  console.log('Sync complete!');
  await mongoose.disconnect();
}

updateDB().catch((err) => {
  console.error('Update failed:', err);
  process.exit(1);
});
