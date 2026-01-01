import { AIProvider } from "./types";
import ollama from "ollama";

export class OllamaProvider implements AIProvider {
    private modelName: string;
    private host: string;

    constructor(modelName: string, host: string = "http://127.0.0.1:11434") {
        this.modelName = modelName;
        this.host = host; // Ollama JS library might auto-detect, but we can configure if needed
    }

    async generateExcuse(context: string, style: string, language: string = "English", options?: any): Promise<string> {
        try {
            let systemPrompt = `You are a creative rejection generator. Respond in ${language}. Keep answers under 30 words. Be witty.`;

            if (options?.meme) {
                systemPrompt += ` Respond using a popular meme template format.`;
            } else if (options?.format) {
                systemPrompt += ` Output in ${options.format} format.`;
            }

            if (options?.emoji) {
                systemPrompt += ` Use emojis.`;
            }

            // Note: The 'ollama' package connects to localhost:11434 by default
            const response = await ollama.chat({
                model: this.modelName,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Generate a rejection. Context: "${context}". Style: "${style}".` }
                ],
            });
            let text = response.message.content.trim();
            // Remove markdown code blocks if present (e.g. ```text ... ```)
            text = text.replace(/^```\w*\s*/, '').replace(/\s*```$/, '');
            return text;
        } catch (error) {
            console.error("Ollama generation error:", error);
            return "My local brain is offline. No.";
        }
    }
}
