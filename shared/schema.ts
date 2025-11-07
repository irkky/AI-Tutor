import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Question/Conversation schema
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  topic: text("topic"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI Explanation schema with structured sections
export const explanations = pgTable("explanations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
  definition: text("definition"),
  explanation: text("explanation").notNull(),
  codeExample: text("code_example"),
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations
export const conversationsRelations = relations(conversations, ({ one }) => ({
  explanation: one(explanations, {
    fields: [conversations.id],
    references: [explanations.conversationId],
  }),
}));

export const explanationsRelations = relations(explanations, ({ one }) => ({
  conversation: one(conversations, {
    fields: [explanations.conversationId],
    references: [conversations.id],
  }),
}));

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertExplanationSchema = createInsertSchema(explanations).omit({
  id: true,
  createdAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertExplanation = z.infer<typeof insertExplanationSchema>;
export type Explanation = typeof explanations.$inferSelect;

// Frontend types for combined conversation + explanation
export interface ConversationWithExplanation extends Conversation {
  explanation?: Explanation;
}

// Topic categories
export const TOPIC_CATEGORIES = [
  "Python",
  "JavaScript",
  "Data Science",
  "Machine Learning",
  "AI",
  "Math",
  "Statistics",
  "Algorithms",
  "Web Development",
  "Database",
  "General",
] as const;

export type TopicCategory = typeof TOPIC_CATEGORIES[number];
