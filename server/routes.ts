import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    isAuthenticated?: boolean;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth middleware
  function requireAuth(req: any, res: any, next: any) {
    if (req.session?.isAuthenticated) {
      next();
    } else {
      res.status(401).json({ message: "Authentication required" });
    }
  }

  // Initialize admin user if not exists
  async function initializeAdmin() {
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("123@Admin", 10);
      await storage.createUser({
        username: "admin",
        password: hashedPassword
      });
    }
  }

  await initializeAdmin();

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.isAuthenticated = true;

      res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.session?.isAuthenticated) {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Registration routes
  app.post("/api/registrations", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/registrations", requireAuth, async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let registrations;
      if (search) {
        registrations = await storage.searchRegistrations(search as string);
      } else if (category && (category === 'junior' || category === 'senior')) {
        registrations = await storage.getRegistrationsByCategory(category);
      } else {
        registrations = await storage.getRegistrations();
      }
      
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/registrations/:id", requireAuth, async (req, res) => {
    try {
      const registration = await storage.getRegistration(req.params.id);
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }
      res.json(registration);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/registrations/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.partial().parse(req.body);
      const registration = await storage.updateRegistration(req.params.id, validatedData);
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }
      res.json(registration);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.delete("/api/registrations/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteRegistration(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Registration not found" });
      }
      res.json({ message: "Registration deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Statistics route
  app.get("/api/statistics", requireAuth, async (req, res) => {
    try {
      const allRegistrations = await storage.getRegistrations();
      const juniorRegistrations = allRegistrations.filter(r => r.category === 'junior');
      const seniorRegistrations = allRegistrations.filter(r => r.category === 'senior');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayRegistrations = allRegistrations.filter(r => {
        const regDate = new Date(r.createdAt);
        regDate.setHours(0, 0, 0, 0);
        return regDate.getTime() === today.getTime();
      });

      res.json({
        total: allRegistrations.length,
        junior: juniorRegistrations.length,
        senior: seniorRegistrations.length,
        today: todayRegistrations.length
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
