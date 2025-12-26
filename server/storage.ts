import { db } from "./db";
import {
  focusSessions,
  focusLogs,
  type InsertFocusSession,
  type InsertFocusLog,
  type FocusSession,
  type FocusLog
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createSession(session: InsertFocusSession): Promise<FocusSession>;
  logAnalysis(log: InsertFocusLog): Promise<FocusLog>;
}

export class DatabaseStorage implements IStorage {
  async createSession(session: InsertFocusSession): Promise<FocusSession> {
    const [newSession] = await db.insert(focusSessions).values(session).returning();
    return newSession;
  }

  async logAnalysis(log: InsertFocusLog): Promise<FocusLog> {
    const [newLog] = await db.insert(focusLogs).values(log).returning();
    return newLog;
  }
}

export const storage = new DatabaseStorage();
