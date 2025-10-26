// Using Gemini AI integration blueprint
import { GoogleGenAI } from "@google/genai";
import { TOPIC_CATEGORIES, type TopicCategory } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface StructuredExplanation {
  definition?: string;
  explanation: string;
  codeExample?: string;
  summary?: string;
  topic: TopicCategory;
}

export async function generateExplanation(question: string): Promise<StructuredExplanation> {
  const systemPrompt = `You are an expert educational AI tutor. Your goal is to provide clear, structured explanations that help students learn.

When answering questions, provide a response in the following JSON format:
{
  "definition": "A concise definition if applicable (optional)",
  "explanation": "A detailed step-by-step explanation with clear reasoning. Use numbered lists or bullet points where helpful.",
  "codeExample": "A practical code example if relevant (optional). Include comments to explain the code.",
  "summary": "2-3 key takeaways or summary points (optional)",
  "topic": "The most relevant category from: ${TOPIC_CATEGORIES.join(", ")}"
}

Guidelines:
- Keep explanations clear and educational
- Use simple language but maintain technical accuracy
- Include practical examples where relevant
- Break down complex concepts into digestible parts
- For code examples, use proper syntax and include helpful comments
- Choose the most specific topic category that fits the question
- If no category fits perfectly, use "General"`;

  try {
    console.log("Generating explanation for question:", question);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            definition: { type: "string" },
            explanation: { type: "string" },
            codeExample: { type: "string" },
            summary: { type: "string" },
            topic: { 
              type: "string",
              enum: TOPIC_CATEGORIES as any
            },
          },
          required: ["explanation", "topic"],
        },
      },
      contents: [
        {
          role: "user",
          parts: [{ text: question }]
        }
      ],
    });

    // Access text directly from response
    const rawJson = response.text;
    
    console.log("Gemini API response text:", rawJson);

    if (!rawJson) {
      console.error("Full response object:", JSON.stringify(response, null, 2));
      throw new Error("Empty response from AI model");
    }

    // Defensive parsing with validation
    let data: StructuredExplanation;
    try {
      data = JSON.parse(rawJson);
      
      // Validate required fields
      if (!data.explanation || !data.topic) {
        throw new Error("Missing required fields in AI response");
      }
      
      // Ensure topic is valid
      if (!TOPIC_CATEGORIES.includes(data.topic as any)) {
        data.topic = "General";
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", rawJson);
      throw new Error("Invalid response format from AI model");
    }

    return data;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error(`Failed to generate explanation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
