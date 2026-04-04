import 'dotenv/config';
import express from "express";
import path from "path";
import fs from "fs/promises";
import cors from "cors";
import * as jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { sign, verify } = (jwt as any).default || jwt;

console.log("Server script starting...");
console.log("Debug Paths:", {
  cwd: process.cwd(),
  __dirname,
  __filename,
  env: {
    VERCEL: process.env.VERCEL,
    NODE_ENV: process.env.NODE_ENV
  }
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Supabase Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

/**
 * FINAL AND CORRECT SQL SCRIPT FOR SUPABASE (Run this in the SQL Editor):
 * 
 * -- 1. Create app_content table
 * CREATE TABLE IF NOT EXISTS app_content (
 *   section_key TEXT PRIMARY KEY,
 *   marathi JSONB NOT NULL,
 *   english JSONB NOT NULL,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * -- 2. Create stats table
 * CREATE TABLE IF NOT EXISTS stats (
 *   id INTEGER PRIMARY KEY DEFAULT 1,
 *   share_capital TEXT,
 *   total_deposits TEXT,
 *   total_loans TEXT,
 *   total_members TEXT,
 *   composite_business TEXT,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 *   CONSTRAINT single_row CHECK (id = 1)
 * );
 * 
 * -- 3. Create loans table
 * CREATE TABLE IF NOT EXISTS loans (
 *   id TEXT PRIMARY KEY,
 *   name_marathi TEXT,
 *   name_english TEXT,
 *   rate TEXT,
 *   description_marathi TEXT,
 *   description_english TEXT,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * -- 4. Create deposits table
 * CREATE TABLE IF NOT EXISTS deposits (
 *   id TEXT PRIMARY KEY,
 *   name_marathi TEXT,
 *   name_english TEXT,
 *   general TEXT,
 *   senior TEXT,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * -- 5. Create recurring_deposits table
 * CREATE TABLE IF NOT EXISTS recurring_deposits (
 *   id TEXT PRIMARY KEY,
 *   period_marathi TEXT,
 *   period_english TEXT,
 *   rate TEXT,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * -- 6. Create enquiries table
 * CREATE TABLE IF NOT EXISTS enquiries (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   name TEXT NOT NULL,
 *   email TEXT,
 *   phone TEXT NOT NULL,
 *   subject TEXT,
 *   message TEXT NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * -- 7. Create rd_maturity table
 * CREATE TABLE IF NOT EXISTS rd_maturity (
 *   id TEXT PRIMARY KEY,
 *   amount INTEGER NOT NULL,
 *   year1 INTEGER NOT NULL,
 *   year2 INTEGER NOT NULL,
 *   year3 INTEGER NOT NULL,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * -- Enable RLS (Optional but recommended)
 * -- ALTER TABLE rd_maturity ENABLE ROW LEVEL SECURITY;
 * -- CREATE POLICY "Public read access" ON rd_maturity FOR SELECT USING (true);
 */

console.log("Supabase URL:", SUPABASE_URL ? "Set" : "Not Set");
console.log("Supabase Service Role Key:", SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Not Set");
console.log("Supabase Anon Key:", SUPABASE_ANON_KEY ? "Set" : "Not Set");

let supabase: any = null;

const getSupabase = () => {
  try {
    if (!supabase) {
      const keyToUse = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
      if (!SUPABASE_URL || !keyToUse) {
        console.warn("Supabase configuration missing. SUPABASE_URL and (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY) must be set.");
        return null;
      }
      console.log("Initializing Supabase client with URL:", SUPABASE_URL);
      supabase = createClient(SUPABASE_URL, keyToUse);
    }
    return supabase;
  } catch (err) {
    console.error("Error initializing Supabase client:", err);
    return null;
  }
};

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  const dataExists = await fs.access(path.join(process.cwd(), "data")).then(() => true).catch(() => false);
  const contentExists = await fs.access(path.join(process.cwd(), "data", "content.json")).then(() => true).catch(() => false);
  
  let supabaseStatus = "Not Configured";
  let supabaseError = null;
  
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const client = getSupabase();
      if (client) {
        const { error } = await client.from("app_content").select("count", { count: 'exact', head: true });
        if (error) {
          supabaseStatus = "Error: " + error.message;
          supabaseError = error;
        } else {
          supabaseStatus = "Connected";
        }
      } else {
        supabaseStatus = "Client Initialization Failed";
      }
    } catch (e: any) {
      supabaseStatus = "Exception: " + e.message;
      supabaseError = e;
    }
  }

  res.json({ 
    status: "ok", 
    supabase: supabaseStatus,
    supabaseConfig: {
      url: SUPABASE_URL ? "Set" : "Not Set",
      key: SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Not Set"
    },
    env: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    dataDir: dataExists,
    contentJson: contentExists,
    cwd: process.cwd(),
    error: supabaseError
  });
});

