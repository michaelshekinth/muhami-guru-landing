# Plan: Muhami.guru — Add "What We're Building" Sections to Coming Soon Page

## Context
The Coming Soon page currently shows: logo → "Coming Soon" headline → divider → lawyer application form. The user wants one or two teaser sections inserted **between the "Coming Soon" headline block and the divider/form**, briefly communicating what Muhami.guru will offer when it launches. This gives visitors a reason to be excited and adds context before the form ask.

---

## What to Add

### Section 1 — "What We're Building" (3-column feature grid)

A short headline + 3 glassmorphism feature cards, each with a gold icon, a title, and 1–2 lines of copy. Placed right after the existing Coming Soon sub-paragraph.

Proposed cards:
1. **Verified Lawyers** — "Every lawyer on our platform is UAE Bar-licensed and identity-verified. No guesswork, just trusted professionals."
2. **Smart Matching** — "Describe your issue and get matched with the right specialist instantly — civil, corporate, family, real estate, and more."
3. **AI Legal Assistant** — "Understand your rights before you consult. Our AI explains UAE law in plain language, 24/7."

Layout: 3 columns on desktop, single column on mobile. Cards use the existing glassmorphism pattern (`backdrop-blur-md bg-[rgba(18,16,12,0.85)] border border-[rgba(201,168,76,0.18)] rounded-2xl`). Icons from `lucide-react` (Shield, Zap, Sparkles).

### Section 2 — "Coming to All 7 Emirates" (single centred strip)

A simple, elegant one-liner strip: bold stat row showing "7 Emirates · 2,400+ Lawyers · 20+ Practice Areas" separated by gold dots. Sits below the feature cards, above the gold divider.

---

## File to Modify

`src/app/App.tsx` — insert the two sections between the existing Coming Soon copy block and the `<div className="flex items-center gap-3 my-10 ...">` divider. No other files need changes.

---

## Aesthetic Stance

**Committed stance: Luxury Dark — noir with gold accents**
Not swiss or memphis (brief is explicit). Full commitment to dark-ground + gold.

- **Display font:** `Playfair Display` — transitional serif, classic legal gravitas, gold treatment on headings
- **Body font:** `Inter` — clean, readable in both light and dark contexts
- **Arabic font:** `Noto Naskh Arabic` — authentic, elegant Arabic script
- **Mono (optional labels):** `DM Mono` — subtle structural labels

**Palette:**
- `--background`: `#080808` (near-black)
- `--foreground`: `#F5F0E8` (warm cream)
- `--card`: `rgba(18, 16, 12, 0.85)` (glass dark)
- `--primary`: `#C9A84C` (gold)
- `--primary-foreground`: `#080808`
- `--secondary`: `#1A1710` (dark warm)
- `--muted`: `#1E1C15`
- `--muted-foreground`: `#8A8070`
- `--accent`: `#D4AF37` (rich gold accent)
- `--border`: `rgba(201, 168, 76, 0.15)` (faint gold hairline)
- `--radius`: `0.75rem`

---

## Files to Modify

| File | Action |
|---|---|
| `src/styles/fonts.css` | Add Google Fonts imports for Playfair Display, Inter, Noto Naskh Arabic, DM Mono |
| `src/styles/theme.css` | Update `:root` tokens to luxury dark palette (preserve `.dark` block and `@theme inline`) |
| `src/app/App.tsx` | Replace with full landing page component |

---

## Component Architecture (all in App.tsx)

Single file with these sections as sub-components:

### 1. Navbar
- Logo "Muhami.guru" in Playfair Display + gold dot
- Language toggle pill: `EN | عر` — `useState` controls `lang` ("en" | "ar")
- Nav links: Find a Lawyer · AI Assistant · About · Contact
- CTA button: "Get Started"
- Sticky, glassmorphism blur, gold border-bottom on scroll

### 2. Hero Section
- Full-viewport, dark-to-near-black gradient bg with subtle gold radial glow behind headline
- Large Playfair Display headline (bilingual swap)
- Subheadline body copy
- Two CTAs: primary gold "Find a Lawyer" + outlined "Ask AI Assistant"
- Lawyer search box: text input + category select + Search button
- Popular categories as pill chips: Civil · Criminal · Corporate · Family · Real Estate · Immigration
- Subtle UAE skyline silhouette SVG or dark overlay photo (Unsplash Dubai)

### 3. How It Works
- 4-step horizontal timeline with gold numbered indicators
- Steps: Tell us your issue → Matched with verified lawyer → Book consultation → Track your case
- Icon per step from lucide-react

### 4. Featured Lawyers
- 3-column glassmorphism cards
- Each card: photo (Unsplash), name, specialty, rating (gold stars), years experience, "View Profile" CTA
- 6 realistic lawyer profiles with UAE names

### 5. AI Legal Assistant
- Split layout: left copy, right interactive demo panel
- Chat bubble preview showing legal term explanation
- Gold gradient CTA: "Try AI Assistant"

### 6. Testimonials
- 3 client quotes in glassmorphism cards
- Star ratings, client name + emirate
- Bilingual quotes (toggle shows Arabic or English)

### 7. FAQ
- Accordion using @radix-ui/react-accordion
- 6 realistic legal-tech questions
- Gold chevron indicator

### 8. Footer
- Logo + tagline
- 4 columns: Services, Company, Legal, Contact
- Social icons (lucide-react): Twitter/X, LinkedIn, Instagram
- Contact: email, phone (+971), Dubai address
- Bottom bar: copyright + legal links

---

## Language Toggle Logic

```tsx
const [lang, setLang] = useState<"en" | "ar">("en");
const t = lang === "en" ? en : ar;
// content object with all strings for both languages
// RTL: <div dir={lang === "ar" ? "rtl" : "ltr"}>
```

Translation object covers all headings, subheads, CTAs, nav items, step labels, and section titles. Body copy and lawyer names remain in English for authenticity.

---

## Glassmorphism Card Pattern

```tsx
className="backdrop-blur-md bg-card border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
```

Gold shimmer on hover via `transition-all hover:border-[rgba(201,168,76,0.4)] hover:shadow-[0_8px_40px_rgba(201,168,76,0.08)]`

---

## Unsplash Images

- Hero background: Dubai city lights at night (`photo-1512453979798-5ea266f8880c`)
- Lawyer portraits: professional headshots (6 different photo IDs)

---

## Verification

1. `npm run dev` (or equivalent) to confirm the app compiles
2. Visually check: dark background renders, gold tokens appear, Arabic text renders RTL when toggled
3. Check language toggle switches all labeled content
4. Check FAQ accordion opens/closes
5. Confirm glassmorphism cards render with blur on dark background
6. Confirm no TypeScript errors
