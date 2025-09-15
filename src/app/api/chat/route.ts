import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
const api_key= process.env.OPEN_AI_API_KEY;
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = body.message;
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api_key}`,
      {
        contents: [
          {
            parts: [{ text: userMessage }],
            role: "user",
          },
        ],
      }
    );

    const reply = geminiRes.data.candidates[0].content.parts[0].text;
    console.log("Gemini Reply:", reply);
    return NextResponse.json({ reply });
  } catch (error:any) {
    console.error("Gemini API Error:", error.message, error.response?.data);
    return new NextResponse("Failed to get Gemini AI response", {
      status: 500,
    });
  }
}
