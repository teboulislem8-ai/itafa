# Musa'id — مساعد الحقل / Assistant de Terrain

Bilingual (AR/FR) AI-powered field assistant for Algerian agricultural extension agents.

## Stack

- **Frontend:** Next.js 16 (App Router) + Tailwind CSS 4
- **AI Proxy:** Cloudflare Worker → Gemini 2.0 Flash
- **Database/Auth/Storage:** Supabase (PostgreSQL + Auth + Storage)
- **Hosting:** Cloudflare Pages (via @opennextjs/cloudflare)

## Setup

### Prerequisites

- Node.js 20+
- Supabase project (free tier)
- Google AI Studio account (free tier — Gemini API key)
- Cloudflare account (free tier)

### Environment

```bash
cp .env.local.template .env.local
# Fill in values:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - GEMINI_API_KEY
```

### Database

Run `supabase/migrations/00001_schema.sql` in your Supabase SQL editor to create all tables and RLS policies.

### Development

```bash
npm install
npm run dev        # Next.js on :3000
npx wrangler dev   # Worker on :8787
```

### Deploy Worker

```bash
npx wrangler deploy
npx wrangler secret put GEMINI_API_KEY
```

### Deploy Pages

```bash
npm run build
npx wrangler pages deploy .next
```

## Architecture

```
Client (Next.js) ←→ Cloudflare Worker (AI proxy) ←→ Gemini 2.0 Flash
        ↕
    Supabase (PostgreSQL + Auth + Storage)
```

The Worker builds a layered system prompt from 14 agricultural skills, detects context (observation, lab, decision, etc.) and language (AR/FR), and streams Gemini responses via SSE.

## Project Map

See `PROJECT_MAP.md` for detailed status of all phases.

## Routes

| Path | Description |
|---|---|
| `/` | Agent dashboard (stats, quick actions) |
| `/login` | Auth |
| `/register` | Registration |
| `/sessions` | Session list |
| `/sessions/[id]` | Chat with AI (text + photo + streaming) |
| `/observe` | Guided field observation form |
| `/lab` | Lab data interpreter (soil/water) |
| `/reports/[id]` | Field report viewer/export |
| `/api/upload` | Photo upload → Supabase Storage |

## Skills

The AI is grounded in 14 agricultural domains: agronomy, field observation, plant ID, data analysis, problem-solving, decision-making, adaptability, communication, local knowledge, project management, technology, experimental thinking, ethics, and continuous learning — all tuned for Algerian agricultural context.
