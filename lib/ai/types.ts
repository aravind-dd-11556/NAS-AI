export interface AIConfig {
    provider: string;
    model: string;
    apiKey?: string; // Optional, some providers like Ollama might not need it or use env
}

export interface ExcuseOptions {
    format?: string;
    emoji?: boolean;
    meme?: boolean;
}

export interface AIProvider {
    generateExcuse(context: string, style: string, language?: string, options?: ExcuseOptions): Promise<string>;
}
