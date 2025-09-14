import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema, insertProgramSchema } from "@shared/schema";
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

  // Initialize programs table with current Malayalam programs
  async function initializePrograms() {
    const existingPrograms = await storage.getPrograms();
    if (existingPrograms.length > 0) {
      return; // Programs already initialized
    }

    const programsToCreate = [
      // Junior Stage Programs
      { programId: "junior-qiraat", name: "ഖിറാഅത്ത്", category: "junior" as const, type: "stage" as const, displayOrder: 1 },
      { programId: "junior-bank", name: "ബാങ്ക്", category: "junior" as const, type: "stage" as const, displayOrder: 2 },
      { programId: "junior-speech-arabic", name: "പ്രസംഗം അറബി", category: "junior" as const, type: "stage" as const, displayOrder: 3 },
      { programId: "junior-speech-english", name: "പ്രസംഗം ഇംഗ്ലീഷ്", category: "junior" as const, type: "stage" as const, displayOrder: 4 },
      { programId: "junior-speech-malayalam", name: "പ്രസംഗം മലയാളം", category: "junior" as const, type: "stage" as const, displayOrder: 5 },
      { programId: "junior-speech-urdu", name: "പ്രസംഗം ഉറുദു", category: "junior" as const, type: "stage" as const, displayOrder: 6 },
      { programId: "junior-song-arabic", name: "ഗാനം അറബി", category: "junior" as const, type: "stage" as const, displayOrder: 7 },
      
      // Junior Non-Stage Programs
      { programId: "junior-drawing", name: "ചിത്രരചന", category: "junior" as const, type: "non-stage" as const, displayOrder: 8 },
      { programId: "junior-sudoku", name: "സുഡോക്കും", category: "junior" as const, type: "non-stage" as const, displayOrder: 9 },
      { programId: "junior-memory-test", name: "മെമ്മറി ടെസ്റ്റ്", category: "junior" as const, type: "non-stage" as const, displayOrder: 10 },
      { programId: "junior-dictation", name: "കേട്ടെഴുത്ത്", category: "junior" as const, type: "non-stage" as const, displayOrder: 11 },
      
      // Senior Stage Programs
      { programId: "senior-qiraat", name: "ഖിറാഅത്ത്", category: "senior" as const, type: "stage" as const, displayOrder: 1 },
      { programId: "senior-bank", name: "ബാങ്ക്", category: "senior" as const, type: "stage" as const, displayOrder: 2 },
      { programId: "senior-class-presentation", name: "ക്ലാസ് അവതരണം", category: "senior" as const, type: "stage" as const, displayOrder: 3 },
      { programId: "senior-speech-arabic", name: "പ്രസംഗം അറബി", category: "senior" as const, type: "stage" as const, displayOrder: 4 },
      { programId: "senior-speech-english", name: "പ്രസംഗം ഇംഗ്ലീഷ്", category: "senior" as const, type: "stage" as const, displayOrder: 5 },
      { programId: "senior-speech-malayalam", name: "പ്രസംഗം മലയാളം", category: "senior" as const, type: "stage" as const, displayOrder: 6 },
      
      // Senior Non-Stage Programs
      { programId: "senior-arabic-calligraphy", name: "അറബിക് ആലിഗ്രാഫി", category: "senior" as const, type: "non-stage" as const, displayOrder: 7 },
      { programId: "senior-poster-making", name: "പോസ്റ്റർ മേക്കിങ്", category: "senior" as const, type: "non-stage" as const, displayOrder: 8 },
      { programId: "senior-arabic-essay", name: "അറബി പ്രബന്ധം", category: "senior" as const, type: "non-stage" as const, displayOrder: 9 },
      { programId: "senior-malayalam-essay", name: "മലയാളം പ്രബന്ധം", category: "senior" as const, type: "non-stage" as const, displayOrder: 10 },
      { programId: "senior-english-essay", name: "ഇംഗ്ലീഷ് പ്രബന്ധം", category: "senior" as const, type: "non-stage" as const, displayOrder: 11 }
    ];

    try {
      for (const program of programsToCreate) {
        await storage.createProgram(program);
      }
      console.log(`✓ Initialized ${programsToCreate.length} programs in the database`);
    } catch (error) {
      console.error("Error initializing programs:", error);
    }
  }

  await initializeAdmin();
  await initializePrograms();

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

  // Program management routes (admin only)
  app.get("/api/programs", async (req, res) => {
    try {
      const { category } = req.query;
      
      let programs;
      if (category && (category === 'junior' || category === 'senior')) {
        programs = await storage.getProgramsByCategory(category);
      } else {
        programs = await storage.getActivePrograms();
      }
      
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/programs", requireAuth, async (req, res) => {
    try {
      const programs = await storage.getPrograms();
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/programs", requireAuth, async (req, res) => {
    try {
      const validatedData = insertProgramSchema.parse(req.body);
      
      // Check if program ID already exists
      const existingProgram = await storage.getProgramByProgramId(validatedData.programId);
      if (existingProgram) {
        return res.status(400).json({ message: "Program ID already exists" });
      }
      
      const program = await storage.createProgram(validatedData);
      res.status(201).json(program);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/admin/programs/:id", requireAuth, async (req, res) => {
    try {
      const program = await storage.getProgram(req.params.id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/programs/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertProgramSchema.partial().parse(req.body);
      
      // If programId is being updated, check if it already exists
      if (validatedData.programId) {
        const existingProgram = await storage.getProgramByProgramId(validatedData.programId);
        if (existingProgram && existingProgram.id !== req.params.id) {
          return res.status(400).json({ message: "Program ID already exists" });
        }
      }
      
      const program = await storage.updateProgram(req.params.id, validatedData);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.delete("/api/admin/programs/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteProgram(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json({ message: "Program deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
