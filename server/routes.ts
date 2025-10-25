import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateExplanation } from "./ai-service";
import { insertConversationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get a specific conversation with explanation
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Create a new conversation and generate explanation
  app.post("/api/conversations", async (req, res) => {
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
  });

  // Delete a conversation
  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteConversation(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
