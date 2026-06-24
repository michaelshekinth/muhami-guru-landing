import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = process.env.PORT || 3001;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env and fill in your Supabase credentials."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_FORMAT_REGEX = /^\+?[\d\s\-()]+$/;
const MIN_PHONE_DIGITS = 8;
const MAX_PHONE_DIGITS = 15;

function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return false;
  if (!PHONE_FORMAT_REGEX.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "").length;
  return digits >= MIN_PHONE_DIGITS && digits <= MAX_PHONE_DIGITS;
}

function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

// ── POST /api/admin/login ────────────────────────────────────────────────────
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body ?? {};

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  if (!ADMIN_API_KEY) {
    return res.status(503).json({ error: "Admin is not configured on the server." });
  }

  return res.json({ success: true, token: ADMIN_API_KEY });
});

// ── POST /api/lawyers ────────────────────────────────────────────────────────
app.post("/api/lawyers", async (req, res) => {
  const { fullName, email, phone, nationality, experience } = req.body ?? {};

  if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !nationality || !experience) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Invalid email address.", field: "email" });
  }

  if (!isValidPhone(phone)) {
    return res.status(400).json({
      error: "Enter a valid international number (e.g. +1 555 000 0000).",
      field: "phone",
    });
  }

  const emailNorm = email.trim().toLowerCase();
  const phoneNorm = normalizePhone(phone);

  const { data: emailMatch } = await supabase
    .from("lawyer_applications")
    .select("id")
    .eq("email", emailNorm)
    .maybeSingle();

  if (emailMatch) {
    return res.status(409).json({ error: "This email is already in use.", field: "email" });
  }

  const { data: phoneRows } = await supabase
    .from("lawyer_applications")
    .select("phone");

  const phoneTaken = phoneRows?.some(
    (row) => normalizePhone(row.phone) === phoneNorm,
  );

  if (phoneTaken) {
    return res.status(409).json({
      error: "This phone number is already in use.",
      field: "phone",
    });
  }

  const { data, error } = await supabase
    .from("lawyer_applications")
    .insert({
      full_name: fullName.trim(),
      email: emailNorm,
      phone: phoneNorm,
      nationality,
      experience,
    })
    .select("id, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      const msg = error.message?.includes("phone")
        ? "This phone number is already in use."
        : "This email is already in use.";
      const field = error.message?.includes("phone") ? "phone" : "email";
      return res.status(409).json({ error: msg, field });
    }
    console.error("Supabase insert error:", error);
    return res.status(500).json({ error: "Failed to save application. Please try again." });
  }

  console.log("New lawyer application saved:", data.id);

  return res.status(201).json({
    success: true,
    message: "Application received. We will be in touch shortly.",
    id: data.id,
  });
});

// ── GET /api/lawyers (admin) ─────────────────────────────────────────────────
app.get("/api/lawyers", async (req, res) => {
  if (!ADMIN_API_KEY) {
    return res.status(503).json({ error: "Admin endpoint is not configured." });
  }

  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { data, error } = await supabase
    .from("lawyer_applications")
    .select("id, full_name, email, phone, nationality, experience, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch applications." });
  }

  return res.json({ total: data.length, applications: data });
});

// ── DELETE /api/lawyers/:id (admin) ──────────────────────────────────────────
app.delete("/api/lawyers/:id", async (req, res) => {
  if (!ADMIN_API_KEY) {
    return res.status(503).json({ error: "Admin endpoint is not configured." });
  }

  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { id } = req.params;
  const { error } = await supabase
    .from("lawyer_applications")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Supabase delete error:", error);
    return res.status(500).json({ error: "Failed to delete application." });
  }

  return res.json({ success: true });
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Muhami.guru API → http://localhost:${PORT}`);
  console.log(`CORS origin: ${ALLOWED_ORIGIN}`);
});
