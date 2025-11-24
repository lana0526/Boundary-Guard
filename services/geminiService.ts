import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, Perspective, Language } from "../types";
import { SYSTEM_INSTRUCTION, ANALYSIS_SCHEMA } from "../constants";

export const analyzeText = async (text: string, perspective: Perspective, language: Language): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        temperature: 0.3, 
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: JSON.stringify({
                user_text: text,
                perspective: perspective,
                response_language: language
              })
            }
          ]
        }
      ]
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from the model.");
    }

    const result = JSON.parse(responseText) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Error analyzing text:", error);
    throw error;
  }
};