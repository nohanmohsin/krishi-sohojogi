import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
  apiKey: JSON.stringify(import.meta.env.VITE_GOOGLE_API_KEY),
});
