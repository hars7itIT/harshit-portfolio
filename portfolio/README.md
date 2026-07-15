# Harshit Gupta — Portfolio

A real, working Next.js 14 + TypeScript + Tailwind portfolio. Terminal / builder-themed:
the hero boots like a shell session, project cards open like files, and a real AI chat
widget answers questions about you using your own Anthropic API key.

## What's actually here (no placeholders pretending to be features)

- Full responsive site: Hero, About, Education, Skills, Experience, Projects, Achievements,
  Coding Profiles, Contact — all real components, real content about your WanderLust, FixIQ,
  and UIET Attendance Tracker projects.
- Working AI chat assistant (`/api/chat`) — calls the Anthropic API server-side, so your key
  is never exposed to the browser. Falls back to a clear message if no key is set yet.
- Real contact-form email sending (`/api/contact`) via [Resend](https://resend.com) — falls back
  to opening the visitor's own email client if no key is configured yet, so the form always works.
- Live GitHub stats (public repos, followers, total stars) pulled straight from the GitHub public
  API once you set a real username in `data/profiles.ts`.
- Vercel Analytics wired in (`@vercel/analytics`) — page views and visitor counts show up in your
  Vercel dashboard automatically once deployed, no extra setup.
- Dark/light mode toggle (persisted in localStorage).
- Command palette (Ctrl+K / Cmd+K) to jump sections, toggle theme, download resume.
- Scroll progress bar, custom cursor (desktop only), ambient canvas particle background —
  all respecting `prefers-reduced-motion`.
- A generated, ATS-friendly one-page resume at `public/resume.pdf` (edit `scripts/generate_resume.py`
  and rerun it any time your info changes).
- SEO metadata (title, description, Open Graph, Twitter card) in `app/layout.tsx`.

## What is NOT here yet (be honest with yourself about scope)

The original brief asked for auth, an admin dashboard, a CMS/blog, live coding-profile stats,
CI/CD, Docker, and enterprise security middleware. Building all of that for real is a multi-week
project on its own, not something to fake with static text. Below is a realistic phase 2 so you
know exactly what's left and roughly how to tackle it:

| Feature | Effort | Where to start |
|---|---|---|
| Auth (email/Google/GitHub) | Medium | Add [Auth.js](https://authjs.dev) — mainly relevant once you have a dashboard or blog worth gating |
| Admin dashboard + Blog/CMS | Medium-High | New `/admin` route + Prisma/PostgreSQL for posts; or just use a headless CMS (e.g. Sanity) instead of building one |
| CI/CD | Low | A basic GitHub Actions workflow running `npm run build` on push takes ~20 lines of YAML |
| Docker | Low | A standard Next.js `Dockerfile` (multi-stage build) — add if you need it for a non-Vercel host |
| Enterprise security (CSRF, rate limiting, audit logs) | Medium | Mostly matters once you have real user accounts/data to protect — Vercel already handles a lot at the edge |

Don't build these because a checklist said so — build each one when a real feature needs it.

## Setup

```bash
npm install
cp .env.example .env.local
# paste keys into .env.local:
#  - ANTHROPIC_API_KEY (https://console.anthropic.com/) enables the AI chat widget
#  - RESEND_API_KEY (https://resend.com/) makes the contact form send real email
npm run dev
```

Open http://localhost:3000.

## Before you make it public

1. **`data/projects.ts`** — add real GitHub repo links (`github:` field) and live demo URLs (`demo:` field) once WanderLust is deployed.
2. **`data/profiles.ts`** — replace every `yourhandle` / `you@example.com` placeholder with your real handles, email, and phone.
3. **`scripts/generate_resume.py`** — update with the same real contact details, then rerun:
   ```bash
   python3 scripts/generate_resume.py && mv scripts/resume.pdf public/resume.pdf
   ```
4. **`data/timeline.ts`** and **`data/profiles.ts` → `achievements`** — add any hackathons, certifications, or awards as they happen.

## Deploying

The fastest path is Vercel (built by the makers of Next.js, zero-config for this repo):

1. Push this folder to a GitHub repo.
2. Import it at https://vercel.com/new.
3. Add the `ANTHROPIC_API_KEY` and `RESEND_API_KEY` environment variables in the Vercel project settings (same values as your `.env.local`).
4. Deploy. Every future push to `main` redeploys automatically — that's your CI/CD for a static/serverless site like this one.

## Project structure

```
app/
  layout.tsx        — fonts, metadata/SEO, global providers
  page.tsx           — assembles all sections
  api/chat/route.ts  — server-side AI chat endpoint
components/          — one file per section/UI piece
data/                — your real content (projects, skills, timeline, profiles)
scripts/             — generate_resume.py regenerates public/resume.pdf
```
