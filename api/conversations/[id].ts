import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStorage } from '../storage-instance';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const storage = getStorage();
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid conversation ID' });
  }

  // GET /api/conversations/:id - Get a specific conversation
  if (req.method === 'GET') {
    try {
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      
      return res.status(200).json(conversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return res.status(500).json({ error: 'Failed to fetch conversation' });
    }
  }

  // DELETE /api/conversations/:id - Delete a conversation
  if (req.method === 'DELETE') {
    try {
      await storage.deleteConversation(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return res.status(500).json({ error: 'Failed to delete conversation' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
