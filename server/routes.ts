import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.focus.analyze.path, async (req, res) => {
    try {
      const { goal, content } = api.focus.analyze.input.parse(req.body);

      const prompt = `
        You are a Focus Guard AI.
        User Goal: "${goal}"
        Webpage Content: "${content.slice(0, 1000)}" (truncated)

        Analyze if the webpage content is semantically related to the user's goal.
        Return ONLY a JSON object with this format:
        {
          "is_on_track": boolean,
          "relevance_score": number (0-100),
          "reason": "short explanation"
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");

      const responseData = {
        isOnTrack: result.is_on_track,
        relevanceScore: result.relevance_score,
        reason: result.reason,
      };

      // Log it (optional, but good for history)
      // await storage.logAnalysis({ ... });

      res.json(responseData);

    } catch (error) {
      console.error("Analysis failed:", error);
      res.status(500).json({ message: "Failed to analyze focus" });
    }
  });

  return httpServer;
}
