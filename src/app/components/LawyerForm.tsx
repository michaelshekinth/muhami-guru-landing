import { useEffect, useRef, useState } from "react";
import { CheckCircle, Loader2, Briefcase, Mail, Clock } from "lucide-react";
import { ApiError, submitLawyerApplication } from "@/lib/api";
import {
  isValidPhone,
  PHONE_PLACEHOLDER,
  PHONE_VALIDATION_MESSAGE,
} from "@/lib/phone";

const NATIONALITIES = [
  "Emirati", "Saudi Arabian", "Kuwaiti", "Bahraini", "Qatari", "Omani",
  "Egyptian", "Jordanian", "Lebanese", "Syrian", "Iraqi", "Yemeni",
  "Moroccan", "Tunisian", "Algerian", "Libyan", "Sudanese", "Somali",
  "Pakistani", "Indian", "Bangladeshi", "Sri Lankan", "Filipino",
  "British", "American", "Canadian", "Australian", "French", "German",
  "Other",
];

const EXPERIENCE_LEVELS = [
  "0 – 2 years",
  "3 – 5 years",
  "6 – 10 years",
  "11 – 15 years",
  "16 – 20 years",
  "20+ years",
];

type LawyerFormProps = {
  theme?: "dark" | "light";
};

export function LawyerForm({ theme = "dark" }: LawyerFormProps) {
  const isDark = theme === "dark";
  const successRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    experience: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [submitted]);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (serverError) setServerError("");
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.email.trim()) {
      next.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Please enter a valid email.";
    }
    if (!form.phone.trim()) {
      next.phone = "Phone number is required.";
    } else if (!isValidPhone(form.phone)) {
      next.phone = PHONE_VALIDATION_MESSAGE;
    }
    if (!form.nationality) next.nationality = "Please select your nationality.";
    if (!form.experience) next.experience = "Please select your experience level.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");
    setErrors({});

    try {
      await submitLawyerApplication(form);
      setSubmittedName(form.fullName.trim());
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError && err.field) {
        setErrors({ [err.field]: err.message });
      } else {
        setServerError(
          err instanceof Error
            ? err.message
            : "Unable to reach the server. Please try again later."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setForm({ fullName: "", email: "", phone: "", nationality: "", experience: "" });
    setErrors({});
    setServerError("");
    setSubmitted(false);
    setSubmittedName("");
  }

  const cardCls = isDark
    ? "backdrop-blur-md bg-[rgba(18,16,12,0.85)] border-[rgba(201,168,76,0.18)]"
    : "bg-white border-[rgba(201,168,76,0.3)] shadow-lg";

  const titleColor = isDark ? "text-[#F5F0E8]" : "text-[#0A0A0A]";
  const mutedColor = isDark ? "text-[#8A8070]" : "text-[#5C574F]";

  if (submitted) {
    return (
      <div
        ref={successRef}
        role="alert"
        aria-live="polite"
        className={`w-full ${cardCls} border rounded-2xl p-6 sm:p-10 shadow-[0_16px_60px_rgba(0,0,0,0.15)] flex flex-col items-center text-center gap-5`}
      >
        <div className="w-20 h-20 rounded-full bg-[#C9A84C]/15 border-2 border-[#C9A84C]/40 flex items-center justify-center">
          <CheckCircle size={40} className="text-[#C9A84C]" />
        </div>

        <div className="max-w-md">
          <p className="text-xs text-[#C9A84C] uppercase tracking-widest font-semibold mb-2">
            Application Received
          </p>
          <h2
            style={{ fontFamily: "'Playfair Display', serif" }}
            className={`text-2xl sm:text-3xl font-bold mb-3 ${titleColor}`}
          >
            Thank You{submittedName ? `, ${submittedName.split(" ")[0]}` : ""}!
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed mb-5 ${mutedColor}`}>
            Your application to join the MUHAMI.guru verified lawyer network has
            been submitted successfully. Our team will review your credentials and
            contact you within <strong className="text-[#C9A84C] font-medium">3–5 business days</strong>.
          </p>

          <div className={`rounded-xl border border-[rgba(201,168,76,0.2)] p-4 text-left space-y-3 ${isDark ? "bg-[#1A1710]/60" : "bg-gray-50"}`}>
            <p className={`text-xs font-semibold text-[#C9A84C] uppercase tracking-wide`}>
              What happens next
            </p>
            <div className={`flex items-start gap-3 text-sm ${mutedColor}`}>
              <Mail size={16} className="text-[#C9A84C] shrink-0 mt-0.5" />
              <span>We&apos;ll email you at the address you provided with updates on your application.</span>
            </div>
            <div className={`flex items-start gap-3 text-sm ${mutedColor}`}>
              <Clock size={16} className="text-[#C9A84C] shrink-0 mt-0.5" />
              <span>Please keep an eye on your inbox — including spam — for a message from our team.</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="mt-2 px-6 py-2.5 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] text-sm font-medium hover:bg-[#C9A84C]/10 transition-all duration-200"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${cardCls} border rounded-2xl p-6 sm:p-8 shadow-[0_16px_60px_rgba(0,0,0,0.15)]`}
    >
      <div className="mb-7">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/12 border border-[#C9A84C]/25 flex items-center justify-center shrink-0">
            <Briefcase size={15} className="text-[#C9A84C]" />
          </div>
          <h2
            style={{ fontFamily: "'Playfair Display', serif" }}
            className={`text-lg sm:text-xl font-semibold ${titleColor}`}
          >
            I&apos;m a Lawyer — Apply Here
          </h2>
        </div>
        <p className={`text-sm ${mutedColor}`}>
          Join our verified network of legal professionals across the UAE.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Field label="Full Name" error={errors.fullName} isDark={isDark}>
          <input
            type="text"
            placeholder="e.g. Ahmad Al-Rashidi"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className={inputCls(!!errors.fullName, isDark)}
          />
        </Field>

        <Field label="Email Address" error={errors.email} isDark={isDark}>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={inputCls(!!errors.email, isDark)}
          />
        </Field>

        <Field label="Phone Number" error={errors.phone} isDark={isDark}>
          <input
            type="tel"
            placeholder={PHONE_PLACEHOLDER}
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={inputCls(!!errors.phone, isDark)}
          />
        </Field>

        <Field label="Nationality" error={errors.nationality} isDark={isDark}>
          <select
            value={form.nationality}
            onChange={(e) => handleChange("nationality", e.target.value)}
            className={selectCls(!!errors.nationality, isDark)}
          >
            <option value="">Select nationality</option>
            {NATIONALITIES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </Field>

        <Field label="Years of Experience" error={errors.experience} isDark={isDark}>
          <select
            value={form.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
            className={selectCls(!!errors.experience, isDark)}
          >
            <option value="">Select experience level</option>
            {EXPERIENCE_LEVELS.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </Field>

        {serverError && (
          <p className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#A08030] text-[#080808] font-semibold text-sm hover:shadow-[0_0_28px_rgba(201,168,76,0.45)] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </form>
    </div>
  );
}

function inputCls(hasError: boolean, isDark: boolean) {
  const base = isDark
    ? "bg-[#1A1710] text-[#F5F0E8] placeholder-[#8A8070]"
    : "bg-gray-50 text-[#0A0A0A] placeholder-[#8A8070]";
  return [
    "w-full text-sm border rounded-xl px-4 py-3 outline-none transition-all duration-200",
    "focus:border-[#C9A84C]/50 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)]",
    base,
    hasError
      ? "border-red-500/60"
      : isDark
        ? "border-[rgba(201,168,76,0.18)] hover:border-[rgba(201,168,76,0.32)]"
        : "border-gray-200 hover:border-[rgba(201,168,76,0.4)]",
  ].join(" ");
}

function selectCls(hasError: boolean, isDark: boolean) {
  const base = isDark ? "bg-[#1A1710] text-[#F5F0E8]" : "bg-gray-50 text-[#0A0A0A]";
  return [
    "w-full text-sm border rounded-xl px-4 py-3 outline-none cursor-pointer transition-all duration-200",
    "focus:border-[#C9A84C]/50 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)]",
    base,
    hasError
      ? "border-red-500/60"
      : isDark
        ? "border-[rgba(201,168,76,0.18)] hover:border-[rgba(201,168,76,0.32)]"
        : "border-gray-200 hover:border-[rgba(201,168,76,0.4)]",
  ].join(" ");
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#C9A84C]/80 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}
