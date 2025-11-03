import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleDeleteConversation, handleGetConversationById } from '../../server/routes.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case 'GET':
      return handleGetConversationById(req, res);
    case 'DELETE':
      return handleDeleteConversation(req, res);
    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}