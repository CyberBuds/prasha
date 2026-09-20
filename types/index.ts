export type CraftType = 
  | 'Banarasi Silk'
  | 'Kanjivaram Zari'
  | 'Chanderi Silk Cotton'
  | 'Tussar Handblock'
  | 'Organza Zardozi'
  | 'Linen Handloom'
  | 'Bandhani & Patola'
  | 'Jamdani Handwoven';

export type FabricType = 'Pure Mulberry Silk' | 'Kanjivaram Silk' | 'Chanderi Silk' | 'Organza Silk' | 'Linen' | 'Tussar Silk';

export type OccasionType = 'Bridal & Wedding' | 'Festive & Puja' | 'Cocktails & Soirées' | 'Casual Elegance' | 'Office & Daily';

export interface CustomerReview {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  userPhoto?: string;
}

export interface Saree {
  id: string;
  title: string;
  subtitle: string;
  craft: CraftType;
  fabric: FabricType;
  price: number; // in INR
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  primaryImage: string;
  secondaryImage: string;
  detailImages: string[];
  color: string;
  colorHex: string;
  occasion: OccasionType;
  zariType: 'Pure Gold Zari' | 'Tested Gold Zari' | 'Silver Resham' | 'Antique Copper Zari';
  blouseIncluded: boolean;
  blouseFabricDetails: string;
  isNew?: boolean;
  isBestseller?: boolean;
  weaverName: string;
  weaverLocation: string;
  weaverExperience: string;
  description: string;
  careInstructions: string;
  length: string; // e.g., "5.5 meters saree + 0.8 meters unstitched blouse"
  weight: string; // e.g., "680 grams"
  authenticityCert: 'Silk Mark India Certified' | 'Handloom Mark Certified' | 'GI Tagged Authentic';
  inStock: boolean;
  stockCount: number;
  reviews: CustomerReview[];
}

export interface BlouseCustomization {
  stitchType: 'unstitched' | 'stitched';
  stitchingFee?: number;
  bustSize?: number; // 32, 34, 36, 38, 40, 42, 44
  neckStyle?: 'classic_u' | 'sweetheart' | 'boat_neck' | 'deep_back_latkan';
  sleeveStyle?: 'elbow_length' | 'short_sleeve' | 'sleeveless';
  isPadded?: boolean;
}

export interface CartItem {
  saree: Saree;
  quantity: number;
  fallAndPicot: boolean; // ₹250 add-on
  blouseCustomization: BlouseCustomization;
}

export interface FilterState {
  crafts: CraftType[];
  fabrics: string[];
  occasions: OccasionType[];
  colors: string[];
  maxPrice: number;
  minPrice: number;
  onlyBestsellers: boolean;
  onlyInStock: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'price_low' | 'price_high' | 'rating' | 'newest';
}

export interface WeaverStory {
  id: string;
  name: string;
  region: string;
  specialty: string;
  experienceYears: number;
  quote: string;
  image: string;
  loomType: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  joinedDate: string;
  tier: string;
}

export interface OrderDetails {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  status: 'Order Placed' | 'Quality Check & Fall/Picot' | 'Handloom Dispatched' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  estimatedDelivery: string;
}
