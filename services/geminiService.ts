
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { HealthProfile, FoodItem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const foodItemSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Name of the food item, e.g., 'Chapati' or 'Vegetable Curry'" },
    calories: { type: Type.NUMBER, description: "Estimated calories for the portion shown" },
    protein: { type: Type.NUMBER, description: "Estimated protein in grams" },
    carbohydrates: { type: Type.NUMBER, description: "Estimated carbohydrates in grams" },
    fats: { type: Type.NUMBER, description: "Estimated fats in grams" },
  },
  required: ["name", "calories", "protein", "carbohydrates", "fats"]
};

export const analyzeFoodImage = async (imageFile: File): Promise<FoodItem[]> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `Analyze the attached image of a meal. Identify each food item, paying special attention to common Indian dishes. For each item, provide your best estimate of its nutritional information for the portion size shown. Return the data as a JSON array of objects. If you cannot identify an item or estimate its nutrition, omit it from the array.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: foodItemSchema
        }
      }
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("The API returned an empty response. The food might not be recognizable.");
    }
    const result = JSON.parse(jsonText);
    return result as FoodItem[];
  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw new Error("Failed to analyze food image. The AI may not have recognized the items, or there was a network issue.");
  }
};

export const generateDietPlan = async (profile: HealthProfile): Promise<string> => {
  try {
    const conditionsText = profile.conditions.length > 0 && profile.conditions[0] !== "None" 
        ? `with the following health conditions: ${profile.conditions.join(', ')}` 
        : `with no specific health conditions`;
        
    const prompt = `Create a personalized one-day Indian diet plan for a person ${conditionsText}. The plan should be balanced, nutritious, and practical. Include breakfast, lunch, dinner, and two snacks. Provide approximate portion sizes.

IMPORTANT: Format your response using specific markdown rules:
1.  Use '###' for each meal title (e.g., '### Breakfast (8:00 - 8:30 AM)').
2.  Follow the title with the meal description on a new line.
3.  On the next line, provide the justification, starting with the word "Justification:" in bold (e.g., '**Justification:** Your reason here.').

Do not use any other markdown for structure, like single asterisks for lists or bolding for headings.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: "You are a professional nutritionist specializing in Indian cuisine and therapeutic diets. Your advice should be safe, practical, and encouraging. You must strictly follow the user's formatting instructions.",
            temperature: 0.7,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating diet plan:", error);
    throw new Error("Failed to generate a diet plan. Please try again later.");
  }
};
