import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { AspectRatio } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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

export const editImage = async (file: File, prompt: string): Promise<string> => {
    const imagePart = await fileToGenerativePart(file);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                imagePart,
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
            return part.inlineData.data;
        }
    }
    
    throw new Error("Image editing failed or the model did not return an image.");
};

export const analyzeImage = async (file: File): Promise<string> => {
  const imagePart = await fileToGenerativePart(file);
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { text: "You are a world-class AI image prompt engineer. Your task is to analyze an image and generate a highly detailed, artistic, and unique prompt for a text-to-image AI model. The prompt should capture the essence of the image's content, style, lighting, mood, color palette, and composition. The output should be a single, ready-to-use prompt string, without any additional conversation or explanation. Analyze this image and create an AI image prompt." },
        imagePart,
      ],
    },
  });
  return response.text;
};

export const translateText = async (text: string, targetLanguage: 'English' | 'Korean'): Promise<string> => {
  const prompt = `Translate the following phrase into a natural and fluent ${targetLanguage} sentence, suitable for a text-to-image AI prompt. Respond only with the translated text, nothing else. The phrase is: "${text}"`;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  
  return response.text.trim();
};

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
    if (!aspectRatio) aspectRatio = '1:1'; // Default if not set
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: aspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    } else {
        throw new Error("Image generation failed or returned no images.");
    }
};