import { registrations, users, programs, type User, type InsertUser, type Registration, type InsertRegistration, type Program, type InsertProgram } from "@shared/schema";
import { db } from "./db";
import { eq, desc, ilike, or, asc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Registration methods
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  getRegistration(id: string): Promise<Registration | undefined>;
  updateRegistration(id: string, registration: Partial<InsertRegistration>): Promise<Registration | undefined>;
  deleteRegistration(id: string): Promise<boolean>;
  getRegistrationsByCategory(category: 'junior' | 'senior'): Promise<Registration[]>;
  searchRegistrations(query: string): Promise<Registration[]>;
  
  // Program methods
  createProgram(program: InsertProgram): Promise<Program>;
  getPrograms(): Promise<Program[]>;
  getProgram(id: string): Promise<Program | undefined>;
  getProgramByProgramId(programId: string): Promise<Program | undefined>;
  updateProgram(id: string, program: Partial<InsertProgram>): Promise<Program | undefined>;
  deleteProgram(id: string): Promise<boolean>;
  getProgramsByCategory(category: 'junior' | 'senior'): Promise<Program[]>;
  getActivePrograms(): Promise<Program[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const [newRegistration] = await db
      .insert(registrations)
      .values({
        ...registration,
        updatedAt: new Date(),
      })
      .returning();
    return newRegistration;
  }

  async getRegistrations(): Promise<Registration[]> {
    return db.select().from(registrations).orderBy(desc(registrations.createdAt));
  }

  async getRegistration(id: string): Promise<Registration | undefined> {
    const [registration] = await db.select().from(registrations).where(eq(registrations.id, id));
    return registration || undefined;
  }

  async updateRegistration(id: string, registration: Partial<InsertRegistration>): Promise<Registration | undefined> {
    const [updated] = await db
      .update(registrations)
      .set({
        ...registration,
        updatedAt: new Date(),
      })
      .where(eq(registrations.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteRegistration(id: string): Promise<boolean> {
    const result = await db.delete(registrations).where(eq(registrations.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getRegistrationsByCategory(category: 'junior' | 'senior'): Promise<Registration[]> {
    return db.select().from(registrations)
      .where(eq(registrations.category, category))
      .orderBy(desc(registrations.createdAt));
  }

  async searchRegistrations(query: string): Promise<Registration[]> {
    return db.select().from(registrations)
      .where(
        or(
          ilike(registrations.fullName, `%${query}%`),
          ilike(registrations.teamName, `%${query}%`),
          ilike(registrations.place, `%${query}%`)
        )
      )
      .orderBy(desc(registrations.createdAt));
  }

  async createProgram(program: InsertProgram): Promise<Program> {
    const [newProgram] = await db
      .insert(programs)
      .values({
        ...program,
        updatedAt: new Date(),
      })
      .returning();
    return newProgram;
  }

  async getPrograms(): Promise<Program[]> {
    return db.select().from(programs).orderBy(asc(programs.category), asc(programs.displayOrder), asc(programs.name));
  }

  async getProgram(id: string): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program || undefined;
  }

  async getProgramByProgramId(programId: string): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.programId, programId));
    return program || undefined;
  }

  async updateProgram(id: string, program: Partial<InsertProgram>): Promise<Program | undefined> {
    const [updated] = await db
      .update(programs)
      .set({
        ...program,
        updatedAt: new Date(),
      })
      .where(eq(programs.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProgram(id: string): Promise<boolean> {
    const result = await db.delete(programs).where(eq(programs.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getProgramsByCategory(category: 'junior' | 'senior'): Promise<Program[]> {
    return db.select().from(programs)
      .where(eq(programs.category, category))
      .orderBy(asc(programs.displayOrder), asc(programs.name));
  }

  async getActivePrograms(): Promise<Program[]> {
    return db.select().from(programs)
      .where(eq(programs.isActive, true))
      .orderBy(asc(programs.category), asc(programs.displayOrder), asc(programs.name));
  }
}

export const storage = new DatabaseStorage();
