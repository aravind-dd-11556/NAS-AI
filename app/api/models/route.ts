import { NextResponse } from 'next/server';

export async function GET() {
    const models = {
        google: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
        openai: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
        ollama: ["llama3", "mistral", "gemma"] // These are defaults, UI could allow custom text input
    };
    return NextResponse.json(models);
}
