import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStorage } from '../storage-instance';
import { generateExplanation } from '../../server/ai-service';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const storage = getStorage();

  // GET /api/conversations - Get all conversations
  if (req.method === 'GET') {
    try {
      const conversations = await storage.getAllConversations();
      return res.status(200).json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }

  // POST /api/conversations - Create a new conversation
  if (req.method === 'POST') {
    try {
      // Validate request body
      const validationResult = z.object({
        question: z.string().min(1, 'Question cannot be empty'),
      }).safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid request', 
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
      return res.status(200).json({
        ...conversation,
        explanation,
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to create conversation'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
