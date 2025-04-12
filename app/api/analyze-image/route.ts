// Import Next.js helper to construct HTTP responses
import { NextResponse } from "next/server";

// Import the Google Generative AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Generative AI client using the Gemini API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Define a POST route handler to analyze an emergency image using Gemini AI
export async function POST(request: Request) {
  try {
    // Extract the image (in base64 format) from the incoming JSON request body
    const { image } = await request.json();

    // Remove the data URL prefix and keep only the base64-encoded image string
    const base64Data = image.split(",")[1];

    // Get an instance of the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Define a structured prompt to instruct the AI on how to respond
    const prompt = `Analyze this emergency situation image and respond in this exact format without any asterisks or bullet points:
TITLE: Write a clear, brief title
TYPE: Choose one (Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, or Other)
DESCRIPTION: Write a clear, concise description`;

    // Send the image and the prompt to the Gemini model to generate a response
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,       // Base64 image data
          mimeType: "image/jpeg", // Image type
        },
      },
    ]);

    // Await and extract the text result from the model's response
    const text = await result.response.text();

    // Use regular expressions to extract specific fields from the AI response
    const titleMatch = text.match(/TITLE:\s*(.+)/);
    const typeMatch = text.match(/TYPE:\s*(.+)/);
    const descMatch = text.match(/DESCRIPTION:\s*(.+)/);

    // Return the parsed fields in JSON format
    return NextResponse.json({
      title: titleMatch?.[1]?.trim() || "",         // Extracted title or empty string
      reportType: typeMatch?.[1]?.trim() || "",     // Extracted report type or empty string
      description: descMatch?.[1]?.trim() || "",    // Extracted description or empty string
    });

  } catch (error) {
    // Log any unexpected errors for debugging purposes
    console.error("Image analysis error:", error);

    // Return a 500 error response if something went wrong
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
