import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getStorage } from "./storage-instance.js";
import { generateExplanation } from "./ai-service.js";
import { z } from "zod";

const storage = getStorage();

export async function handleGetAllConversations(req: VercelRequest, res: VercelResponse) {
  try {
    const conversations = await storage.getAllConversations();
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
}

export async function handleGetConversationById(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    if (typeof id !== 'string') {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const conversation = await storage.getConversation(id);
    
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    
    res.json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
}

export async function handleCreateConversation(req: VercelRequest, res: VercelResponse) {
  try {
    // Validate request body
    const validationResult = z.object({
      question: z.string().min(1, "Question cannot be empty"),
    }).safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ 
        error: "Invalid request", 
        details: validationResult.error.errors 
      });
    }

    const { question } = validationResult.data;

    // Generate AI explanation
    const aiResponse = await generateExplanation(question);

    // Create conversation with detected topic
    const conversation = await storage.createConversation({
      question,
      topic: aiResponse.topic,
    });

    // Create explanation
    const explanation = await storage.createExplanation({
      conversationId: conversation.id,
      definition: aiResponse.definition || null,
      explanation: aiResponse.explanation,
      codeExample: aiResponse.codeExample || null,
      summary: aiResponse.summary || null,
    });

    // Return complete conversation with explanation
    res.json({
      ...conversation,
      explanation,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to create conversation"
    });
  }
}

export async function handleDeleteConversation(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    await storage.deleteConversation(String(id));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
}
