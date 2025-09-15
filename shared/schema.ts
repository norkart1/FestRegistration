import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("team_leader"), // 'admin' or 'team_leader'
});

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const registrations = pgTable("registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  place: text("place").notNull(),
  teamName: text("team_name").notNull(),
  category: varchar("category", { length: 10 }).notNull(), // 'junior' or 'senior'
  programs: text("programs").array().notNull(), // Array of selected programs
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const programs = pgTable("programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  programId: text("program_id").notNull().unique(), // e.g., "junior-qiraat"
  name: text("name").notNull(), // Display name in Malayalam
  category: varchar("category", { length: 10 }).notNull(), // 'junior' or 'senior'
  type: varchar("type", { length: 20 }).notNull(), // 'stage' or 'non-stage'
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
}).extend({
  role: z.enum(["admin", "team_leader"]).default("team_leader"),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Team name is required"),
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  teamName: z.string().min(1, "Team name is required"),
  category: z.enum(["junior", "senior"]),
  programs: z.array(z.string()).min(1, "At least one program must be selected"),
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  programId: z.string().min(1, "Program ID is required"),
  name: z.string().min(1, "Program name is required"),
  category: z.enum(["junior", "senior"]),
  type: z.enum(["stage", "non-stage"]),
  displayOrder: z.number().min(0).default(0),
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;

export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type Program = typeof programs.$inferSelect;

// Statistics interface for API responses
export interface Statistics {
  total: number;
  junior: number;
  senior: number;
  today: number;
}
