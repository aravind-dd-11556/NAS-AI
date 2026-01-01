import { getClassicExcuse } from '@/lib/excuses';
import { getAIProvider } from '@/lib/ai/factory';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'English';
    const excuse = getClassicExcuse(language);
    return NextResponse.json({ excuse });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { context, style, provider = 'google', model = 'gemini-2.0-flash', apiKey, language, format, emoji, meme } = body;

        const aiProvider = getAIProvider(provider, model, apiKey);
        const excuse = await aiProvider.generateExcuse(context, style || "witty", language, { format, emoji, meme });

        return NextResponse.json({ excuse });
    } catch (error) {
        console.error('Error generating excuse:', error);
        return NextResponse.json(
            { error: 'Failed to generate excuse' },
            { status: 500 }
        );
    }
}
