import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider } from "./types";

export class GoogleProvider implements AIProvider {
    private model: any;

    constructor(modelName: string, apiKey?: string) {
        const key = apiKey || process.env.GEMINI_API_KEY;
        if (!key) {
            throw new Error("Missing Google API Key");
        }
        const genAI = new GoogleGenerativeAI(key);
        this.model = genAI.getGenerativeModel({ model: modelName });
    }

    async generateExcuse(context: string, style: string, language: string = "English", options?: any): Promise<string> {
        try {
            let prompt = `Generate a rejection/excuse in ${language}. 
      Context: "${context || "general"}". 
      Style/Tone: "${style}".
      Keep it under 30 words.`;

            if (options?.meme) {
                prompt += ` Format the response as a popular internet meme template text (e.g. "Drake Hotline Bling", "Distracted Boyfriend").`;
            } else if (options?.format) {
                prompt += ` Format the output as ${options.format} code.`;
            }

            if (options?.emoji) {
                prompt += ` include fitting emojis.`;
            }

            prompt += ` Make it distinct to the requested style.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let text = response.text().trim();
            // Remove markdown code blocks if present (e.g. ```text ... ```)
            text = text.replace(/^```\w*\s*/, '').replace(/\s*```$/, '');
            return text;
        } catch (error) {
            console.error("Google AI generation error:", error);
            return "I tried to think of an excuse, but Google Brain froze. No.";
        }
    }
}
