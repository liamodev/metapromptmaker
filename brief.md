# Meta Prompt Maker — Build Brief (Next.js / TypeScript)

## 0) Purpose

A clean, finance-friendly web app that **turns any rough prompt into an optimized, copy-ready prompt**—and (optionally) **runs the exact same prompt** across OpenAI (GPT-5 base), Anthropic (Claude latest), and Google (Gemini 1.5) in parallel to compare outputs.

---

## 1) Core User Flow (3 steps)

1. **Paste Prompt**

   * Textarea for the user’s initial prompt (1 line or long form).
   * Select a **Use-Case Pack** (optional) to bias clarifiers (e.g., LinkedIn Post, Investment Memo).
   * CTA: “**Optimize**”.

2. **Clarifiers (one round, 5–6 Qs)**

   * Server calls GPT-5 with a meta-prompt to **analyse what’s missing** and return 5–6 clarifying questions with a **recommended UI type** per question: `text`, `textarea`, `dropdown`, `checkbox`, `multiselect`.
   * Render form dynamically.
   * CTA: “**Generate Optimized Prompt**”.

3. **Optimized Prompt + (optional) Multi-Model Run**

   * Show the **final, copy-ready prompt** (readonly textarea + “Copy”).
   * Toggle “**Run on models**” → checkboxes: **Claude (latest)**, **Gemini (base)**, **GPT-5 (base)**.
   * If checked, call providers **in parallel** and render outputs in three columns/cards with model labels.
   * Log anonymized analytics + store prompt/answers internally.

---

## 2) Naming & Branding

* Working name: **Meta Prompt Maker** (can change later).
* **Branding**: use provided **Altitude** logo; colour system neutral + subtle finance cues.
* Typography: Inter or IBM Plex Sans.
* Microcopy: “Built by Altitude Global Advisors.”

---

## 3) Tech Stack

* **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**.
* **Vercel Postgres** (via Prisma) for storage + analytics.
* **Server Actions** (where convenient) + **/api** routes for provider calls.
* **Zod** for input validation.
* **OpenAI / Anthropic / Google Generative AI SDKs** (server-side only).
* **Rate limiting**: Upstash Redis (or simple in-memory dev limiter).

---

## 4) Pages & Components

* `app/(public)/page.tsx` — Home (Step 1).
* `app/optimize/route.ts` — POST: generate clarifier questions.
* `app/finalize/route.ts` — POST: produce optimized prompt.
* `app/run/route.ts` — POST: call selected models in parallel.
* `app/privacy`, `app/terms`, `app/disclaimer` — simple docs.
* Components

  * `PromptForm` (step 1)
  * `ClarifierForm` (dynamic schema -> inputs)
  * `OptimizedPromptCard`
  * `ModelRunner` (parallel calls, result tabs/cards)
  * `Header`, `Footer`, `Logo`, `Banner`
  * `PackSelector` (use-case packs)
  * `Toast`, `CopyButton`, `Spinner`

---

## 5) Data Model (Prisma)

```prisma
model Session {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())
  ipHash        String?  // sha256(ip + salt), optional
  userAgent     String?
  events        Event[]
}

model PromptRecord {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())
  sessionId     String?
  session       Session? @relation(fields: [sessionId], references: [id])

  rawPrompt     String   // user input
  packKey       String?  // e.g., "linkedin_post"
  clarifiers    Json     // array of Q objects served to user
  clarifierAnswers Json  // user answers
  optimizedPrompt String // final prompt text

  ranOpenAI     Boolean  @default(false)
  ranAnthropic  Boolean  @default(false)
  ranGoogle     Boolean  @default(false)

  resultOpenAI  String?  // model output text
  resultAnthropic String?
  resultGoogle  String?

  metrics       Json?    // timings, tokens, selections
}

model Event {
  id        String   @id @default(cuid())
  at        DateTime @default(now())
  sessionId String?
  session   Session? @relation(fields: [sessionId], references: [id])
  kind      String   // page_view, optimize_click, clarifiers_rendered, finalize_click, run_models
  data      Json?
}
```