app.get("/api/debug", async (req, res) => {
  try {
    const rootDir = process.cwd();
    const apiDir = path.join(rootDir, "api");
    const dataDir = path.join(rootDir, "data");
    
    const debugInfo: any = {
      cwd: rootDir,
      dirname: __dirname,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        LAMBDA_TASK_ROOT: process.env.LAMBDA_TASK_ROOT
      },
      files: {}
    };

    try {
      debugInfo.files.root = await fs.readdir(rootDir);
    } catch (e: any) { debugInfo.files.root = e.message; }

    try {
      debugInfo.files.data = await fs.readdir(dataDir);
    } catch (e: any) { debugInfo.files.data = e.message; }

    res.json(debugInfo);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/supabase-status", async (req, res) => {
  try {
    const client = getSupabase();
    const { data, error } = await client.from("app_content").select("section_key").limit(1);
    if (error) throw error;
    res.json({ connected: true, message: "Successfully connected to Supabase" });
  } catch (error: any) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Helper to read local JSON data
const readLocalJson = async (filename: string) => {
  const possiblePaths = [
    path.join(process.cwd(), "data", filename),
    path.join(process.cwd(), "api", "..", "data", filename),
    path.join(__dirname, "data", filename),
    path.join(__dirname, "..", "data", filename),
    path.resolve(process.cwd(), "data", filename)
  ];

  if (process.env.LAMBDA_TASK_ROOT) {
    possiblePaths.push(path.join(process.env.LAMBDA_TASK_ROOT, "data", filename));
  }

  for (const filePath of possiblePaths) {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const json = JSON.parse(data);
      console.log(`Successfully read local JSON ${filename} from: ${filePath}`);
      return json;
    } catch (error: any) {
      console.log(`Failed to read ${filename} from ${filePath}: ${error.message}`);
    }
  }
  
  console.error(`Failed to read local JSON ${filename} from all possible paths.`);
  console.log("Current Directory (process.cwd()):", process.cwd());
  console.log("Directory Name (__dirname):", __dirname);
  try {
    const rootFiles = await fs.readdir(process.cwd());
    console.log("Files in process.cwd():", rootFiles.join(", "));
  } catch (e) {}
  
  return null;
};

// Helper to read/write data from Supabase
const getTableData = async (tableName: string) => {
  try {
    const client = getSupabase();
    if (!client) {
      console.log(`Supabase client not available for ${tableName}, skipping fetch.`);
      return null;
    }
    let query = client.from(tableName).select("*");
    
    if (tableName === "app_content") {
      query = query.order("section_key", { ascending: true });
    } else {
      query = query.order("id", { ascending: true });
    }

    const { data, error } = await query;
    
    if (error) {
      console.error(`Supabase fetch error for ${tableName}:`, error.message, error.details, error.hint);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.log(`Supabase table ${tableName} is empty.`);
    } else {
      console.log(`Successfully fetched ${data.length} rows from Supabase table ${tableName}.`);
    }
    
    return data;
  } catch (e) {
    console.error(`Error fetching ${tableName} from Supabase:`, e);
    return null;
  }
};

const getSingleRow = async (tableName: string, key?: string) => {
  try {
    const client = getSupabase();
    let query = client.from(tableName).select("*");
    if (key) {
      query = query.eq("section_key", key);
    }
    const { data, error } = await query.maybeSingle();
    
    if (error) {
      console.warn(`Supabase fetch error for ${tableName}:`, error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.error(`Error fetching ${tableName} from Supabase:`, e);
    return null;
  }
};

// API Routes
app.post("/api/login", async (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Invalid password" });
});

// Enquiries Endpoints
app.post("/api/enquiries", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: "Name, phone, and message are required" });
    }

    const client = getSupabase();
    const { error } = await client.from("enquiries").insert([{
      name,
      email,
      phone,
      subject: subject || "General Enquiry",
      message
    }]);

    if (error) throw error;
    res.json({ success: true, message: "Enquiry sent successfully" });
  } catch (error: any) {
    console.error("Failed to save enquiry:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/enquiries", authenticate, async (req, res) => {
  try {
    const client = getSupabase();
    const { data, error } = await client.from("enquiries").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (error: any) {
    console.error("Failed to fetch enquiries:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/enquiries/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const client = getSupabase();
    const { error } = await client.from("enquiries").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete enquiry:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Migration Endpoint
app.post("/api/migrate", authenticate, async (req, res) => {
  try {
    console.log("Starting migration process...");
    const client = getSupabase();
    const results: any = {};
    
    // 1. Migrate Loans
    console.log("Migrating loans...");
    const loansData = await readLocalJson("loans.json");
    if (!loansData) throw new Error("Failed to read loans.json");
    for (const loan of loansData) {
      const { error } = await client.from("loans").upsert({
        id: loan.id,
        name_marathi: loan.name.marathi,
        name_english: loan.name.english,
        rate: loan.rate,
        description_marathi: loan.description.marathi,
        description_english: loan.description.english
      });
      if (error) {
        console.error(`Loans migration failed for ID ${loan.id}:`, error.message);
        throw new Error(`Loans migration failed for ID ${loan.id}: ${error.message}`);
      }
    }
    results.loans = loansData.length;

    // 2. Migrate Deposits
    console.log("Migrating deposits...");
    const depositsData = await readLocalJson("deposits.json");
    if (!depositsData) throw new Error("Failed to read deposits.json");
    for (const dep of depositsData) {
      const { error } = await client.from("deposits").upsert({
        id: dep.id,
        name_marathi: dep.name.marathi,
        name_english: dep.name.english,
        general: dep.general,
        senior: dep.senior
      });
      if (error) {
        console.error(`Deposits migration failed for ID ${dep.id}:`, error.message);
        throw new Error(`Deposits migration failed for ID ${dep.id}: ${error.message}`);
      }
    }
    results.deposits = depositsData.length;

    // 3. Migrate Recurring Deposits
    console.log("Migrating recurring deposits...");
    const rdData = await readLocalJson("recurring_deposits.json");
    if (!rdData) throw new Error("Failed to read recurring_deposits.json");
    for (const rd of rdData) {
      const { error } = await client.from("recurring_deposits").upsert({
        id: rd.id,
        period_marathi: rd.period.marathi,
        period_english: rd.period.english,
        rate: rd.rate
      });
      if (error) {
        console.error(`Recurring deposits migration failed for ID ${rd.id}:`, error.message);
        throw new Error(`Recurring deposits migration failed for ID ${rd.id}: ${error.message}`);
      }
    }
    results.recurring_deposits = rdData.length;

    // 4. Migrate Stats
    console.log("Migrating stats...");
    const statsData = await readLocalJson("stats.json");
    if (!statsData) throw new Error("Failed to read stats.json");
    const { error: statsError } = await client.from("stats").upsert({
      id: 1,
      share_capital: statsData.shareCapital,
      total_deposits: statsData.totalDeposits,
      total_loans: statsData.totalLoans,
      total_members: statsData.totalMembers,
      composite_business: statsData.compositeBusiness
    });
    if (statsError) {
      console.error("Stats migration failed:", statsError.message);
      throw new Error(`Stats migration failed: ${statsError.message}`);
    }
    results.stats = 1;

    // 5. Migrate Content
    console.log("Migrating content...");
    const contentData = await readLocalJson("content.json");
    if (!contentData) throw new Error("Failed to read content.json");
    const sections = Object.keys(contentData.marathi);
    for (const section of sections) {
      const { error } = await client.from("app_content").upsert({
        section_key: section,
        marathi: contentData.marathi[section],
        english: contentData.english[section]
      });
      if (error) {
        console.error(`Content migration failed for section ${section}:`, error.message);
        throw new Error(`Content migration failed for section ${section}: ${error.message}`);
      }
    }
    results.content = sections.length;
    // 6. Migrate RD Maturity
    console.log("Migrating RD maturity...");
    const rdMaturityData = await readLocalJson("rd_maturity.json");
    if (rdMaturityData) {
      for (const rd of rdMaturityData) {
        const { error } = await client.from("rd_maturity").upsert({
          id: String(rd.id),
          amount: rd.amount,
          year1: rd.year1,
          year2: rd.year2,
          year3: rd.year3
        });
        if (error) {
          console.error(`RD maturity migration failed for ID ${rd.id}:`, error.message);
          throw new Error(`RD maturity migration failed for ID ${rd.id}: ${error.message}`);
        }
      }
      results.rd_maturity = rdMaturityData.length;
    }

    console.log("Migration completed successfully:", results);
    res.json({ success: true, message: "Migration completed successfully", results });
  } catch (error: any) {
    console.error("Migration failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/content", async (req, res) => {
  try {
    const localContent = await readLocalJson("content.json") || { marathi: {}, english: {} };
    const dbData = await getTableData("app_content");
    
    if (!dbData || dbData.length === 0) {
      return res.json(localContent);
    }

    const mergedContent: any = { 
      marathi: JSON.parse(JSON.stringify(localContent.marathi)), 
      english: JSON.parse(JSON.stringify(localContent.english)) 
    };

    dbData.forEach((row: any) => {
      const section = row.section_key;
      
      // Deep merge Marathi
      if (row.marathi) {
        mergedContent.marathi[section] = { 
          ...(mergedContent.marathi[section] || {}), 
          ...row.marathi 
        };
      }
      
      // Deep merge English
      if (row.english) {
        mergedContent.english[section] = { 
          ...(mergedContent.english[section] || {}), 
          ...row.english 
        };
      }
    });

    console.log("Content successfully merged. Stats Marathi:", mergedContent.marathi.stats);
    res.json(mergedContent);
  } catch (error: any) {
    console.error("Error in /api/content:", error);
    const localData = await readLocalJson("content.json");
    res.json(localData || { marathi: {}, english: {} });
  }
});

app.post("/api/content", authenticate, async (req, res) => {
  try {
    const client = getSupabase();
    const content = req.body;
    const sections = Object.keys(content.marathi);
    for (const section of sections) {
      const { error } = await client.from("app_content").upsert({
        section_key: section,
        marathi: content.marathi[section],
        english: content.english[section]
      });
      if (error) {
        console.error(`Error saving section ${section}:`, error.message);
        return res.status(500).json({ error: `Failed to save section ${section}: ${error.message}` });
      }
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Content save failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const localData = await readLocalJson("stats.json") || {
      shareCapital: "₹31,46,00,000",
      totalDeposits: "₹21,65,00,000",
      totalLoans: "₹17,68,00,000",
      totalMembers: "1800+",
      compositeBusiness: "₹39,33,00,000"
    };
    
    const dbData = await getSingleRow("stats");
    
    if (!dbData) {
      console.log("Supabase stats empty or missing, returning local JSON defaults");
      return res.json(localData);
    }
    
    // Merge DB data with local defaults (DB takes priority if column exists and has value)
    res.json({
      shareCapital: dbData.share_capital || localData.shareCapital,
      totalDeposits: dbData.total_deposits || localData.totalDeposits,
      totalLoans: dbData.total_loans || localData.totalLoans,
      totalMembers: dbData.total_members || localData.totalMembers,
      compositeBusiness: dbData.composite_business || localData.compositeBusiness
    });
  } catch (error: any) {
    console.error("Error in /api/stats:", error);
    const localData = await readLocalJson("stats.json");
    res.json(localData || {});
  }
});

app.post("/api/stats", authenticate, async (req, res) => {
  try {
    const client = getSupabase();
    const { shareCapital, totalDeposits, totalLoans, totalMembers, compositeBusiness } = req.body;
    const { error } = await client.from("stats").upsert({
      id: 1,
      share_capital: shareCapital,
      total_deposits: totalDeposits,
      total_loans: totalLoans,
      total_members: totalMembers,
      composite_business: compositeBusiness
    });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/deposits", async (req, res) => {
  try {
    const data = await getTableData("deposits");
    if (!data || data.length === 0) {
      const localData = await readLocalJson("deposits.json");
      return res.json(localData || []);
    }
    const formatted = data.map((d: any) => ({
      id: d.id,
      name: { marathi: d.name_marathi, english: d.name_english },
      general: d.general,
      senior: d.senior
    }));
    res.json(formatted);
  } catch (error: any) {
    const localData = await readLocalJson("deposits.json");
    res.json(localData || []);
  }
});

app.post("/api/deposits", authenticate, async (req, res) => {
  try {
    const client = getSupabase();
    const data = req.body;
    
    // Handle deletions: Remove items not in the current list
    // Ensure all IDs are strings for consistent comparison with Supabase TEXT column
    const incomingIds = data.map((d: any) => String(d.id)).filter((id: string) => id !== "undefined" && id !== "");
    
    console.log(`Saving deposits. Incoming IDs: ${incomingIds.join(', ')}`);
    
    if (incomingIds.length > 0) {
      const { error: deleteError } = await client.from("deposits").delete().not("id", "in", incomingIds);
      if (deleteError) {
        console.error("Error deleting removed deposits:", deleteError.message);
        // We continue anyway to try and upsert the rest
      }
    } else {
      // If no IDs, delete all
      const { error: deleteError } = await client.from("deposits").delete().neq("id", "_none_");
      if (deleteError) console.error("Error deleting all deposits:", deleteError.message);
    }

    for (const d of data) {
      const { error } = await client.from("deposits").upsert({
        id: String(d.id),
        name_marathi: d.name.marathi,
        name_english: d.name.english,
        general: d.general,
        senior: d.senior
      });
      if (error) {
        console.error(`Error saving deposit ${d.id}:`, error.message);
        return res.status(500).json({ error: `Failed to save deposit ${d.id}: ${error.message}` });
      }
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Deposits save failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/recurring-deposits", async (req, res) => {
  try {
    const data = await getTableData("recurring_deposits");
    if (!data || data.length === 0) {
      const localData = await readLocalJson("recurring_deposits.json");
      return res.json(localData || []);
    }
    const formatted = data.map((d: any) => ({
      id: d.id,
      period: { marathi: d.period_marathi, english: d.period_english },
      rate: d.rate
    }));
    res.json(formatted);
  } catch (error: any) {
    const localData = await readLocalJson("recurring_deposits.json");
    res.json(localData || []);
  }
});

app.post("/api/recurring-deposits", authenticate, async (req, res) => {
  try {
    const client = getSupabase();
    const data = req.body;

    // Handle deletions: Remove items not in the current list
    const incomingIds = data.map((d: any) => String(d.id)).filter((id: string) => id !== "undefined" && id !== "");
    
    console.log(`Saving recurring deposits. Incoming IDs: ${incomingIds.join(', ')}`);

    if (incomingIds.length > 0) {
      const { error: deleteError } = await client.from("recurring_deposits").delete().not("id", "in", incomingIds);
      if (deleteError) console.error("Error deleting removed recurring deposits:", deleteError.message);
    } else {
      const { error: deleteError } = await client.from("recurring_deposits").delete().neq("id", "_none_");
      if (deleteError) console.error("Error deleting all recurring deposits:", deleteError.message);
    }

    for (const d of data) {
      const { error } = await client.from("recurring_deposits").upsert({
        id: String(d.id),
        period_marathi: d.period.marathi,
        period_english: d.period.english,
        rate: d.rate
      });
      if (error) {
        console.error(`Error saving recurring deposit ${d.id}:`, error.message);
        return res.status(500).json({ error: `Failed to save recurring deposit ${d.id}: ${error.message}` });
      }
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Recurring deposits save failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/rd-maturity", async (req, res) => {
  try {
    const data = await getTableData("rd_maturity");
    if (!data || data.length === 0) {
      const localData = await readLocalJson("rd_maturity.json");
      return res.json(localData || []);
    }
    // Return ordered by amount
    res.json(data.sort((a: any, b: any) => Number(a.amount) - Number(b.amount)));
  } catch (error: any) {
    const localData = await readLocalJson("rd_maturity.json");
    res.json(localData || []);
  }
});

app.post("/api/rd-maturity", authenticate, async (req, res) => {
  try {
    const client = getSupabase();
    const data = req.body;

    const incomingIds = data.map((d: any) => String(d.id)).filter((id: string) => id !== "undefined" && id !== "");
    
    if (incomingIds.length > 0) {
      await client.from("rd_maturity").delete().not("id", "in", incomingIds);
    } else {
      await client.from("rd_maturity").delete().neq("id", "_none_");
    }

    for (const d of data) {
      const { error } = await client.from("rd_maturity").upsert({
        id: String(d.id),
        amount: Number(d.amount),
        year1: Number(d.year1),
        year2: Number(d.year2),
        year3: Number(d.year3)
      });
      if (error) throw error;
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/loans", async (req, res) => {
  try {
    const data = await getTableData("loans");
    if (!data || data.length === 0) {
      const localData = await readLocalJson("loans.json");
      return res.json(localData || []);
    }
    const formatted = data.map((d: any) => ({
      id: d.id,
      name: { marathi: d.name_marathi, english: d.name_english },
      rate: d.rate,
      description: { marathi: d.description_marathi, english: d.description_english }
    }));
    res.json(formatted);
  } catch (error: any) {
    const localData = await readLocalJson("loans.json");
    res.json(localData || []);
  }
});

app.post("/api/loans", authenticate, async (req, res) => {
  try {
    const client = getSupabase();
    const data = req.body;

    // Handle deletions: Remove items not in the current list
    const incomingIds = data.map((d: any) => String(d.id)).filter((id: string) => id !== "undefined" && id !== "");
    
    console.log(`Saving loans. Incoming IDs: ${incomingIds.join(', ')}`);

    if (incomingIds.length > 0) {
      const { error: deleteError } = await client.from("loans").delete().not("id", "in", incomingIds);
      if (deleteError) console.error("Error deleting removed loans:", deleteError.message);
    } else {
      const { error: deleteError } = await client.from("loans").delete().neq("id", "_none_");
      if (deleteError) console.error("Error deleting all loans:", deleteError.message);
    }

    for (const d of data) {
      const { error } = await client.from("loans").upsert({
        id: String(d.id),
        name_marathi: d.name.marathi,
        name_english: d.name.english,
        rate: d.rate,
        description_marathi: d.description.marathi,
        description_english: d.description.english
      });
      if (error) {
        console.error(`Error saving loan ${d.id}:`, error.message);
        return res.status(500).json({ error: `Failed to save loan ${d.id}: ${error.message}` });
      }
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Loans save failed:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.VERCEL) {
    console.log("Running on Vercel, skipping startServer initialization.");
    // Debug: check if data directory exists
    try {
      const dataPath = path.join(process.cwd(), "data");
      if (await fs.access(dataPath).then(() => true).catch(() => false)) {
        const files = await fs.readdir(dataPath);
        console.log(`Vercel: Data directory found at ${dataPath}. Files: ${files.join(", ")}`);
      } else {
        console.error(`Vercel: Data directory NOT found at ${dataPath}`);
      }
    } catch (err: any) {
      console.error(`Vercel: Error checking data directory: ${err.message}`);
    }
    return;
  }

  console.log("startServer() called");
  try {
    const PORT = 3000;

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      console.log("Initializing Vite middleware...");
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite middleware initialized.");
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
      console.log("Server is ready to accept connections.");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
