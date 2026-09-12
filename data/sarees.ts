import { Saree, WeaverStory } from '@/types';

export const INITIAL_SAREES: Saree[] = [
  {
    id: 'prasha-banarasi-01',
    title: 'Kadhwa Royal Crimson Banarasi Katan Silk Saree',
    subtitle: 'Handwoven in Varanasi with Pure Gold & Silver Zari Meenakari Motifs',
    craft: 'Banarasi Silk',
    fabric: 'Pure Mulberry Silk',
    price: 24900,
    originalPrice: 32000,
    discountPercentage: 22,
    rating: 4.9,
    reviewsCount: 38,
    primaryImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
    detailImages: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    color: 'Crimson Red',
    colorHex: '#8B0000',
    occasion: 'Bridal & Wedding',
    zariType: 'Pure Gold Zari',
    blouseIncluded: true,
    blouseFabricDetails: 'Matching Crimson Pure Katan Silk with Heavy Zari Border (80 cm)',
    isBestseller: true,
    isNew: false,
    weaverName: 'Master Weaver Pandit Shivnath Shastri',
    weaverLocation: 'Madanpura, Varanasi, Uttar Pradesh',
    weaverExperience: '34 Years',
    description: 'An ethereal bridal masterpiece hand-woven over 42 continuous loom days. Features traditional Kadwa weave technique where each floral bootie is woven individually without floating threads on the reverse side. Ornamented with intimate Meenakari enamel-inspired resham work.',
    careInstructions: 'Strictly Dry Clean Only. Store wrapped in pure unbleached cotton muslin fabric.',
    length: '5.5 meters saree length + 0.8 meters unstitched blouse piece',
    weight: '720 grams',
    authenticityCert: 'Silk Mark India Certified',
    inStock: true,
    stockCount: 3,
    reviews: [
      {
        id: 'rev-01',
        userName: 'Sunita Mehra',
        userCity: 'New Delhi',
        rating: 5,
        date: '14 Jan 2026',
        comment: 'Wore this for my daughter’s wedding in Jaipur. The weight, fall, and zari sheen were absolutely regal. Everyone asked if it was an ancestor heirloom!',
        verifiedBuyer: true
      },
      {
        id: 'rev-02',
        userName: 'Pooja Kulkarni',
        userCity: 'Mumbai',
        rating: 5,
        date: '02 Feb 2026',
        comment: 'Authentic Banarasi quality. The Silk Mark certificate came attached with QR verification. Prasha’s packaging in a velvet box was top tier.',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'prasha-kanjivaram-02',
    title: 'Kanchipuram Emerald Royal Korvai Silk Saree',
    subtitle: 'Woven with Double Warp Pure Zari Temple Border & Heavy Pallu',
    craft: 'Kanjivaram Zari',
    fabric: 'Kanjivaram Silk',
    price: 38500,
    originalPrice: 48000,
    discountPercentage: 20,
    rating: 5.0,
    reviewsCount: 29,
    primaryImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    detailImages: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    color: 'Emerald & Magenta',
    colorHex: '#004B23',
    occasion: 'Bridal & Wedding',
    zariType: 'Pure Gold Zari',
    blouseIncluded: true,
    blouseFabricDetails: 'Contrasting Magenta Silk with Heavy Mayil (Peacock) Zari Motifs',
    isBestseller: true,
    isNew: true,
    weaverName: 'Master Weaver V. Ramanathan',
    weaverLocation: 'Pillaiyarpalayam, Kanchipuram, Tamil Nadu',
    weaverExperience: '40 Years',
    description: 'Crafted using the ancient Korvai technique where the body and contrast temple border are woven separately and joined seamlessly by two weavers working side by side. Tested silver zari electroplated in 24k gold.',
    careInstructions: 'Dry Clean Only. Air out every 6 months in indirect shade.',
    length: '5.5 meters + 0.8 meters contrast blouse piece',
    weight: '850 grams',
    authenticityCert: 'GI Tagged Authentic',
    inStock: true,
    stockCount: 2,
    reviews: [
      {
        id: 'rev-03',
        userName: 'Radhika Sundaram',
        userCity: 'Chennai',
        rating: 5,
        date: '28 Dec 2025',
        comment: 'Pure Kanchipuram bliss! The Korvai joint is pristine and thread work feels smooth as butter. Outstanding handloom authenticity.',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'prasha-chanderi-03',
    title: 'Chanderi Gold Tissue Tissue Zari Sheer Saree',
    subtitle: 'Ultra-Lightweight Mulberry Silk Cotton with Handwoven Ashrafi Motifs',
    craft: 'Chanderi Silk Cotton',
    fabric: 'Chanderi Silk',
    price: 12800,
    originalPrice: 16500,
    discountPercentage: 22,
    rating: 4.8,
    reviewsCount: 44,
    primaryImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    detailImages: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
    ],
    color: 'Pastel Gold & Ivory',
    colorHex: '#E6C280',
    occasion: 'Festive & Puja',
    zariType: 'Antique Copper Zari',
    blouseIncluded: true,
    blouseFabricDetails: 'Unstitched Chanderi Silk Cotton running fabric',
    isBestseller: false,
    isNew: true,
    weaverName: 'Artisan Farooq Ansari',
    weaverLocation: 'Chanderi, Ashoknagar, Madhya Pradesh',
    weaverExperience: '22 Years',
    description: 'Renowned for its gossamer lightness and translucent luster, this Chanderi saree is woven using fine 300-count silk warp and Mercerized cotton weft. Golden ashrafi coin motifs shimmer with subtle elegance.',
    careInstructions: 'Gentle Dry Clean or Mild Silk Shampoo hand wash.',
    length: '5.5 meters + 0.8 meters blouse piece',
    weight: '340 grams',
    authenticityCert: 'Handloom Mark Certified',
    inStock: true,
    stockCount: 5,
    reviews: [
      {
        id: 'rev-04',
        userName: 'Ananya Sharma',
        userCity: 'Bengaluru',
        rating: 5,
        date: '10 Jan 2026',
        comment: 'So airy and comfortable for summer weddings. Pleats set gracefully. Beautiful subtle shine!',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'prasha-organza-04',
    title: 'Peach Organza Silk Hand-Embroidered Zardozi Saree',
    subtitle: 'Sheer Glass Organza with Dabka, Gotapatti & French Knots Border',
    craft: 'Organza Zardozi',
    fabric: 'Organza Silk',
    price: 21500,
    originalPrice: 27000,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 19,
    primaryImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
    detailImages: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80'
    ],
    color: 'Blush Peach',
    colorHex: '#FFDAB9',
    occasion: 'Cocktails & Soirées',
    zariType: 'Tested Gold Zari',
    blouseIncluded: true,
    blouseFabricDetails: 'Raw Silk Blouse Piece with Matching Sleeve Zardozi Embroidery',
    isBestseller: true,
    isNew: false,
    weaverName: 'Karkhana Master Nizamuddin',
    weaverLocation: 'Lucknow, Uttar Pradesh',
    weaverExperience: '28 Years',
    description: 'A ethereal dream rendered in fine organza silk. Intricately hand-embroidered by artisan zardoz workers using real gold metallic threads, cutdana, pearl beads, and delicate sequins along scalloped borders.',
    careInstructions: 'Dry Clean Only. Steam iron on reverse under cotton press cloth.',
    length: '5.5 meters + 0.8 meters embroidered blouse piece',
    weight: '490 grams',
    authenticityCert: 'Silk Mark India Certified',
    inStock: true,
    stockCount: 4,
    reviews: [
      {
        id: 'rev-05',
        userName: 'Kriti Kapoor',
        userCity: 'Chandigarh',
        rating: 5,
        date: '19 Jan 2026',
        comment: 'Modern royalty! I received endless compliments at my reception dinner.',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'prasha-linen-05',
    title: 'Handspun Indigo Linen Saree with Metallic Silver Zari Border',
    subtitle: '100% Organic French Flax Linen Handblock Printed with Natural Indigo',
    craft: 'Linen Handloom',
    fabric: 'Linen',
    price: 8900,
    originalPrice: 11500,
    discountPercentage: 22,
    rating: 4.7,
    reviewsCount: 52,
    primaryImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
    detailImages: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    ],
    color: 'Royal Indigo',
    colorHex: '#1A2B4C',
    occasion: 'Office & Daily',
    zariType: 'Silver Resham',
    blouseIncluded: true,
    blouseFabricDetails: 'Contrast Off-White Handblock Printed Linen Blouse Fabric',
    isBestseller: false,
    isNew: true,
    weaverName: 'Artisan Co-op Weavers',
    weaverLocation: 'Phulia, Nadia, West Bengal',
    weaverExperience: '18 Years',
    description: 'Breathable luxury crafted from 80-lea handspun flax linen. Washed with natural enzymes for a cloud-soft drape that softens further with every wash. Accentuated with subtle silver zari border.',
    careInstructions: 'Hand wash separately in cold water with mild liquid detergent or dry clean.',
    length: '5.5 meters + 0.8 meters blouse piece',
    weight: '510 grams',
    authenticityCert: 'Handloom Mark Certified',
    inStock: true,
    stockCount: 8,
    reviews: [
      {
        id: 'rev-06',
        userName: 'Dr. Vasundhara Rao',
        userCity: 'Hyderabad',
        rating: 5,
        date: '25 Jan 2026',
        comment: 'Essential office wear for senior professionals. Crisp yet supple.',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'prasha-tussar-06',
    title: 'Tribal Handblock Kantha Tussar Silk Saree',
    subtitle: 'Wild Golden Tussar Silk with Intricate Hand Kantha Stitching',
    craft: 'Tussar Handblock',
    fabric: 'Tussar Silk',
    price: 16800,
    originalPrice: 21000,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 31,
    primaryImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    detailImages: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80'
    ],
    color: 'Honey Gold & Ochre',
    colorHex: '#DAA520',
    occasion: 'Casual Elegance',
    zariType: 'Antique Copper Zari',
    blouseIncluded: true,
    blouseFabricDetails: 'Matching Raw Tussar Silk with Kantha Border',
    isBestseller: true,
    isNew: false,
    weaverName: 'Rural Women Artisan Collective',
    weaverLocation: 'Santiniketan, West Bengal',
    weaverExperience: '25 Years',
    description: 'Harvested from wild oak tussar silkworms, giving it a characteristic rich texture and natural golden sheen. Over 180 hours of hand-stitched running Kantha embroidery telling stories of Bengali folklore.',
    careInstructions: 'Dry Clean Only. Keep in breathable cloth bag.',
    length: '5.5 meters + 0.8 meters blouse piece',
    weight: '590 grams',
    authenticityCert: 'Silk Mark India Certified',
    inStock: true,
    stockCount: 3,
    reviews: [
      {
        id: 'rev-07',
        userName: 'Malini Dutt',
        userCity: 'Kolkata',
        rating: 5,
        date: '11 Feb 2026',
        comment: 'Pure artistic heritage! The texture of real wild tussar is unmatched.',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'prasha-bandhani-07',
    title: 'Gaji Silk Rai Bandhej & Patola Ikkat Fusion Saree',
    subtitle: 'Hand-Tied 10000+ Micro Knots Bandhani with Pure Zari Border',
    craft: 'Bandhani & Patola',
    fabric: 'Pure Mulberry Silk',
    price: 29500,
    originalPrice: 36000,
    discountPercentage: 18,
    rating: 5.0,
    reviewsCount: 22,
    primaryImage: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
    detailImages: [
      'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=1000&q=80'
    ],
    color: 'Deep Vermilion & Mustard',
    colorHex: '#C72C3B',
    occasion: 'Festive & Puja',
    zariType: 'Pure Gold Zari',
    blouseIncluded: true,
    blouseFabricDetails: 'Gaji Silk Blouse Piece with Rai Bandhej Dots',
    isBestseller: true,
    isNew: true,
    weaverName: 'Master Artisan Khatri Mohammad Ibrahim',
    weaverLocation: 'Bhuj, Kutch, Gujarat',
    weaverExperience: '38 Years',
    description: 'A masterpiece combining Gujarat’s two grand craft legacies: intricate Rai Bandhani tie-dyeing and double Ikkat Patola pallu motifs. Tie-dyed knot by knot using fingernails.',
    careInstructions: 'Dry Clean Only. Store flat without heavy weight on knots.',
    length: '5.5 meters + 0.8 meters Gaji silk blouse',
    weight: '640 grams',
    authenticityCert: 'GI Tagged Authentic',
    inStock: true,
    stockCount: 2,
    reviews: [
      {
        id: 'rev-08',
        userName: 'Meghna Patel',
        userCity: 'Ahmedabad',
        rating: 5,
        date: '05 Feb 2026',
        comment: 'The knots are so fine and vibrant! Prasha truly preserves real Kutchi masterwork.',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'prasha-jamdani-08',
    title: 'Dhakai Muslin Jamdani Pure Cotton Feather-Weight Saree',
    subtitle: 'Woven with Discontinuous Weft Technique in Fine 200s Count Thread',
    craft: 'Jamdani Handwoven',
    fabric: 'Pure Mulberry Silk',
    price: 18900,
    originalPrice: 24000,
    discountPercentage: 21,
    rating: 4.8,
    reviewsCount: 16,
    primaryImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
    detailImages: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80'
    ],
    color: 'Ivory & Fine Gold',
    colorHex: '#FFFFF0',
    occasion: 'Casual Elegance',
    zariType: 'Silver Resham',
    blouseIncluded: true,
    blouseFabricDetails: 'Running Unstitched Dhakai Muslin Fabric',
    isBestseller: false,
    isNew: true,
    weaverName: 'Master Weaver Abdul Latif',
    weaverLocation: 'Kalna, East Bardhaman, West Bengal',
    weaverExperience: '30 Years',
    description: 'Declared intangible cultural heritage of humanity by UNESCO, Dhakai Jamdani is woven using bamboo needles to insert supplementary floral tapestry motifs directly on the loom as it is being woven.',
    careInstructions: 'Dry Clean or Gentle Cold Water Handwash.',
    length: '5.5 meters + 0.8 meters blouse piece',
    weight: '290 grams',
    authenticityCert: 'GI Tagged Authentic',
    inStock: true,
    stockCount: 4,
    reviews: []
  }
];

export const WEAVER_STORIES: WeaverStory[] = [
  {
    id: 'weaver-01',
    name: 'Pandit Shivnath Shastri',
    region: 'Varanasi, Uttar Pradesh',
    specialty: 'Kadhwa Banarasi Katan Silk',
    experienceYears: 34,
    quote: 'When my fingers guide the silver shuttles across the jacquard threads, I am not just making cloth—I am breathing life into six generations of sacred Varanasi art.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    loomType: 'Traditional Handloom Jacquard Pit Loom'
  },
  {
    id: 'weaver-02',
    name: 'V. Ramanathan & Family',
    region: 'Kanchipuram, Tamil Nadu',
    specialty: 'Korvai Pure Zari Kanjivaram',
    experienceYears: 40,
    quote: 'A true Kanjivaram Korvai requires two weavers working in complete rhythm—one for the borders, one for the body. It is a dance of devotion.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    loomType: 'Frame Loom with Double Shuttle Korvai Setup'
  },
  {
    id: 'weaver-03',
    name: 'Khatri Mohammad Ibrahim',
    region: 'Kutch, Gujarat',
    specialty: 'Rai Bandhani Micro-Tying',
    experienceYears: 38,
    quote: 'Each tiny dot on a Prasha Bandhani saree is tied by hand with cotton thread. There are over 12,000 knots on a single saree. Patience is our worship.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    loomType: 'Natural Indigo Vat & Traditional Tying Pins'
  }
];

export const OCCASIONS_LIST = [
  {
    title: 'Bridal & Wedding',
    tagline: 'Royal Banarasi & Kanjivaram Trousseau Essentials',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    count: '24 Weaves'
  },
  {
    title: 'Festive & Puja',
    tagline: 'Bandhani, Chanderi & Vibrant Zari Weaves for Celebrations',
    image: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80',
    count: '32 Weaves'
  },
  {
    title: 'Cocktails & Soirées',
    tagline: 'Ethereal Organza, Tissue Silk & Hand Zardozi Statement Sarees',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    count: '18 Weaves'
  },
  {
    title: 'Casual Elegance',
    tagline: 'Handblock Tussar & Breathable Linen for Effortless Charm',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    count: '29 Weaves'
  }
];
