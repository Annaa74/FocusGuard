import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const focusSessions = pgTable("focus_sessions", {
  id: serial("id").primaryKey(),
  goal: text("goal").notNull(),
  isActive: boolean("is_active").default(true),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
});

export const focusLogs = pgTable("focus_logs", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id"),
  scrapedContent: text("scraped_content"),
  analysisResult: jsonb("analysis_result"),
  isOnTrack: boolean("is_on_track"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFocusSessionSchema = createInsertSchema(focusSessions).omit({ id: true, startTime: true, endTime: true });
export const insertFocusLogSchema = createInsertSchema(focusLogs).omit({ id: true, createdAt: true });

export type FocusSession = typeof focusSessions.$inferSelect;
export type InsertFocusSession = z.infer<typeof insertFocusSessionSchema>;
export type FocusLog = typeof focusLogs.$inferSelect;
export type InsertFocusLog = z.infer<typeof insertFocusLogSchema>;

// API Types
export const analyzeFocusSchema = z.object({
  goal: z.string(),
  content: z.string(),
});
export type AnalyzeFocusRequest = z.infer<typeof analyzeFocusSchema>;

export type AnalyzeFocusResponse = {
  isOnTrack: boolean;
  relevanceScore: number;
  reason: string;
};
