import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
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
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
