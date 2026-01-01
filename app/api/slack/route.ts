import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { webhookUrl, message } = await request.json();

        if (!webhookUrl || !message) {
            return NextResponse.json(
                { error: 'Missing webhookUrl or message' },
                { status: 400 }
            );
        }

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: message,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Slack API error: ${response.status} ${errorText}` },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending to Slack:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
