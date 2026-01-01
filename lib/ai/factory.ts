import { AIProvider } from "./types";
import { GoogleProvider } from "./google";
import { OpenAIProvider } from "./openai";
import { OllamaProvider } from "./ollama";

export function getAIProvider(provider: string, model: string, apiKey?: string): AIProvider {
    switch (provider.toLowerCase()) {
        case "google":
            return new GoogleProvider(model, apiKey);
        case "openai":
            return new OpenAIProvider(model, apiKey);
        case "ollama":
            return new OllamaProvider(model);
        default:
            // Default fallback
            return new GoogleProvider("gemini-2.0-flash", apiKey);
    }
}
