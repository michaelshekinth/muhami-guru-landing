import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ADMIN_USERNAME = Deno.env.get("ADMIN_USERNAME") ?? "admin";
const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD") ?? "admin";
const ADMIN_API_KEY =
  Deno.env.get("ADMIN_API_KEY") ??
  "0fd692d70acf9cbedc592fc328ee7b7b55b281b25d23477f";
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://muhami.guru",
  "https://www.muhami.guru",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_FORMAT_REGEX = /^\+?[\d\s\-()]+$/;
const MIN_PHONE_DIGITS = 8;
const MAX_PHONE_DIGITS = 15;

function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed || !PHONE_FORMAT_REGEX.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "").length;
  return digits >= MIN_PHONE_DIGITS && digits <= MAX_PHONE_DIGITS;
}

function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

function corsHeaders(origin: string | null) {
  const isAllowed =
    origin &&
    (ALLOWED_ORIGINS.includes(origin) || /\.vercel\.app$/.test(origin));
  const allow = isAllowed ? origin! : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-admin-key",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  };
}

function routePath(url: URL) {
  const marker = "/muhami-api";
  const idx = url.pathname.indexOf(marker);
  if (idx === -1) return url.pathname;
  return url.pathname.slice(idx + marker.length) || "/";
}

function json(
  body: unknown,
  status = 200,
  origin: string | null = null,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

function requireAdmin(req: Request) {
  const key = req.headers.get("x-admin-key");
  if (key !== ADMIN_API_KEY) return false;
  return true;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const path = routePath(new URL(req.url));

  if (req.method === "POST" && path === "/admin/login") {
    const { username, password } = await req.json().catch(() => ({}));
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return json({ error: "Invalid username or password." }, 401, origin);
    }
    return json({ success: true, token: ADMIN_API_KEY }, 200, origin);
  }

  if (req.method === "POST" && path === "/lawyers") {
    const { fullName, email, phone, nationality, experience } = await req
      .json().catch(() => ({}));

    if (
      !fullName?.trim() || !email?.trim() || !phone?.trim() || !nationality ||
      !experience
    ) {
      return json({ error: "All fields are required." }, 400, origin);
    }

    if (!EMAIL_REGEX.test(email)) {
      return json({ error: "Invalid email address.", field: "email" }, 400, origin);
    }

    if (!isValidPhone(phone)) {
      return json(
        {
          error: "Enter a valid international number (e.g. +1 555 000 0000).",
          field: "phone",
        },
        400,
        origin,
      );
    }

    const emailNorm = email.trim().toLowerCase();
    const phoneNorm = normalizePhone(phone);

    const { data: emailMatch } = await supabase
      .from("lawyer_applications")
      .select("id")
      .eq("email", emailNorm)
      .maybeSingle();

    if (emailMatch) {
      return json(
        { error: "This email is already in use.", field: "email" },
        409,
        origin,
      );
    }

    const { data: phoneRows } = await supabase
      .from("lawyer_applications")
      .select("phone");

    const phoneTaken = phoneRows?.some(
      (row) => normalizePhone(row.phone) === phoneNorm,
    );

    if (phoneTaken) {
      return json(
        { error: "This phone number is already in use.", field: "phone" },
        409,
        origin,
      );
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
        return json({ error: msg, field }, 409, origin);
      }
      console.error(error);
      return json({ error: "Failed to save application. Please try again." }, 500, origin);
    }

    return json({
      success: true,
      message: "Application received. We will be in touch shortly.",
      id: data.id,
    }, 201, origin);
  }

  if (req.method === "GET" && path === "/lawyers") {
    if (!requireAdmin(req)) {
      return json({ error: "Unauthorized." }, 401, origin);
    }

    const { data, error } = await supabase
      .from("lawyer_applications")
      .select(
        "id, full_name, email, phone, nationality, experience, created_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return json({ error: "Failed to fetch applications." }, 500, origin);
    }

    return json({ total: data.length, applications: data }, 200, origin);
  }

  if (req.method === "DELETE" && path.startsWith("/lawyers/")) {
    if (!requireAdmin(req)) {
      return json({ error: "Unauthorized." }, 401, origin);
    }

    const id = path.slice("/lawyers/".length).trim();
    if (!id) {
      return json({ error: "Application ID is required." }, 400, origin);
    }

    const { error } = await supabase
      .from("lawyer_applications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return json({ error: "Failed to delete application." }, 500, origin);
    }

    return json({ success: true }, 200, origin);
  }

  if (req.method === "GET" && path === "/health") {
    return json({ ok: true }, 200, origin);
  }

  return json({ error: "Not found" }, 404, origin);
});
