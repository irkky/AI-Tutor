// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  conversations;
  explanations;
  constructor() {
    this.conversations = /* @__PURE__ */ new Map();
    this.explanations = /* @__PURE__ */ new Map();
  }
  async createConversation(insertConversation) {
    const id = randomUUID();
    const conversation = {
      ...insertConversation,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.conversations.set(id, conversation);
    return conversation;
  }
  async getConversation(id) {
    const conversation = this.conversations.get(id);
    if (!conversation) return void 0;
    const explanation = Array.from(this.explanations.values()).find(
      (exp) => exp.conversationId === id
    );
    return {
      ...conversation,
      explanation
    };
  }
  async getAllConversations() {
    const allConversations = Array.from(this.conversations.values());
    return allConversations.map((conversation) => {
      const explanation = Array.from(this.explanations.values()).find(
        (exp) => exp.conversationId === conversation.id
      );
      return {
        ...conversation,
        explanation
      };
    }).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
  async deleteConversation(id) {
    this.conversations.delete(id);
    const explanationId = Array.from(this.explanations.entries()).find(
      ([_, exp]) => exp.conversationId === id
    )?.[0];
    if (explanationId) {
      this.explanations.delete(explanationId);
    }
  }
  async createExplanation(insertExplanation) {
    const id = randomUUID();
    const explanation = {
      ...insertExplanation,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.explanations.set(id, explanation);
    return explanation;
  }
};
var storage = new MemStorage();

// server/ai-service.ts
import { GoogleGenAI } from "@google/genai";

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  topic: text("topic"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var explanations = pgTable("explanations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
  definition: text("definition"),
  explanation: text("explanation").notNull(),
  codeExample: text("code_example"),
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true
});
var insertExplanationSchema = createInsertSchema(explanations).omit({
  id: true,
  createdAt: true
});
var TOPIC_CATEGORIES = [
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
  "General"
];

// server/ai-service.ts
var ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
async function generateExplanation(question) {
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
              enum: TOPIC_CATEGORIES
            }
          },
          required: ["explanation", "topic"]
        }
      },
      contents: [
        {
          role: "user",
          parts: [{ text: question }]
        }
      ]
    });
    const rawJson = response.text;
    console.log("Gemini API response text:", rawJson);
    if (!rawJson) {
      console.error("Full response object:", JSON.stringify(response.response, null, 2));
      throw new Error("Empty response from AI model");
    }
    let data;
    try {
      data = JSON.parse(rawJson);
      if (!data.explanation || !data.topic) {
        throw new Error("Missing required fields in AI response");
      }
      if (!TOPIC_CATEGORIES.includes(data.topic)) {
        data.topic = "General";
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", rawJson);
      throw new Error("Invalid response format from AI model");
    }
    return data;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error(`Failed to generate explanation: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/conversations", async (req, res) => {
    try {
      const conversations2 = await storage.getAllConversations();
      res.json(conversations2);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });
  app2.get("/api/conversations/:id", async (req, res) => {
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
  app2.post("/api/conversations", async (req, res) => {
    try {
      const validationResult = z.object({
        question: z.string().min(1, "Question cannot be empty")
      }).safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid request",
          details: validationResult.error.errors
        });
      }
      const { question } = validationResult.data;
      const aiResponse = await generateExplanation(question);
      const conversation = await storage.createConversation({
        question,
        topic: aiResponse.topic
      });
      const explanation = await storage.createExplanation({
        conversationId: conversation.id,
        definition: aiResponse.definition || null,
        explanation: aiResponse.explanation,
        codeExample: aiResponse.codeExample || null,
        summary: aiResponse.summary || null
      });
      res.json({
        ...conversation,
        explanation
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to create conversation"
      });
    }
  });
  app2.delete("/api/conversations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteConversation(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`serving on http://127.0.0.1:${port}`);
  });
})();
