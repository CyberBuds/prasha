import { CraftType, FabricType, OccasionType, Saree } from '@/types';

export interface CatalogProduct {
  id: number;
  productName: string;
  slug?: string;
  shortDescription?: string | null;
  description?: string | null;
  sellingPrice?: number | string | null;
  mrp?: number | string | null;
  discountType?: 'NONE' | 'PERCENTAGE' | 'FIXED' | null;
  discountValue?: number | string | null;
  categoryId?: number | null;
  category?: { name?: string | null } | null;
  fabric?: { name?: string | null } | null;
  occasion?: { name?: string | null } | null;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  images?: Array<{ imageUrl?: string | null; isPrimary?: boolean }>;
  variants?: Array<{ stock?: number | null }>;
  attributes?: Array<{ attributeKey?: string; attributeValue?: string }>;
}

export interface CatalogResponse {
  items: CatalogProduct[];
}

export interface CatalogCategory {
  id: number;
  name: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80';

function text(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function numberValue(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function findAttribute(product: CatalogProduct, key: string) {
  const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
  return product.attributes?.find((attribute) =>
    attribute.attributeKey?.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedKey
  )?.attributeValue;
}

function asCraft(value: string): CraftType {
  return value as CraftType;
}

function asFabric(value: string): FabricType {
  return value as FabricType;
}

function asOccasion(value: string): OccasionType {
  return value as OccasionType;
}

export function mapCatalogProduct(product: CatalogProduct): Saree {
  const images = product.images?.map((image) => image.imageUrl).filter((image): image is string => Boolean(image)) ?? [];
  const primaryImage = images[0] || DEFAULT_IMAGE;
  const secondaryImage = images[1] || primaryImage;
  const price = numberValue(product.sellingPrice, 0);
  const originalPrice = numberValue(product.mrp, price);
  const stockCount = product.variants?.reduce((total, variant) => total + Math.max(numberValue(variant.stock, 0), 0), 0) ?? 0;
  const category = text(product.category?.name, text(findAttribute(product, 'craft'), 'Handloom Saree'));
  const fabric = text(product.fabric?.name, text(findAttribute(product, 'fabric'), 'Handloom Silk'));
  const occasion = text(product.occasion?.name, text(findAttribute(product, 'occasion'), 'Festive & Puja'));
  const color = text(findAttribute(product, 'color'), 'Heritage Multicolor');
  const zariType = text(findAttribute(product, 'zariType'), 'Tested Gold Zari');

  return {
    id: String(product.id),
    slug: product.slug,
    attributes: product.attributes
      ?.filter((attribute): attribute is { attributeKey: string; attributeValue: string } => Boolean(attribute.attributeKey && attribute.attributeValue))
      .map((attribute) => ({ attributeKey: attribute.attributeKey, attributeValue: attribute.attributeValue })),
    title: product.productName,
    subtitle: text(product.shortDescription, 'Authentic handloom craftsmanship from Prasha'),
    craft: asCraft(category),
    fabric: asFabric(fabric),
    price,
    originalPrice,
    discountPercentage: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
    rating: 0,
    reviewsCount: 0,
    primaryImage,
    secondaryImage,
    detailImages: images.length > 0 ? images : [primaryImage],
    color,
    colorHex: '#8B0000',
    occasion: asOccasion(occasion),
    zariType: zariType as Saree['zariType'],
    blouseIncluded: false,
    blouseFabricDetails: 'Please check product details for blouse information.',
    isNew: product.isNewArrival,
    isBestseller: product.isBestSeller,
    weaverName: 'Prasha Artisan Collective',
    weaverLocation: 'India',
    weaverExperience: 'Traditional handloom craftsmanship',
    description: text(product.description, product.shortDescription || 'A thoughtfully curated handloom saree.'),
    careInstructions: 'Store in clean cotton muslin. Dry clean recommended.',
    length: 'Standard saree length',
    weight: 'Product-specific',
    authenticityCert: 'Handloom Mark Certified',
    inStock: stockCount > 0,
    stockCount,
    reviews: []
  };
}

export function mapCatalogProducts(response: CatalogResponse) {
  return response.items.map(mapCatalogProduct);
}

export async function fetchCatalog() {
  const [productsResponse, categoriesResponse] = await Promise.all([
    fetch('/api/catalog/products', { cache: 'no-store' }),
    fetch('/api/catalog/categories', { cache: 'no-store' })
  ]);

  if (!productsResponse.ok || !categoriesResponse.ok) {
    throw new Error('Unable to load the storefront catalogue.');
  }

  const products = (await productsResponse.json()) as CatalogResponse;
  const categories = (await categoriesResponse.json()) as CatalogCategory[];

  return {
    products: mapCatalogProducts(products),
    categories
  };
}