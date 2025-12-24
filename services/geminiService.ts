
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStorageSuggestion = async (productName: string, category: string, availablePositions: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Sugira a melhor posição de pallet para o produto "${productName}" (Categoria: ${category}) baseado nestas posições disponíveis: ${availablePositions.join(', ')}. Considere que produtos pesados ficam em níveis baixos (1 ou 2) e produtos de giro rápido perto da saída (Corredor A). Retorne apenas o ID da posição sugerida e uma breve justificativa.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedPosition: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["suggestedPosition", "reason"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
