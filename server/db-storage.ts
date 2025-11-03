import { eq } from "drizzle-orm";
import { db } from "./db.js";
import { conversations, explanations, type InsertConversation, type InsertExplanation } from "@shared/schema.js";
import type { IStorage } from "./storage.js";

export class DbStorage implements IStorage {
  async createConversation(insert: InsertConversation) {
    const [conversation] = await db
      .insert(conversations)
      .values(insert)
      .returning();
    return conversation;
  }

  async getConversation(id: string) {
    const conversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, id),
      with: {
        explanation: true,
      },
    });
    return conversation;
  }

  async getAllConversations() {
    const allConversations = await db.query.conversations.findMany({
      with: {
        explanation: true,
      },
      orderBy: (conversations, { desc }) => [desc(conversations.createdAt)],
    });
    return allConversations;
  }

  async deleteConversation(id: string) {
    // Drizzle doesn't have cascading deletes in the ORM yet,
    // so we delete the explanation first.
    await db.delete(explanations).where(eq(explanations.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  async createExplanation(insert: InsertExplanation) {
    const [explanation] = await db
      .insert(explanations)
      .values(insert)
      .returning();
    return explanation;
  }
}