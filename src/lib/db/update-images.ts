import mongoose from 'mongoose';
import { Page } from '../../models/Page';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://klubinternational_db_user:sNr5fKt7g5sYWJr3@cluster0.unco14l.mongodb.net/klub_sports?retryWrites=true&w=majority';

// Curated high-aesthetic unbranded sports footwear images
const HERO_IMAGE = 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1600&q=85';
const RUNNING_SHOE_IMAGE = 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80';
const MARATHON_SHOE_IMAGE = 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80';

async function updateAssets() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.');

  // 1. Update Homepage hero banner
  console.log('Updating Homepage hero banner image...');
  await Page.findOneAndUpdate(
    { key: 'home' },
    {
      $set: {
        'sections.hero.bannerImage': HERO_IMAGE,
        'sections.hero.videoUrl': '/videos/hero-athlete.webm',
        'sections.hero.subheadline':
          'Sports footwear engineered around tournament-grade performance, anatomical comfort and large-scale institutional supply.',
      },
    }
  );

  // 2. Update Running Shoes category cover image (replacing the red Nike image)
  console.log('Updating Running Shoes category image...');
  await Category.findOneAndUpdate(
    { slug: 'running-shoes' },
    {
      $set: {
        coverImage: RUNNING_SHOE_IMAGE,
        imageAlt: 'Klub Sports Performance Running Footwear',
      },
    }
  );

  // 3. Update any product that had the old Nike image
  console.log('Updating products that referenced Nike shoe image...');
  await Product.updateMany(
    { 'images.url': { $regex: 'photo-1542291026-7eec264c27ff' } },
    {
      $set: {
        'images.$.url': RUNNING_SHOE_IMAGE,
      },
    }
  );

  console.log('Image update completed successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

updateAssets().catch((err) => {
  console.error('Update failed:', err);
  process.exit(1);
});
