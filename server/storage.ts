import { type Conversation, type InsertConversation, type Explanation, type InsertExplanation, type ConversationWithExplanation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Conversation methods
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<ConversationWithExplanation | undefined>;
  getAllConversations(): Promise<ConversationWithExplanation[]>;
  deleteConversation(id: string): Promise<void>;
  
  // Explanation methods
  createExplanation(explanation: InsertExplanation): Promise<Explanation>;
}

export class MemStorage implements IStorage {
  private conversations: Map<string, Conversation>;
  private explanations: Map<string, Explanation>;

  constructor() {
    this.conversations = new Map();
    this.explanations = new Map();
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = { 
      ...insertConversation,
      topic: insertConversation.topic || null,
      id,
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(id: string): Promise<ConversationWithExplanation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;

    const explanation = Array.from(this.explanations.values()).find(
      (exp) => exp.conversationId === id
    );

    return {
      ...conversation,
      explanation,
    };
  }

  async getAllConversations(): Promise<ConversationWithExplanation[]> {
    const allConversations = Array.from(this.conversations.values());
    
    return allConversations.map(conversation => {
      const explanation = Array.from(this.explanations.values()).find(
        (exp) => exp.conversationId === conversation.id
      );
      
      return {
        ...conversation,
        explanation,
      };
    }).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async deleteConversation(id: string): Promise<void> {
    this.conversations.delete(id);
    
    // Also delete associated explanation
    const explanationId = Array.from(this.explanations.entries()).find(
      ([_, exp]) => exp.conversationId === id
    )?.[0];
    
    if (explanationId) {
      this.explanations.delete(explanationId);
    }
  }

  async createExplanation(insertExplanation: InsertExplanation): Promise<Explanation> {
    const id = randomUUID();
    const explanation: Explanation = {
      ...insertExplanation,
      id,
      createdAt: new Date(),
    };
    this.explanations.set(id, explanation);
    return explanation;
  }
}

export const storage = new MemStorage();
