import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const registrations = pgTable("registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  aadharNumber: varchar("aadhar_number", { length: 12 }).notNull(),
  place: text("place").notNull(),
  phoneNumber: varchar("phone_number", { length: 10 }).notNull(),
  darsName: text("dars_name").notNull(),
  darsPlace: text("dars_place").notNull(),
  usthaadName: text("usthaad_name").notNull(),
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
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  aadharNumber: z.string().length(12, "Aadhar number must be 12 digits"),
  phoneNumber: z.string().length(10, "Phone number must be 10 digits"),
  category: z.enum(["junior", "senior"]),
  programs: z.array(z.string()).min(1, "At least one program must be selected"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Statistics interface for API responses
export interface Statistics {
  total: number;
  junior: number;
  senior: number;
  today: number;
}
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

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;

export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type Program = typeof programs.$inferSelect;
