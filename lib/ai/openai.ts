import OpenAI from "openai";
import { AIProvider } from "./types";

export class OpenAIProvider implements AIProvider {
    private client: OpenAI;
    private modelName: string;

    constructor(modelName: string, apiKey?: string) {
        const key = apiKey || process.env.OPENAI_API_KEY;
        if (!key) {
            // Allow initialization without key if only checking instance, 
            // but strictly it should probably fail if we intend to use it.
            // For now, let's assume env or passed key.
        }

        this.client = new OpenAI({
            apiKey: key,
            dangerouslyAllowBrowser: false
        });
        this.modelName = modelName;
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

            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Generate a rejection. Context: "${context}". Style: "${style}".` }
                ],
                model: this.modelName,
            });

            let text = completion.choices[0].message.content?.trim() || "AI was speechless. No.";
            // Remove markdown code blocks if present (e.g. ```text ... ```)
            text = text.replace(/^```\w*\s*/, '').replace(/\s*```$/, '');
            return text;
        } catch (error) {
            console.error("OpenAI generation error:", error);
            return "OpenAI is currently closedAI. No.";
        }
    }
}
