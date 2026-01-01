import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

let model: any = null;

if (apiKey) {
    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
} else {
    console.warn("GEMINI_API_KEY is not set. AI features will not work.");
}

export async function generateExcuse(context: string, style: string = "Humorous"): Promise<string> {
    if (!model) {
        return "AI mode is unavailable (API Key missing). No.";
    }

    try {
        const prompt = `Generate a rejection/excuse. 
    Context: "${context || "general"}". 
    Style/Tone: "${style}".
    Keep it under 30 words. 
    Make it distinct to the requested style.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini generation error:", error);
        return "The AI is too tired to say no, so... just No.";
    }
}
