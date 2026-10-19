import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../../models/Admin';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';
import { Page } from '../../models/Page';
import { SiteSettings } from '../../models/SiteSettings';
import { AdminActivityLog } from '../../models/AdminActivityLog';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://klubinternational_db_user:sNr5fKt7g5sYWJr3@cluster0.unco14l.mongodb.net/klub_sports?retryWrites=true&w=majority';

const INITIAL_EMAIL = process.env.INITIAL_ADMIN_EMAIL || 'admin@ksports.co.in';
const INITIAL_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD || 'KSportsAdmin2026!Secure';

export async function runSeed() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected successfully.');

  // 1. Provision Admin
  console.log('Provisioning Administrator account...');
  const existingAdmin = await Admin.findOne({ email: INITIAL_EMAIL.toLowerCase() });
  let adminId;
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(INITIAL_PASSWORD, salt);
    const newAdmin = await Admin.create({
      email: INITIAL_EMAIL.toLowerCase(),
      passwordHash: hash,
      isActive: true,
    });
    adminId = newAdmin._id;
    console.log(`Admin created: ${INITIAL_EMAIL}`);
  } else {
    adminId = existingAdmin._id;
    console.log(`Admin already exists: ${INITIAL_EMAIL}`);
  }

  // 2. Provision Categories (11 categories from source presentation)
  console.log('Seeding official footwear categories...');
  const categoryDefs = [
    {
      name: 'Running Shoes',
      slug: 'running-shoes',
      description: 'Precision-engineered athletic runners designed for maximum energy return, ergonomic cushioning, and daily road endurance.',
      coverImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'KSports Running Shoes',
      sortOrder: 1,
    },
    {
      name: 'Marathon Shoes',
      slug: 'marathon-shoes',
      description: 'Ultra-lightweight high-mileage footwear with responsive carbon-infused foam compounds for elite long-distance competitors.',
      coverImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'KSports Marathon Shoes',
      sortOrder: 2,
    },
    {
      name: 'Track & Field Shoes',
      slug: 'track-field-shoes',
      description: 'Aerodynamic spike-plate footwear engineered for explosive acceleration, sprinting rigidity, and collegiate field competition.',
      coverImage: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'KSports Track and Field Footwear',
      sortOrder: 3,
    },
    {
      name: 'Badminton Shoes',
      slug: 'badminton-shoes',
      description: 'Non-marking gum rubber court shoes engineered for rapid lateral transitions, ankle stabilization, and indoor grip.',
      coverImage: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'KSports Badminton Shoes',
      sortOrder: 4,
    },
    {
      name: 'Basketball Shoes',
      slug: 'basketball-shoes',
      description: 'High-top impact protection footwear engineered with multi-directional herringbone traction and dual-density heel dampening.',
      coverImage: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'KSports Basketball Shoes',
      sortOrder: 5,
    },
    {
      name: 'Football Shoes',
      slug: 'football-shoes',
      description: 'Molded firm-ground cleats crafted with synthetic microfiber uppers for tactile ball control and sudden directional bursts.',
      coverImage: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'KSports Football Boots',
      sortOrder: 6,
    },
    {
      name: 'Kabaddi Shoes',
      slug: 'kabaddi-shoes',
      description: 'Specialized indoor mat shoes with flexible reinforced toe caps, aggressive ankle collars, and high-traction friction soles.',
      coverImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'KSports Kabaddi Shoes',
      sortOrder: 7,
    },
    {
      name: 'Tennis Shoes',
      slug: 'tennis-shoes',
      description: 'Abrasion-resistant court shoes featuring reinforced medial drag guards, TPU shank torsion control, and hard-court durability.',
      coverImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'KSports Tennis Shoes',
      sortOrder: 8,
    },
    {
      name: 'Jogging Shoes',
      slug: 'jogging-shoes',
      description: 'Breathable jacquard mesh footwear designed for plush comfort, impact dispersion, and versatile fitness regimens.',
      coverImage: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'KSports Jogging Shoes',
      sortOrder: 9,
    },
    {
      name: 'Boxing Shoes',
      slug: 'boxing-shoes',
      description: 'Featherweight mid-cut boots with flat grooved rubber outsoles engineered for pivot velocity, ring balance, and ankle support.',
      coverImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'KSports Boxing Shoes',
      sortOrder: 10,
    },
    {
      name: 'Off-Road & Trail Footwear',
      slug: 'trail-footwear',
      description: 'Rugged terrain footwear built with deep multidirectional lugged outsoles, stone-shield rock plates, and water-repellent mudguards.',
      coverImage: 'https://images.unsplash.com/photo-1551107696-a4b085a6d91a?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'KSports Trail Footwear',
      sortOrder: 11,
    },
  ];

  const categoryMap = new Map();
  for (const cat of categoryDefs) {
    const saved = await Category.findOneAndUpdate(
      { slug: cat.slug },
      {
        ...cat,
        isPublished: true,
        seo: {
          title: `${cat.name} | KSports Corporate Footwear`,
          description: cat.description,
        },
      },
      { upsert: true, new: true }
    );
    categoryMap.set(cat.slug, saved);
  }
  console.log(`Seeded ${categoryDefs.length} categories.`);

  // 3. Seed Showcase Products (No prices, No cart)
  console.log('Seeding showcase footwear products...');
  const productDefs = [
    {
      name: 'KSports Velocity Pro Carbon',
      slug: 'ksports-velocity-pro-carbon',
      categorySlug: 'marathon-shoes',
      shortDescription: 'Marathon racing shoe with carbon-composite propulsion plate and supercritical foam.',
      description:
        'Engineered for long-distance marathoners seeking uncompromising energy return. Built with a full-length curved carbon-composite plate embedded within supercritical EVA foam, the Velocity Pro stabilizes transitions while minimizing metabolic fatigue over 42 kilometers.',
      features: [
        'Curved carbon propulsion plate for rapid toe-off mechanics',
        'Dual-density supercritical foam dampening',
        'Engineered single-layer monofilament mesh upper',
        'High-abrasion blown rubber outsole pods for wet and dry asphalt grip',
        'Ultra-lightweight race day construction',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
          alt: 'KSports Velocity Pro Carbon Profile',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
          alt: 'KSports Velocity Pro Outsole',
          isPrimary: false,
          sortOrder: 1,
        },
      ],
      sortOrder: 1,
    },
    {
      name: 'KSports Aerofly Sprint Spikes',
      slug: 'ksports-aerofly-sprint-spikes',
      categorySlug: 'track-field-shoes',
      shortDescription: 'Collegiate sprint spike footwear with 8-pin aerodynamic Pebax chassis.',
      description:
        'Designed specifically for explosive 100m to 400m track sprinters. Features an aggressive full-length Pebax spike plate providing maximum torsional stiffness and ground reaction force, paired with an aerodynamic synthetic seamless skin.',
      features: [
        'Rigid Pebax spike plate with 8 replaceable spike receptacles',
        'Micro-perforated aerodynamic upper for minimal air drag',
        'Reinforced heel counter for stable sprint gate starts',
        'Anatomical midfoot wrap for locked-in sprint confidence',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80',
          alt: 'KSports Aerofly Sprint Spike Lateral View',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 2,
    },
    {
      name: 'KSports CourtMaster Badminton Pro',
      slug: 'ksports-courtmaster-badminton-pro',
      categorySlug: 'badminton-shoes',
      shortDescription: 'High-traction indoor court shoes with lateral claws and shock-absorbing heel cushioning.',
      description:
        'Built for the intense deceleration and lateral cutting demanded by competitive badminton. Featuring non-marking virgin gum rubber with a hexagonal tread pattern, lateral TPU stabilizers to prevent roll-over, and specialized shock absorption under the calcaneus.',
      features: [
        'Hexagonal grip non-marking natural gum rubber outsole',
        'Lateral TPU claw system preventing ankle inversion during lunges',
        'Reinforced internal toe box resist wear against court friction',
        'Breathable sandwich mesh with synthetic leather overlays',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1000&q=80',
          alt: 'KSports CourtMaster Badminton Pro Lateral',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 3,
    },
    {
      name: 'KSports Mat-Strike Kabaddi',
      slug: 'ksports-mat-strike-kabaddi',
      categorySlug: 'kabaddi-shoes',
      shortDescription: 'Dedicated kabaddi shoes with enhanced ankle grip and high-friction synthetic gum soles.',
      description:
        'Crafted specifically for the demanding sport of Kabaddi. The Mat-Strike integrates an ergonomic padded high-ankle collar to protect raiders and defenders from sudden sprains, reinforced rubberized toe-caps for dragging resistance, and a specialized mat-grip sole.',
      features: [
        'High-cut padded ankle collar for ligament stability',
        'Durable rubber wrap-around toe guard for toe touches and drags',
        'Zero-slip mat sole compound tested on professional synthetic surfaces',
        'Quick-lace eyelet system with lace-tuck tongue pocket',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
          alt: 'KSports Mat-Strike Kabaddi Shoe',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 4,
    },
    {
      name: 'KSports Apex FG Football Boots',
      slug: 'ksports-apex-fg-football-boots',
      categorySlug: 'football-shoes',
      shortDescription: 'Molded firm-ground football boots with 3D micro-textured touch control zones.',
      description:
        'The Apex FG delivers instantaneous control and razor-sharp pivoting on firm natural grass pitches. Engineered with a thermoformed polyurethane chassis, conical and bladed stud geometry, and a responsive synthetic upper with embossed passing ribs.',
      features: [
        'Conical and chevron stud configuration for multidirectional agility',
        'Embossed 3D touch micro-textures across vamp and instep',
        'Ultra-lightweight molded TPU outsole with arch reinforcement',
        'Integrated knit collar for snug sock-like ankle lockdown',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1000&q=80',
          alt: 'KSports Apex FG Football Boots Side Profile',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 5,
    },
    {
      name: 'KSports Stratus Daily Runner',
      slug: 'ksports-stratus-daily-runner',
      categorySlug: 'running-shoes',
      shortDescription: 'Daily athletic trainer with balanced dual-cushioning and high-durability rubber outsole.',
      description:
        'The workhorse trainer in the KSports line. Crafted for daily road mileage, gym drills, and institutional sports fitness protocols. Provides plush step-in comfort and durable abrasion-resistant rubber in high-wear zones.',
      features: [
        'Dual-density EVA midsole for balanced shock absorption',
        'Seamless breathable engineered mesh upper with reflective accents',
        'Molded OrthoLite anti-microbial sockliner',
        'Strategically mapped flex grooves promoting natural foot strike',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
          alt: 'KSports Stratus Daily Runner Red & White',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 6,
    },
    {
      name: 'KSports Ring-Master Boxing Boots',
      slug: 'ksports-ring-master-boxing-boots',
      categorySlug: 'boxing-shoes',
      shortDescription: 'Mid-cut boxing boots with thin grip rubber soles for rapid footwork and ring canvas traction.',
      description:
        'Engineered for pugilists who demand split-second weight transfers and unwavering canvas contact. Featuring ultra-breathable synthetic mesh side panels, mid-cut ankle stabilization straps, and a flat non-slip razor tread outsole.',
      features: [
        'Thin low-profile rubber outsole for superior ring tactile feedback',
        'Reinforced midfoot strap for locked-down stability',
        'High-ventilation dual-layer mesh preventing heat buildup',
        'Reinforced heel cup minimizing slip during aggressive pivots',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80',
          alt: 'KSports Ring-Master Boxing Boots',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 7,
    },
    {
      name: 'KSports Terra-Force Trail Explorer',
      slug: 'ksports-terra-force-trail-explorer',
      categorySlug: 'trail-footwear',
      shortDescription: 'All-terrain footwear with aggressive 5mm lugs, toe rock shield, and weather-resistant upper.',
      description:
        'Engineered to conquer unpredictable outdoor terrain, rocky trails, and mud. Featuring 5mm multi-directional rubber lugs, a flexible ballistic nylon rock plate to shield the foot from sharp stones, and a water-resistant mudguard perimeter.',
      features: [
        '5mm aggressive lugged outsole compound for wet clay and rock traction',
        'Flexible forefoot rock protection plate',
        'Abrasion-resistant ripstop mesh with synthetic TPU welded overlays',
        'Gusseted tongue preventing trail debris from entering shoe',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1551107696-a4b085a6d91a?auto=format&fit=crop&w=1000&q=80',
          alt: 'KSports Terra-Force Trail Explorer',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      sortOrder: 8,
    },
  ];

  for (const prod of productDefs) {
    const categoryDoc = categoryMap.get(prod.categorySlug);
    if (!categoryDoc) continue;

    await Product.findOneAndUpdate(
      { slug: prod.slug },
      {
        name: prod.name,
        slug: prod.slug,
        categoryId: categoryDoc._id,
        shortDescription: prod.shortDescription,
        description: prod.description,
        features: prod.features,
        images: prod.images,
        isPublished: true,
        sortOrder: prod.sortOrder,
        seo: {
          title: `${prod.name} | KSports Catalogue`,
          description: prod.shortDescription,
        },
      },
      { upsert: true, new: true }
    );
  }
  console.log(`Seeded ${productDefs.length} products.`);

  // 4. Provision Pages
  console.log('Seeding CMS Page content...');
  const pages = [
    {
      key: 'home',
      title: 'Home',
      sections: {
        hero: {
          headline: 'SHOES FOR EVERY SPORT',
          subheadline:
            'Explore sports footwear designed around performance, comfort and the demands of the game.',
          primaryCtaText: 'Explore Our Products',
          primaryCtaLink: '/products',
          secondaryCtaText: 'Business Enquiries',
          secondaryCtaLink: '/contact',
          bannerImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1600&q=85',
          videoUrl: '/videos/hero-athlete.webm',
        },
        highlights: {
          title: 'Manufacturing & Operational Strength',
          description:
            'Figures sourced from presentation deck — pending official client certification.',
          metrics: [
            { label: 'Manufacturing Facilities', value: '4 Factories', verified: false, note: 'Sourced from presentation' },
            { label: 'Industrial Factory Area', value: '130,000 sq. ft.', verified: false, note: 'Sourced from presentation' },
            { label: 'Monthly Production Capacity', value: '4,00,000 Units', verified: false, note: 'Sourced from presentation' },
            { label: 'Operational Reach', value: '12 States Across India', verified: false, note: 'Sourced from presentation' },
            { label: 'Annual Turnover', value: '₹3 Crore', verified: false, note: 'Sourced from presentation' },
          ],
        },
        aboutSnippet: {
          title: 'Engineered for Performance & Scale',
          paragraph:
            'KSports is an Indian sports footwear brand dedicated to building athletic footwear tailored to the demands of diverse sporting disciplines. From long-distance marathons and indoor court games to grass pitches and mat wrestling, our footwear is designed with precision, durability, and ergonomic support.',
          ctaText: 'Learn About KSports',
          ctaLink: '/about',
        },
        partnerCta: {
          headline: 'Looking for a Sports Footwear Partner?',
          subheadline:
            'Partner with KSports for bulk institutional procurement, wholesale distribution, corporate footwear supply, and team athletic programs.',
          ctaText: 'Discuss Your Requirements',
          ctaLink: '/contact',
        },
      },
      seo: {
        title: 'KSports | Premium Sports Footwear Manufacturer',
        description: 'Discover sports footwear designed around performance, comfort and the demands of the game.',
      },
      isPublished: true,
    },
    {
      key: 'about',
      title: 'About Us',
      sections: {
        intro: {
          title: 'The KSports Story',
          subtitle: 'Dedicated to athletic excellence and institutional sports footwear across India.',
          content:
            'KSports represents a commitment to high-performance footwear engineering. By focusing on athlete safety, specialized traction, and anatomical shock dispersion, KSports produces footwear capable of meeting the stringent requirements of competitive sports leagues, schools, academies, and athletic teams across India.',
        },
        deckInconsistencyNote: {
          title: 'Brand Note',
          content: 'KSports is the official approved brand name for all corporate identity, footwear production, and institutional supply partnerships.',
        },
        pillars: [
          {
            title: 'Sport-Specific Ergonomics',
            description:
              'Each category in our catalogue is engineered with biomechanical considerations specific to that sport — from non-marking court gum rubber to track spike plates.',
          },
          {
            title: 'High-Volume Production',
            description:
              'Supported by robust manufacturing facilities capable of delivering large-scale institutional orders, state academy supplies, and commercial distributor contracts.',
          },
          {
            title: 'Rigorous Material Selection',
            description:
              'We deploy supercritical foams, TPU torsional shanks, and breathable engineered uppers to ensure our footwear withstands demanding athletic regimens.',
          },
        ],
      },
      seo: {
        title: 'About Us | KSports Footwear',
        description: 'Learn about KSports, our brand mission, operational strength, and commitment to sports footwear engineering.',
      },
      isPublished: true,
    },
    {
      key: 'manufacturing',
      title: 'Manufacturing Capabilities',
      sections: {
        hero: {
          title: 'Industrial Manufacturing & Engineering Scale',
          subtitle: 'Modern footwear production infrastructure engineered for institutional consistency and durability.',
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
        },
        deckFiguresNotice: {
          noticeText:
            'Note: Key manufacturing statistics below are retrieved from the client source presentation and are maintained pending final client audit verification.',
        },
        capabilities: [
          {
            title: 'Four Dedicated Manufacturing Units',
            detail: 'Multi-unit industrial infrastructure allowing concurrent production of court shoes, cleated boots, and lightweight runners.',
            figure: '4 Factories',
          },
          {
            title: 'Expansive Factory Footprint',
            detail: 'Spanning approximately 130,000 square feet of dedicated cutting, stitching, sole molding, and vulcanization floor space.',
            figure: '130,000 sq. ft.',
          },
          {
            title: 'High-Throughput Output',
            detail: 'Configured for high-volume monthly capacity to satisfy nationwide distributor orders and seasonal institutional athletic tenders.',
            figure: '4,00,000 Pairs/Mo',
          },
          {
            title: 'Pan-India Distribution Network',
            detail: 'Active commercial distribution footprint spanning 12 Indian states with dedicated regional supply channels.',
            figure: '12 States',
          },
        ],
      },
      seo: {
        title: 'Manufacturing Capabilities | KSports',
        description: 'Explore the industrial manufacturing infrastructure, production capacity, and facilities behind KSports footwear.',
      },
      isPublished: true,
    },
    {
      key: 'contact',
      title: 'Contact Us',
      sections: {
        header: {
          title: 'Partner with KSports',
          subtitle: 'Connect with our corporate team for bulk institutional procurement, wholesale enquiries, and sports footwear partnerships.',
        },
        notice: {
          text: 'Our institutional desk reviews all business enquiries within 24 to 48 business hours.',
        },
      },
      seo: {
        title: 'Contact & Business Enquiries | KSports',
        description: 'Submit business and bulk institutional enquiries for KSports athletic footwear.',
      },
      isPublished: true,
    },
    {
      key: 'privacy',
      title: 'Privacy Policy',
      sections: {
        content: `
# Privacy Policy — KSports

**Effective Date:** January 1, 2026  
**Last Updated:** October 2026  

At **KSports**, we value your privacy and are committed to safeguarding any business or contact information you provide when visiting our website or submitting business enquiries.

### 1. Information We Collect
When you submit a business enquiry through our website, we may collect:
- Full Name
- Company / Organization Name
- Email Address
- Telephone / Mobile Number
- Interested Footwear Category
- Enquiry Message and Requirement Details

### 2. How We Use Your Information
We use your information solely to:
- Respond to your business enquiries and supply requests
- Discuss bulk procurement, institutional tenders, and dealership distribution
- Provide technical product catalogues and specifications
- Maintain internal business records

### 3. Data Protection & Security
We implement strict administrative, technical, and physical security measures to safeguard your personal and corporate details. We do not sell, rent, or trade your contact information to third parties.

### 4. Cookies & Analytics
Our website uses essential session cookies for administrative authentication and basic operational telemetry. No intrusive commercial tracking or behavioral advertising cookies are used.

### 5. Contacting Us
For questions regarding this privacy policy or to update your business information, please reach out to:  
**Email:** info@ksports.co.in  
**Brand:** KSports
        `,
      },
      seo: {
        title: 'Privacy Policy | KSports',
        description: 'Official privacy policy and data governance statement for KSports.',
      },
      isPublished: true,
    },
  ];

  for (const page of pages) {
    await Page.findOneAndUpdate(
      { key: page.key },
      {
        ...page,
        updatedBy: 'seed-system',
      },
      { upsert: true, new: true }
    );
  }
  console.log(`Seeded ${pages.length} CMS pages.`);

  // 5. Seed Site Settings
  console.log('Seeding Site Settings...');
  await SiteSettings.findOneAndUpdate(
    {},
    {
      brandName: 'KSports',
      tagline: 'Shoes For Every Sport',
      logoAsset: {
        horizontal: '/brand/logo-horizontal.png',
        stacked: '/brand/logo-stacked.png',
        icon: '/brand/logo-icon.png',
        wordmark: '/brand/logo-wordmark.png',
      },
      contactDetails: {
        email: 'info@ksports.co.in',
        phone: '+91 98765 43210',
        secondaryPhone: '+91 98765 43211',
        address: 'KSports Manufacturing Facilities, Industrial Area, India',
        workingHours: 'Monday – Saturday: 9:00 AM – 6:00 PM IST',
      },
      socialLinks: {
        linkedin: 'https://linkedin.com/company/klubsports',
        instagram: '',
        facebook: '',
        twitter: '',
        youtube: '',
      },
      footerContent: {
        copyright: '© 2026 KSports. All rights reserved.',
        description:
          'KSports is an Indian corporate sports footwear brand engineered for athletic performance, institutional supply, and multi-sport competitions.',
      },
      defaultSeo: {
        title: 'KSports | Premium Sports Footwear Manufacturer',
        description:
          'Official manufacturer and institutional partner for premium sports footwear across India. Shoes for every sport.',
      },
      updatedBy: 'seed-system',
    },
    { upsert: true, new: true }
  );
  console.log('Site settings seeded.');

  // Log activity
  await AdminActivityLog.create({
    adminId,
    adminEmail: INITIAL_EMAIL,
    action: 'SEED',
    resourceType: 'SETTINGS',
    resourceId: 'initial-setup',
    summary: 'Initial database provisioning and content seed completed successfully.',
    timestamp: new Date(),
  });

  console.log('Database seed completed successfully!');
  await mongoose.disconnect();
}

runSeed()
  .then(() => {
    console.log('Seed execution finished.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed execution error:', err);
    process.exit(1);
  });