---

## 6) Use-Case Packs (for investment firms)

Each pack contributes **bias + candidate clarifiers**. The model can replace/trim to 5–6.

**Packs (v1):**

* `linkedin_post`

  * Audience (CIO, COO, FO Principal, LPs) – multiselect
  * Goal/CTA (download, book call, follow) – dropdown
  * Tone (formal, concise, expert) – dropdown
  * Compliance constraints (e.g., no performance promises) – checkbox
  * Key insight to emphasise – text
* `investment_memo`

  * Strategy type (L/S equity, credit, macro, VC, PE) – dropdown
  * Time horizon & benchmark – text
  * Risk constraints (VaR bands, drawdown) – text
  * Evidence type (data/citations) – multiselect
  * Audience (IC, PMs, risk) – dropdown
* `rfp_response`
* `compliance_note`
* `client_email`
* `portfolio_commentary`

*(We’ll ship with 3–4 packs populated; others stubbed.)*

---

## 7) Meta-Prompting (server prompts)

### 7.1 Generate Clarifiers (to GPT-5)

Input: `rawPrompt`, `selectedPack`, optional pack seed clarifiers.
Output: **array of 5–6 objects**:

```json
{
  "questions": [
    {
      "id": "audience",
      "label": "Who exactly is the primary audience?",
      "type": "multiselect",
      "options": ["CIO","COO","Investment Committee","Portfolio Managers","Family Office Principals","LPs"],
      "required": true
    },
    { "id": "cta", "label": "What action should the reader take next?", "type": "dropdown",
      "options": ["Book call","Reply email","Download PDF","Visit URL","Follow/DM"], "required": true },
    { "id": "constraints", "label": "Any compliance or legal constraints to honour?", "type": "textarea" },
    { "id": "tone", "label": "Preferred tone", "type": "dropdown", "options": ["Formal","Concise","Board-ready","Persuasive"] },
    { "id": "key_point", "label": "Single key insight to emphasise", "type": "text" }
  ]
}
```

**System instruction (summary):**

* Analyse the user’s prompt.
* Identify missing info that would materially improve specificity for an enterprise LLM.
* Return **exactly 5–6** clarifiers.
* Include `type` from: `text`, `textarea`, `dropdown`, `checkbox`, `multiselect`.
* Prefer finance-relevant wording; avoid jargon/hype.

### 7.2 Produce Optimized Prompt (to GPT-5)

* Inputs: `rawPrompt`, `clarifierAnswers`, `selectedPack`.
* Output: single **copy-ready prompt**:

  * Clear task + audience + constraints
  * Style/tone guidance minimal but concrete
  * Include any provided facts; do not fabricate
  * End with: **“If any detail is unclear, ask 1–2 clarifying questions before answering.”**

---

## 8) Multi-Model Runner

* API `POST /run` with `{ optimizedPrompt, models: { openai?:true, anthropic?:true, google?:true } }`.
* Server-side calls only; **parallel** via `Promise.allSettled`.
* Return `{ openaiText?, anthropicText?, googleText?, timings }`.
* UI renders three result cards with a small badge (“Claude”, “Gemini”, “GPT-5”).

---

## 9) UI Copy (V1)

**Hero title:** “Meta Prompt Maker”
**Subtitle:** “Turn rough ideas into precise prompts—built for investment teams.”
**“What is meta-prompting?” blurb (short):**
“Instead of wrestling with the perfect wording, let AI ask you the 5–6 questions that matter. You answer quickly; it returns a cleaner, more targeted prompt you can copy or run.”
**Disclaimer (footer):**
“Outputs may contain errors. Review before use. Nothing here is investment advice.”

---

## 10) Security & Privacy

