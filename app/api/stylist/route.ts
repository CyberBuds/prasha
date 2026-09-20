import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

interface CatalogProductSuggestion {
  id: string;
  title: string;
  craft: string;
  fabric: string;
  price: number;
  color: string;
  occasion: string;
  description: string;
}

async function getCatalogInventory(): Promise<CatalogProductSuggestion[]> {
  const apiUrl = process.env.VASTRA_API_URL;
  if (!apiUrl) return [];

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/storefront/products?limit=50`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });

    if (!response.ok) return [];

    const payload = await response.json();
    const products = Array.isArray(payload?.data?.items) ? payload.data.items : Array.isArray(payload?.items) ? payload.items : [];

    return products.map((product: any) => ({
      id: String(product.id ?? product.productId ?? ''),
      title: product.productName || product.title || 'Handloom Saree',
      craft: product.category?.name || product.craft || 'Handloom Saree',
      fabric: product.fabric?.name || product.fabric || 'Silk',
      price: Number(product.sellingPrice ?? product.price ?? 0),
      color: product.attributes?.find((attribute: any) => attribute.attributeKey?.toLowerCase() === 'color')?.attributeValue || product.color || 'Traditional',
      occasion: product.attributes?.find((attribute: any) => attribute.attributeKey?.toLowerCase() === 'occasion')?.attributeValue || product.occasion || 'Festive & Puja',
      description: product.shortDescription || product.description || 'Crafted by Prasha artisans.'
    }));
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const { occasion, colorPreference, budget, weather, additionalNotes } = await req.json();
    const catalog = await getCatalogInventory();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        advice: "Based on your preferences, we recommend a refined handloom silk or linen option from our live catalog. Our current collection is curated by Prasha artisans and updated from the backend inventory.",
        recommendedSareeIds: catalog.slice(0, 3).map((product: CatalogProductSuggestion) => product.id).filter(Boolean)
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are Prasha's Chief Handloom Stylist, an expert in traditional Indian sarees, weaves, zari types, and drape styling.
A valued customer is looking for saree guidance.

Customer Details:
- Occasion / Event: ${occasion || 'General Festive'}
- Preferred Color Palette: ${colorPreference || 'Any traditional color'}
- Budget Preference: ${budget ? `Around ₹${budget}` : 'Flexible'}
- Season / Weather: ${weather || 'Warm / Indoor Air Conditioned'}
- Additional Style Notes: ${additionalNotes || 'None'}

Available Prasha Sarees Catalogue:
${JSON.stringify(catalog, null, 2)}

Please respond in valid JSON format with the following structure:
{
  "greeting": "A warm, elegant greeting from Prasha",
  "advice": "Detailed, expert styling advice explaining why specific weaves and colors suit their occasion, body drape, and weather (2-3 paragraphs)",
  "drapeTip": "A professional drape or blouse styling tip specific to the recommended weaves",
  "recommendedSareeIds": ["product-id-1", "product-id-2"]
}

Important: Select 2 to 3 saree IDs from the catalogue that best match the query. Output ONLY the JSON object.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '';
    let parsedData: { greeting?: string; advice?: string; drapeTip?: string; recommendedSareeIds?: string[] };
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = {
        greeting: 'Welcome to Prasha Couture.',
        advice: 'For your special occasion, a handwoven silk or linen saree from our live collection brings timeless grace and a tailored festive statement.',
        drapeTip: 'Pair with a structured blouse and delicate temple jewellery to highlight the fabric texture and pallu fall.',
        recommendedSareeIds: catalog.slice(0, 3).map((product: CatalogProductSuggestion) => product.id).filter(Boolean)
      };
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Prasha Stylist API Error:', error);
    return NextResponse.json({
      greeting: 'Greetings from Prasha',
      advice: 'Our master weavers recommend choosing a rich handloom silk or an airy linen piece from the live collection for your occasion.',
      drapeTip: 'Use classic double pleating for the pallu to showcase the weave and zari border work.',
      recommendedSareeIds: []
    });
  }
}
