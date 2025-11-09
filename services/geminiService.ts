import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey });

export const extractTextFromPdf = async (fileData: { mimeType: string; data: string }): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // A powerful multimodal model
      contents: {
        parts: [
          { text: "Extract all text from this PDF document. Preserve formatting like paragraphs and line breaks." },
          {
            inlineData: {
              mimeType: fileData.mimeType,
              data: fileData.data,
            },
          },
        ],
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
    throw new Error("Failed to extract text from PDF due to an unknown error.");
  }
};
