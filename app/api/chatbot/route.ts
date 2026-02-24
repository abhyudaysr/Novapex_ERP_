import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API Key is present to prevent crashes
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    // Switched to gemini-1.5-flash for much faster response times
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });

    // Structured System Prompt to ensure the AI acts as a professional ERP assistant
    const systemPrompt = `
      You are the Focus.HR ERP AI Assistant. Your goal is to provide concise, 
      professional, and helpful insights based on the provided company data.

      Contextual Data:
      ${JSON.stringify(context, null, 2)}

      Instruction:
      - If the user asks about employee counts, attendance, or performance, refer to the data above.
      - Keep answers brief to maintain a fast user experience.
      - If the data is missing, suggest they check the relevant dashboard section.

      User Question: ${message}
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const reply = response.text();

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch response from AI assistant." }, 
      { status: 500 }
    );
  }
}
