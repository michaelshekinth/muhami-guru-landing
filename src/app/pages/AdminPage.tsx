import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import {
  RefreshCw,
  LogOut,
  Shield,
  Users,
  Loader2,
  Download,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { adminLogin, deleteApplication, fetchApplications, type LawyerApplication } from "@/lib/api";

const STORAGE_KEY = "muhami_admin_key";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function exportCsv(applications: LawyerApplication[]) {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Nationality",
    "Experience",
    "Submitted",
  ];
  const rows = applications.map((a) => [
    a.full_name,
    a.email,
    a.phone,
    a.nationality,
    a.experience,
    a.created_at,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lawyer-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState(() =>
    sessionStorage.getItem(STORAGE_KEY)
  );
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [applications, setApplications] = useState<LawyerApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async (key: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchApplications(key);
      setApplications(data.applications);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        sessionStorage.removeItem(STORAGE_KEY);
        setAdminKey(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) load(adminKey);
  }, [adminKey, load]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setError("");
    try {
      const { token } = await adminLogin(usernameInput.trim(), passwordInput);
      sessionStorage.setItem(STORAGE_KEY, token);
      setAdminKey(token);
      setUsernameInput("");
      setPasswordInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey(null);
    setApplications([]);
    setError("");
    setDeletingId(null);
  }

  async function handleDelete(id: string, name: string) {
    if (!adminKey) return;
    if (!window.confirm(`Delete application from ${name}? This cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    setError("");
    try {
      await deleteApplication(adminKey, id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!adminKey) {
    return (
      <div
        className="min-h-screen bg-[#080808] text-[#F5F0E8] flex items-center justify-center px-4"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="w-full max-w-md rounded-2xl border border-[rgba(201,168,76,0.2)] bg-[rgba(18,16,12,0.9)] p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center">
              <Shield size={20} className="text-[#C9A84C]" />
            </div>
            <div>
              <h1
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-xl font-bold"
              >
                Admin Panel
              </h1>
              <p className="text-xs text-[#8A8070]">MUHAMI.guru applications</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-[#C9A84C]/80 uppercase tracking-wide mb-1.5 block">
                Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className="w-full bg-[#1A1710] text-[#F5F0E8] text-sm border border-[rgba(201,168,76,0.18)] rounded-xl px-4 py-3 outline-none focus:border-[#C9A84C]/50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#C9A84C]/80 uppercase tracking-wide mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-[#1A1710] text-[#F5F0E8] text-sm border border-[rgba(201,168,76,0.18)] rounded-xl px-4 py-3 outline-none focus:border-[#C9A84C]/50"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#A08030] text-[#080808] font-semibold text-sm hover:shadow-[0_0_20px_rgba(201,168,76,0.35)] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <Link
            to="/"
            className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[#8A8070] hover:text-[#C9A84C] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#080808] text-[#F5F0E8]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <header className="border-b border-[rgba(201,168,76,0.15)] bg-[rgba(18,16,12,0.6)] backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center">
              <Shield size={18} className="text-[#C9A84C]" />
            </div>
            <div>
              <h1
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-lg font-bold leading-tight"
              >
                Lawyer Applications
              </h1>
              <p className="text-xs text-[#8A8070]">MUHAMI.guru admin</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => load(adminKey)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[rgba(201,168,76,0.2)] text-[#C9A84C] text-sm hover:bg-[#C9A84C]/10 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <RefreshCw size={15} />
              )}
              Refresh
            </button>
            {applications.length > 0 && (
              <button
                onClick={() => exportCsv(applications)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[rgba(201,168,76,0.2)] text-[#8A8070] text-sm hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
              >
                <Download size={15} />
                Export CSV
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[rgba(201,168,76,0.2)] text-[#8A8070] text-sm hover:text-red-400 hover:border-red-400/30 transition-colors"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-[rgba(201,168,76,0.18)] bg-[rgba(18,16,12,0.85)] p-5">
            <div className="flex items-center gap-2 text-[#8A8070] text-xs uppercase tracking-wide mb-2">
              <Users size={14} className="text-[#C9A84C]" />
              Total Applications
            </div>
            <p
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-3xl font-bold text-[#C9A84C]"
            >
              {loading ? "—" : applications.length}
            </p>
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <div className="rounded-xl border border-[rgba(201,168,76,0.18)] bg-[rgba(18,16,12,0.85)] overflow-hidden">
          {loading && applications.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-20 text-[#8A8070]">
              <Loader2 size={20} className="animate-spin text-[#C9A84C]" />
              Loading applications…
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-20 text-[#8A8070]">
              <Users size={32} className="mx-auto mb-3 opacity-40" />
              <p>No applications yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(201,168,76,0.12)] text-left">
                    {[
                      "Name",
                      "Email",
                      "Phone",
                      "Nationality",
                      "Experience",
                      "Submitted",
                      "",
                    ].map((h) => (
                      <th
                        key={h || "actions"}
                        className="px-4 py-3 text-xs font-semibold text-[#C9A84C]/80 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, i) => (
                    <tr
                      key={app.id}
                      className={`border-b border-[rgba(201,168,76,0.08)] hover:bg-[#C9A84C]/5 transition-colors ${
                        i % 2 === 0 ? "" : "bg-[#1A1710]/40"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        {app.full_name}
                      </td>
                      <td className="px-4 py-3 text-[#8A8070] whitespace-nowrap">
                        <a
                          href={`mailto:${app.email}`}
                          className="hover:text-[#C9A84C] transition-colors"
                        >
                          {app.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-[#8A8070] whitespace-nowrap">
                        {app.phone}
                      </td>
                      <td className="px-4 py-3 text-[#8A8070] whitespace-nowrap">
                        {app.nationality}
                      </td>
                      <td className="px-4 py-3 text-[#8A8070] whitespace-nowrap">
                        {app.experience}
                      </td>
                      <td className="px-4 py-3 text-[#8A8070] whitespace-nowrap">
                        {formatDate(app.created_at)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDelete(app.id, app.full_name)}
                          disabled={deletingId === app.id}
                          aria-label={`Delete ${app.full_name}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-red-500/25 text-red-400 text-xs hover:bg-red-500/10 hover:border-red-500/40 disabled:opacity-50 transition-colors"
                        >
                          {deletingId === app.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-[#8A8070] hover:text-[#C9A84C] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to landing page
        </Link>
      </main>
    </div>
  );
}
