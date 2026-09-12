import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_SAREES } from '@/data/sarees';

export async function POST(req: NextRequest) {
  try {
    const { occasion, colorPreference, budget, weather, additionalNotes } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback response if GEMINI_API_KEY is not set
      return NextResponse.json({
        advice: "Based on your preferences, we recommend our classic Banarasi Silk or Kanjivaram Zari saree for high-end celebrations, or Chanderi/Linen for light, breathable elegance.",
        recommendedSareeIds: ['prasha-banarasi-01', 'prasha-kanjivaram-02', 'prasha-chanderi-03']
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
${JSON.stringify(
  INITIAL_SAREES.map(s => ({
    id: s.id,
    title: s.title,
    craft: s.craft,
    fabric: s.fabric,
    price: s.price,
    color: s.color,
    occasion: s.occasion,
    description: s.description
  })),
  null,
  2
)}

Please respond in valid JSON format with the following structure:
{
  "greeting": "A warm, elegant greeting from Prasha",
  "advice": "Detailed, expert styling advice explaining why specific weaves and colors suit their occasion, body drape, and weather (2-3 paragraphs)",
  "drapeTip": "A professional drape or blouse styling tip specific to the recommended weaves",
  "recommendedSareeIds": ["prasha-banarasi-01", "prasha-kanjivaram-02"]
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
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = {
        greeting: "Welcome to Prasha Couture.",
        advice: "For your special occasion, a traditional handwoven Banarasi or Kanjivaram silk saree brings unparalleled grace and timeless elegance.",
        drapeTip: "Pair with a tailored elbow-length raw silk blouse and gold temple jewellery.",
        recommendedSareeIds: ['prasha-banarasi-01', 'prasha-kanjivaram-02']
      };
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Prasha Stylist API Error:", error);
    return NextResponse.json({
      greeting: "Greetings from Prasha",
      advice: "Our master weavers recommend choosing a rich Katan Silk Banarasi for evening celebrations or Chanderi Silk for day events.",
      drapeTip: "Use classic double pleating for the pallu to showcase the zari border work.",
      recommendedSareeIds: ['prasha-banarasi-01', 'prasha-kanjivaram-02', 'prasha-chanderi-03']
    });
  }
}
