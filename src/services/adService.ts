import { GoogleGenAI, Type } from "@google/genai";
import { Ad } from "../types";
import { Timestamp } from "firebase/firestore";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const AD_CATEGORIES = [
  "Gardening", "Crypto", "Knitting", "Extreme Sports", "Luxury Watches", 
  "Pet Insurance", "Vegan Cooking", "Mechanical Keyboards", "Bird Watching",
  "Vintage Cars", "Space Travel", "Biohacking", "Indie Games", "Sustainable Fashion"
];

export async function generateRandomAds(count: number = 5): Promise<Partial<Ad>[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} diverse and random advertisement ideas for a platform that helps users obfuscate their digital footprint. 
      The categories should be very different from each other to create "noise".
      Categories to choose from or inspire: ${AD_CATEGORIES.join(", ")}.
      Return a JSON array of objects with title, description, category, and a suggested keyword for an image (e.g., "vintage car").`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              imageKeyword: { type: Type.STRING }
            },
            required: ["title", "description", "category", "imageKeyword"]
          }
        }
      }
    });

    const data = JSON.parse(response.text);
    return data.map((item: any) => ({
      title: item.title,
      description: item.description,
      category: item.category,
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(item.imageKeyword)}/800/600`,
      targetUrl: "https://example.com",
      price: Math.floor(Math.random() * 50) + 5, // 5-55 cents
      createdAt: Timestamp.now()
    }));
  } catch (error) {
    console.error("Error generating ads:", error);
    // Fallback static ads
    return [
      {
        title: "Premium Alpaca Wool",
        description: "The softest wool for your next knitting project.",
        category: "Knitting",
        imageUrl: "https://picsum.photos/seed/alpaca/800/600",
        targetUrl: "https://example.com",
        price: 15,
        createdAt: Timestamp.now()
      }
    ];
  }
}
