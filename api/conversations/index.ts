import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleGetAllConversations, handleCreateConversation } from '../../server/routes.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case 'GET':
      return handleGetAllConversations(req, res);
    case 'POST':
      return handleCreateConversation(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}