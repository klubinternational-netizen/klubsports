import mongoose from 'mongoose';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://klubinternational_db_user:sNr5fKt7g5sYWJr3@cluster0.unco14l.mongodb.net/klub_sports?retryWrites=true&w=majority';

export async function runCatalogUpdate() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected successfully.');

  // 1. Updated Category Definitions
  const categoriesToUpdate = [
    {
      name: 'Jogging Shoes (Men)',
      slug: 'jogging-shoes-men',
      description: 'Lightweight breathable jacquard mesh jogging shoes engineered for men with dual-density EVA impact cushioning and durable traction.',
      coverImage: '/categories/jogging-shoes-men.webp',
      imageAlt: 'KSports Men Jogging Shoes',
      sortOrder: 1,
    },
    {
      name: 'Jogging Shoes (Women)',
      slug: 'jogging-shoes-women',
      description: 'Plush athletic jogging shoes designed with responsive cushioning, lightweight breathable mesh, and ergonomic arch contours for women.',
      coverImage: '/categories/jogging-shoes-women.webp',
      imageAlt: 'KSports Women Jogging Shoes',
      sortOrder: 2,
    },
    {
      name: 'Walk Shoes (Men)',
      slug: 'walk-shoes-men',
      description: 'All-day ergonomic walking footwear for men featuring flexible groove outsoles, slip-on comfort, and reinforced heel stability.',
      coverImage: '/categories/walk-shoes-men.webp',
      imageAlt: 'KSports Men Walking Shoes',
      sortOrder: 3,
    },
    {
      name: 'Walk Shoes (Women)',
      slug: 'walk-shoes-women',
      description: 'Featherlight comfort walking shoes for women with pressure-relieving memory-foam footbeds and seamless breathable knit.',
      coverImage: '/categories/walk-shoes-women.webp',
      imageAlt: 'KSports Women Walking Shoes',
      sortOrder: 4,
    },
    {
      name: 'Badminton Shoes',
      slug: 'badminton-shoes',
      description: 'Non-marking gum rubber court shoes engineered for rapid lateral transitions, ankle stabilization, and indoor grip.',
      coverImage: '/categories/badminton-shoes.webp',
      imageAlt: 'KSports Badminton Shoes',
      sortOrder: 5,
    },
    {
      name: 'Cricket Shoes',
      slug: 'cricket-shoes',
      description: 'High-traction rubber turf stud cricket shoes engineered with reinforced toe-shielding, TPU arch support, and all-match cushioning.',
      coverImage: '/categories/cricket-shoes.webp',
      imageAlt: 'KSports Cricket Turf Shoes',
      sortOrder: 6,
    },
    {
      name: 'Socks',
      slug: 'socks',
      description: 'Official KSports athletic and lifestyle socks collection including basic range pouches, economy terry packs, 7-days signature collections, and 100% bamboo fiber tubes.',
      coverImage: '/products/bamboo-socks-pristine.jpg',
      imageAlt: 'KSports Socks Collection',
      sortOrder: 7,
    },
    {
      name: 'Insoles',
      slug: 'insoles',
      description: 'Orthopedic ergonomic arch support and shock-absorbing dual-gel sports insoles engineered for peak athletic protection and everyday foot support.',
      coverImage: '/categories/insoles.webp',
      imageAlt: 'KSports Performance Sports Insoles',
      sortOrder: 8,
    },
  ];

  const catMap = new Map();

  for (const cat of categoriesToUpdate) {
    const saved = await Category.findOneAndUpdate(
      { slug: cat.slug },
      {
        ...cat,
        isPublished: true,
        seo: {
          title: `${cat.name} | KSports Official Footwear`,
          description: cat.description,
        },
      },
      { upsert: true, new: true }
    );
    catMap.set(cat.slug, saved);
    console.log(`Saved Category: ${cat.name} (${cat.slug})`);
  }

  // Also ensure bamboo-socks category stays linked for legacy bookmarks
  const bambooCat = await Category.findOne({ slug: 'bamboo-socks' });
  if (bambooCat) {
    catMap.set('bamboo-socks', bambooCat);
  }

  // 2. Updated Products Definitions
  const productsToUpdate = [
    // --- JOGGING SHOES MEN ---
    {
      name: 'KSports StridePro Jogger (Men)',
      slug: 'ksports-stridepro-jogger-men',
      categorySlug: 'jogging-shoes-men',
      shortDescription: 'Lightweight breathable jacquard mesh jogging shoes engineered for men with dual-density EVA impact cushioning.',
      description:
        'Engineered for everyday fitness runners and athletes seeking a balanced blend of plush comfort and responsive energy return. Constructed with a reinforced jacquard breathable mesh upper, anatomical heel lock, and high-abrasion non-slip rubber traction pods.',
      features: [
        'Multi-surface shock absorption with high-rebound EVA compound',
        'Breathable dual-layer jacquard mesh upper',
        'Molded anatomical heel cradle preventing heel slippage',
        'Durable non-slip rubber traction pods for road and track',
      ],
      images: [
        {
          url: '/categories/jogging-shoes-men.webp',
          alt: 'KSports StridePro Jogger Men',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 1,
    },

    // --- JOGGING SHOES WOMEN ---
    {
      name: 'KSports SwiftAir Jogger (Women)',
      slug: 'ksports-swiftair-jogger-women',
      categorySlug: 'jogging-shoes-women',
      shortDescription: 'Plush athletic jogging shoes designed with responsive cushioning and ergonomic arch contours for women.',
      description:
        'Specially contoured around the ergonomic biomechanics of female athletes. The SwiftAir Jogger provides plush underfoot dampening, a featherlight seamless knit upper, and anti-fatigue ankle collars for effortless everyday jogging.',
      features: [
        'Ultra-lightweight responsive foam midsole for soft landings',
        'Breathable airflow air-mesh upper keeping feet cool',
        'Ergonomic female foot contour with contoured arch cradle',
        'Anti-fatigue padded ankle collar and soft tongue lining',
      ],
      images: [
        {
          url: '/categories/jogging-shoes-women.webp',
          alt: 'KSports SwiftAir Jogger Women',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 2,
    },

    // --- WALK SHOES MEN ---
    {
      name: 'KSports PaceWalk Comfort (Men)',
      slug: 'ksports-pacewalk-comfort-men',
      categorySlug: 'walk-shoes-men',
      shortDescription: 'All-day ergonomic walking footwear for men featuring flexible groove outsoles and reinforced heel stability.',
      description:
        'Engineered for long-shift corporate wear, daily fitness walking, and institutional travel. The PaceWalk Comfort combines dynamic arch support with flex-groove outsoles that mirror the natural biomechanical roll of your foot.',
      features: [
        'Dual-density supportive foam insole with shock relief',
        'Slip-on stretch-fit dynamic upper with secure lace overlays',
        'Flex-groove outsole for natural toe-to-heel transition',
        'High-abrasion rubber heel pad for extended durability',
      ],
      images: [
        {
          url: '/categories/walk-shoes-men.webp',
          alt: 'KSports PaceWalk Comfort Men',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 3,
    },

    // --- WALK SHOES WOMEN ---
    {
      name: 'KSports CloudWalk Daily (Women)',
      slug: 'ksports-cloudwalk-daily-women',
      categorySlug: 'walk-shoes-women',
      shortDescription: 'Featherlight comfort walking shoes for women with memory-foam footbeds and seamless breathable knit.',
      description:
        'Crafted for maximum ease and cloud-like walking comfort. Featuring a pressure-relieving memory-foam footbed, friction-free seamless upper, and ultra-lightweight shock-absorbing sole unit.',
      features: [
        'Pressure-relieving memory cushioning adapting to your foot shape',
        'Seamless friction-free knit upper preventing pressure points',
        'Flexible lightweight walking platform engineered for 10,000+ daily steps',
        'Shock-dampening heel geometry reducing joint strain',
      ],
      images: [
        {
          url: '/categories/walk-shoes-women.webp',
          alt: 'KSports CloudWalk Daily Women',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 4,
    },

    // --- BADMINTON SHOES ---
    {
      name: 'KSports CourtMaster Badminton Pro',
      slug: 'ksports-courtmaster-badminton-pro',
      categorySlug: 'badminton-shoes',
      shortDescription: 'High-traction indoor court shoes with lateral claws and shock-absorbing heel cushioning.',
      description:
        'Built for the intense deceleration and rapid lateral cutting demanded by competitive badminton. Featuring non-marking virgin gum rubber with a hexagonal tread pattern, lateral TPU stabilizers to prevent roll-over, and specialized shock absorption.',
      features: [
        'Hexagonal grip non-marking natural gum rubber outsole',
        'Lateral TPU claw system preventing ankle inversion during lunges',
        'Reinforced internal toe box resist wear against court friction',
        'Breathable sandwich mesh with synthetic leather overlays',
      ],
      images: [
        {
          url: '/categories/badminton-shoes.webp',
          alt: 'KSports CourtMaster Badminton Pro',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 5,
    },

    // --- CRICKET SHOES ---
    {
      name: 'KSports StrikeMaster Cricket Shoes',
      slug: 'ksports-strikemaster-cricket-shoes',
      categorySlug: 'cricket-shoes',
      shortDescription: 'High-traction rubber turf stud cricket shoes engineered with reinforced toe-shielding and TPU arch support.',
      description:
        'Engineered for batsmen, bowlers, and fielders competing on turf and synthetic pitches. Built with high-friction molded multi-stud outsoles, reinforced abrasion-resistant toe guard against fast-bowling drag, and a torsion-resistant TPU chassis.',
      features: [
        'Multi-directional rubber turf cleats for explosive acceleration and sudden stops',
        'Reinforced abrasion-resistant toe guard for bowling drag resistance',
        'Shock-absorbing EVA midsole engineered for 8+ hour match endurance',
        'Stiff TPU midfoot shank preventing torsional rotational twists',
      ],
      images: [
        {
          url: '/categories/cricket-shoes.webp',
          alt: 'KSports StrikeMaster Cricket Shoes',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 6,
    },

    // --- SOCKS: 3 PAIRS POUCH (BASIC RANGE) ₹119 ---
    {
      name: 'KSports 3 Pairs Pouch (Basic Range) - ₹119',
      slug: 'ksports-3-pairs-pouch-basic-range',
      categorySlug: 'socks',
      shortDescription: 'Value 3-pair pouch pack (Basic Range) crafted with durable cotton-blend knit for daily active wear · MRP ₹119',
      description:
        'The KSports Basic Range 3-Pair Pouch offers exceptional everyday value for sports academies, school athletic kits, and daily training regimes. Crafted from durable cotton-blend yarns with ribbed arch support and reinforced heel/toe zones.',
      features: [
        'x3 Pairs included in every sealed value pouch',
        'Official MRP: ₹119/- (Inclusive of all taxes)',
        'Breathable everyday combed cotton-blend knit',
        'Reinforced heel and toe zones for longer wear life',
        'Comfort-fit ribbed arch band preventing sock rotation',
        'Ideal for athletic teams, schools & institutional bulk supply',
      ],
      images: [
        {
          url: '/products/bamboo-socks-pristine.jpg',
          alt: 'KSports 3 Pairs Pouch Basic Range ₹119',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 7,
    },

    // --- SOCKS: 3 PAIRS POUCH (ECONOMY RANGE) ₹249 ---
    {
      name: 'KSports 3 Pairs Pouch (Economy Range) - ₹249',
      slug: 'ksports-3-pairs-pouch-economy-range',
      categorySlug: 'socks',
      shortDescription: 'Premium 3-pair pouch pack (Economy Range) with high-density terry cushioning and moisture management · MRP ₹249',
      description:
        'Engineered for competitive training and long hours on foot. The Economy Range 3-Pair Pouch integrates half-terry sole cushioning that absorbs vertical impact shock while mesh ventilation zones keep your feet cool and dry.',
      features: [
        'x3 Pairs included in resealable travel pouch',
        'Official MRP: ₹249/- (Inclusive of all taxes)',
        'High-density half-terry cushioned sole for impact shock absorption',
        'Moisture-wicking breathable ventilation channels over the instep',
        'Anti-slip elastane cuff that stays up without binding',
        'Reinforced high-durability polyamide toe seam',
      ],
      images: [
        {
          url: '/products/bamboo-socks-pristine.jpg',
          alt: 'KSports 3 Pairs Pouch Economy Range ₹249',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 8,
    },

    // --- SOCKS: 7 DAYS SIGNATURE PACK ₹499 ---
    {
      name: 'KSports 7 Days Signature Pack - ₹499',
      slug: 'ksports-7-days-signature-pack',
      categorySlug: 'socks',
      shortDescription: 'Weekly complete 7-pair signature pack engineered for peak freshness, anti-odor performance, and rotation · MRP ₹499',
      description:
        'A full weekly rotation of elite sports socks delivered in a premium 7-pair signature package. Built with silver-ion antimicrobial freshness, seamless hand-linked toe seams, and graduated arch compression for Monday-to-Sunday athletic excellence.',
      features: [
        'x7 Pairs included for complete week rotation (Monday to Sunday)',
        'Official MRP: ₹499/- (Inclusive of all taxes)',
        'Silver-ion freshness technology that eliminates odor-causing bacteria',
        'Seamless hand-linked flat toe closure preventing friction & blisters',
        'Targeted midfoot dynamic compression arch band',
        'Deluxe presentation pack ideal for gifting and corporate kits',
      ],
      images: [
        {
          url: '/products/bamboo-socks-pristine.jpg',
          alt: 'KSports 7 Days Signature Pack ₹499',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 9,
    },

    // --- SOCKS: 100% BAMBOO ATHLETIC SOCKS (3-PACK TUBE) ₹499 ---
    {
      name: 'KSports 100% Bamboo Athletic Socks (3-Pack Tube) - ₹499',
      slug: 'bamboo-socks-3-pack',
      categorySlug: 'socks',
      shortDescription: '100% Pure Bamboo Yarn · 3 Pairs in Eco-Friendly Recyclable Paper Tube · Naturally Anti-Bacterial & Ultra-Soft · MRP ₹499',
      description:
        'Engineered from 100% pure organic bamboo fiber, KSports Bamboo Athletic Socks offer natural thermo-regulation, hypo-allergenic skin gentleness, and three times the moisture absorption of standard cotton. Packaged in sustainable recyclable cylindrical kraft tubes.',
      features: [
        '100% Pure Organic Bamboo Fiber (Naturally Anti-Bacterial & Odor-Resistant)',
        'x3 Pairs included in every cylindrical recyclable eco-tube',
        'Official MRP: ₹499/- (Inclusive of all taxes)',
        'Ultra-soft silky handfeel with reinforced cushioning',
        'Seamless hand-linked toe seam for zero blister friction',
        'Eco-friendly biodegradable and recyclable packaging',
      ],
      images: [
        {
          url: '/products/bamboo-socks-pristine.jpg',
          alt: 'KSports 100% Bamboo Athletic Socks Tube',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 10,
    },

    // --- INSOLES: ARCH SUPPORT ---
    {
      name: 'KSports Ortho-Align Ergonomic Arch Support Insoles',
      slug: 'ksports-ortho-align-arch-support-insoles',
      categorySlug: 'insoles',
      shortDescription: 'Semi-rigid TPU arch support insoles with deep heel cup for plantar alignment and gait stabilization.',
      description:
        'Designed to combat plantar fasciitis, pronation, and foot fatigue during extended athletic training. The Ortho-Align features a semi-rigid anatomical nylon arch plate and deep stabilizing heel cup that aligns your ankles and knees.',
      features: [
        'Semi-rigid anatomical arch support plate preventing arch collapse',
        'Deep U-shaped heel cup stabilizing the calcaneus against rolling',
        'Breathable anti-microbial velvet top layer reducing friction',
        'Trim-to-fit sizing lines for custom footwear fit across all shoe sizes',
      ],
      images: [
        {
          url: '/categories/insoles.webp',
          alt: 'KSports Ortho-Align Arch Support Insoles',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 11,
    },

    // --- INSOLES: GEL CUSHION SPORT ---
    {
      name: 'KSports ShockShield Performance Gel Sport Insoles',
      slug: 'ksports-shockshield-gel-sport-insoles',
      categorySlug: 'insoles',
      shortDescription: 'Honeycomb dual-gel athletic insoles engineered for high-impact running, court sports, and strenuous training.',
      description:
        'Engineered for athletes performing repetitive high-impact landings on hard courts and turf. Featuring dual-density honeycomb polymer gel cushions under the heel strike zone and forefoot metatarsals for maximum energy dampening.',
      features: [
        'Dual-density honeycomb polymer gel pads under heel & forefoot',
        'High-rebound memory PU base absorbing up to 60% of ground impact shock',
        'Ventilated perforation array maintaining breathability and coolness',
        'Universal trim-to-fit guides for men and women sports shoes',
      ],
      images: [
        {
          url: '/categories/insoles.webp',
          alt: 'KSports ShockShield Gel Sport Insoles',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 12,
    },
  ];

  for (const prod of productsToUpdate) {
    const cat = catMap.get(prod.categorySlug);
    if (!cat) {
      console.warn(`Category not found for slug: ${prod.categorySlug}`);
      continue;
    }

    await Product.findOneAndUpdate(
      { slug: prod.slug },
      {
        name: prod.name,
        slug: prod.slug,
        categoryId: cat._id,
        shortDescription: prod.shortDescription,
        description: prod.description,
        features: prod.features,
        images: prod.images,
        isPublished: true,
        sortOrder: prod.sortOrder,
        seo: {
          title: `${prod.name} | KSports Footwear`,
          description: prod.shortDescription,
        },
      },
      { upsert: true, new: true }
    );
    console.log(`Saved Product: ${prod.name}`);
  }

  console.log('Catalog update complete!');
  await mongoose.disconnect();
}

runCatalogUpdate().catch((e) => {
  console.error('Update failed:', e);
  process.exit(1);
});