* No auth (public), but:

  * Strip obvious PII from analytics (hash IP with salt).
  * Env-gated provider keys; **never expose keys client-side**.
  * CORS: same-origin only.
  * Rate-limit by IP to prevent abuse (e.g., 60 req/hr).

---

## 11) Analytics

* Lightweight **Event** logging (DB) + **Vercel Analytics**.
* Events: `page_view`, `optimize_click`, `clarifiers_rendered`, `finalize_click`, `copy_click`, `run_models`, `model_error`.

---

## 12) Folder Structure (high level)

```
app/
  page.tsx
  api/
    optimize/route.ts      // clarifier generator
    finalize/route.ts      // optimized prompt
    run/route.ts           // multi-model runner
  privacy/page.tsx
  disclaimer/page.tsx
components/
  PromptForm.tsx
  PackSelector.tsx
  ClarifierForm.tsx
  OptimizedPromptCard.tsx
  ModelRunner.tsx
  Header.tsx Footer.tsx Logo.tsx
lib/
  metaPrompts.ts           // system prompts
  packs.ts                 // pack definitions
  providers/
    openai.ts anthropic.ts google.ts
  db.ts                    // Prisma client
  rateLimit.ts
styles/ (tailwind)
prisma/
  schema.prisma
```

---

## 13) Environment Variables

```
DATABASE_URL=...            # Vercel Postgres
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GOOGLE_API_KEY=...
RATE_LIMIT_SALT=...
ALTITUDE_BRAND_COLOR=#0F2B5B  # example
```

---

## 14) Acceptance Criteria (MVP)

* Paste prompt → “Optimize” returns **5–6 clarifiers** with correct UI types within 3s p50 (cached packs okay).
* Submitting clarifiers returns a **single optimized prompt** that:

  * Mentions audience & CTA when provided
  * Includes constraints verbatim
  * Ends with a “ask 1–2 clarifiers if unclear” clause
* “Copy” button works (clipboard API).
* Ticking models and clicking “Run” shows three result cards with **matching content** to the optimized prompt (no hidden rewrites).
* Records are stored in DB (raw prompt, clarifiers, answers, optimized prompt, model outputs, timings).
* Basic rate-limit active.
* Responsive layout; looks professional on desktop & mobile.
* Footer shows **Altitude** logo + disclaimer + links.

---

## 15) Example Meta-Prompt (server → GPT-5) — Clarifiers

```text
You are designing exactly 5–6 clarifying questions to improve a user’s prompt for an enterprise LLM.

Context:
- The user works in/with investment firms.
- The raw prompt is below.
- If a Use-Case Pack is provided, prefer finance-relevant phrasing and hints.

Return JSON only with:
[{ id, label, type, options?, required? }]

Types: text | textarea | dropdown | checkbox | multiselect.
Pick types that minimise typing while improving specificity (e.g., dropdown for tone, multiselect for audience).
Avoid hype. Be concise and precise.

RAW_PROMPT:
"""
{{rawPrompt}}
"""

USE_CASE_PACK (optional):
{{packJSON}}
```

---

## 16) Styling Notes

* **shadcn/ui** `Card`, `Button`, `Textarea`, `Select`, `Badge`, `Tabs`.
* Soft grid, subtle dividers, generous white space, minimal colour—use Altitude accent sparingly.
* Finance-friendly icons (lucide).

---

## 17) Deployment

* Repo: GitHub → Vercel (Production + Preview).
* Vercel Postgres + Prisma migrate on deploy.
* Add provider keys in Vercel Project Settings.
* Attach **altitude7.com** subdomain (e.g., `meta.altitude7.com`).

---

## 18) Nice-to-Have (post-MVP)

* Save/share templates with slugs (read-only).
* Org-mode export / Markdown download.
* A/B: provider order, clarifier phrasing.
* Private mode toggle (don’t store this session).
* Role presets (PM, CIO, Compliance).