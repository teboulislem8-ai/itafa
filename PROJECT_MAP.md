# PROJECT MAP — Musa'id

## STATE: Phases 0–5 Complete

---

## COMPLETED

### Phase 0 — Environment Setup
- [x] Next.js 16 project initialized with App Router
- [x] Cloudflare + OpenNext config (wrangler.toml, next.config.ts)
- [x] Worker scaffolded with `/api/ai` endpoint → Gemini 2.0 Flash streaming
- [x] Supabase client + server libraries
- [x] Supabase migration SQL created (`supabase/migrations/00001_schema.sql`)
- [x] Auth pages: `/login`, `/register` with Supabase Auth
- [x] App file structure per plan (route groups, components, lib)
- [x] PWA manifest
- [x] Image compression utility (Canvas API)
- [x] Database type definitions
- [x] `.env.local.template`
- [x] `.gitignore` configured

### Phase 1 — Core AI Engine
- [x] Cloudflare Worker: streaming Gemini 2.0 Flash via SSE
- [x] System prompt builder (14 agricultural skills, layered)
- [x] Skill trigger detector (8 context categories)
- [x] Chat UI with streaming response (`/sessions/[id]`)
- [x] Language auto-detection (Arabic/French)
- [x] Photo upload → Supabase Storage → Gemini multimodal
- [x] Message persistence to Supabase `messages` table
- [x] Agent profile injection (wilaya, specialization)
- [x] Configurable Worker URL (`NEXT_PUBLIC_AI_WORKER_URL`)

### Phase 2 — Structured Features
- [x] Guided Field Observation Form (multi-step: crop → stage → symptoms → notes → AI)
- [x] Lab Data Interpreter (soil/water toggle, parameter inputs → AI analysis)
- [x] Session Management (list, create, open, auto-title)
- [x] Report Generator (session transcript → AI → field report → download .md)
- [x] Agent Dashboard (stats, quick actions)
- [x] Decision support (handled by skill detector → constraint/decision context)

### Phase 3 — UX Refinement
- [x] RTL layout support via LangContext (`dir="rtl"`)
- [x] Language switcher AR ↔ FR (one-tap, saved to profile)
- [x] Offline detection banner
- [x] Slow connection detection banner
- [x] Skeleton loading states (dashboard, sessions list)
- [x] Empty states (no sessions, no messages)
- [x] Error states (connection errors, upload errors)
- [x] Cairo font integrated

### Phase 4 — UI Polish
- [x] Cairo font (covers AR + FR, 300–800 weights)
- [x] Color system (#1B6B3A primary, neutral grays, alert colors)
- [x] Reusable UI components (Button, Card)
- [x] Semantic HTML structure
- [x] ARIA labels on interactive elements
- [x] Connection-aware UX (slow/offline banners)
- [x] Mobile-first layout (responsive containers)

### Phase 5 — Security Hardening
- [x] RLS policies on all tables (in migration SQL)
- [x] Rate limiting on Worker (20 req/min/agent, in-memory)
- [x] Input sanitization (prompt injection pattern stripping)
- [x] Photo upload validation (MIME type + 5MB size limit, client + server)
- [x] Photo URL origin validation (only Supabase/Google Storage URLs)
- [x] Security headers via `public/_headers` (CSP, X-Frame-Options, HSTS)
- [x] CORS origin validation in Worker
- [x] `npm audit` — zero high/critical findings

### Confidence Scoring (UQLM-inspired)
- [x] `src/lib/skills/confidence-scoring.ts` — 3-pass Gemini engine (temps 0.2/0.4/0.6)
- [x] Agreement scoring (Levenshtein-based text similarity across 3 passes)
- [x] Contradiction detection (cross-pass pattern matching)
- [x] Cost-aware trigger: text-only → no scoring; image + (ambiguity|request) → scoring
- [x] `src/app/api/confidence/route.ts` — background scoring endpoint
- [x] DB migration `00002_confidence_logs.sql` — calibration logging table
- [x] Frontend integration: background POST on photo send, non-blocking
- [x] UI display: CONFIANCE DIAGNOSTIQUE + ACCORD INTER-ANALYSES under diagnosis
- [x] Contradiction warning (amber box when contradictionDetected)
- [x] Low-confidence safeguard (<50% → suppress treatments, prompt for more data)

---

## PENDING

### Phase 6 — Load Testing
- [ ] k6 baseline (10 concurrent, 5 min)
- [ ] k6 stress (ramp to 50 concurrent)
- [ ] Request queuing for Gemini rate limit
- [ ] Worker CPU time verification

### Phase 7 — Deploy
- [ ] Production secrets set (`wrangler secret put GEMINI_API_KEY`)
- [ ] Cloudflare Pages production deployment
- [ ] Supabase production project (separate from dev)
- [ ] Smoke test on production (login → observation → AI → report)
- [ ] README — full setup, deployment, architecture docs

---

## SYSTEM FLOW

```
User → [Login/Auth] → Dashboard
                        ├─ Sessions List → [Session Chat ←→ Cloudflare Worker → Gemini]
                        │                    └─ Background → /api/confidence → 3-pass Gemini scoring
                        ├─ New Observation → [Multi-step form → AI analysis → saved]
                        ├─ Lab Analysis → [Soil/Water params → AI interpretation → saved]
                        └─ Report → [Session transcript → AI → Field Report → Download]
```

All features serve the agent workflow end-to-end. No orphan code.

---

## FILE STRUCTURE (Final)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── sessions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── observe/page.tsx
│   │   ├── lab/page.tsx
│   │   └── reports/[id]/page.tsx
│   ├── api/upload/route.ts
│       └── confidence/route.ts
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── index.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── skills/
│   │   ├── system-prompt-builder.ts
│   │   └── skill-trigger-detector.ts
│   └── utils/
│       ├── config.ts
│       ├── connection.ts
│       ├── db-types.ts
│       ├── image-compress.ts
│       ├── lang-context.tsx
│       └── theme.ts
├── worker/
│   ├── index.ts
│   ├── rate-limit.ts
│   └── sanitize.ts
├── supabase/
│   └── migrations/00001_schema.sql
├── public/
│   ├── manifest.json
│   └── _headers
├── wrangler.toml
└── .env.local.template
```
