# Pages Spec: FinIntel Client

Next.js (App Router) + TypeScript + shadcn/ui + Tailwind. Backend: FastAPI at `NEXT_PUBLIC_API_BASE`.
Build one page at a time, in this order: layout/theme, login, register, landing, main app.

## Routes
| Route | Page | Access |
|---|---|---|
| `/` | Landing | Public (redirect to `/app` if signed in) |
| `/login` | Login | Public only (redirect to `/app` if signed in) |
| `/register` | Registration | Public only |
| `/app` | Main agent workspace | Signed-in only |

Route groups: `(marketing)` for `/`, `(auth)` for `/login` and `/register`, `(app)` for `/app`.
Protect `/app` with `middleware.ts` (check the session cookie, redirect to `/login?next=/app`).

## Auth contract (existing backend, do not change)
- `POST /api/auth/signup` and `POST /api/auth/login`, body `{ email, password }`
  - Success: `{ token, email, profile, answers }`
  - Errors: 400 on signup (invalid email, password under 8 chars, email exists), 401 on login
- `GET /api/me` with `Authorization: Bearer <token>` returns `{ email, profile, answers }`
- `PUT /api/me/profile` with body `{ profile, answers }`
- Store the token in an httpOnly, SameSite=Lax cookie, set by Next.js route handlers (`app/api/auth/*`) that proxy to FastAPI. Never put the token in localStorage.
- Sign out clears the cookie and redirects to `/`.

## 1. Landing page (`/`)
Purpose: explain the product in 10 seconds and send people to register.
Sections, top to bottom:
1. Navbar: logo, links (Features, How it works), `Login` (ghost button), `Get started` (primary button)
2. Hero: headline, one-line subheading, primary CTA to `/register`, secondary CTA to `/login`
3. Features grid (shadcn `Card`, 6 cards): Analyst agent, Chat, War Room (bull vs bear), Portfolio risk audit, Backtest, Research report
4. How it works (3 steps): ask, review the agent's proposal, approve or redirect
5. Trust strip: "Human approval on every action", "Compliance-screened answers", "Live vs sample data always labelled"
6. Footer: disclaimer "Not investment advice. Demonstration of agentic architecture."
Requirements: fully responsive, dark/light mode, no data fetching, server component.

## 2. Login page (`/login`)
- Centred shadcn `Card`: email, password (show/hide toggle), `Sign in` button, link to `/register`
- Validate with `react-hook-form` + `zod` (valid email, password required)
- On submit: call `/api/auth/login`, then redirect to `?next` or `/app`
- Show server errors in a shadcn `Alert` (use a generic "Invalid email or password.")
- Disable the button and show a spinner while submitting
- Do not reveal whether an email exists

## 3. Registration page (`/register`)
- Same layout as login: email, password, confirm password, `Create account` button, link to `/login`
- zod rules: valid email, password at least 8 characters, passwords match
- Password strength hint (text only, not a blocker beyond the 8-character rule)
- On success: the backend returns a token, so set the cookie and redirect to `/app`
- Then open the Risk Profile dialog once (see main page)
- Show 400 errors inline (email already registered, invalid email)

## 4. Main app (`/app`)
Layout: top bar + sidebar/tabs + content area + collapsible chat panel.

Top bar: logo, risk-profile badge (opens dialog), user menu (email, Sign out), theme toggle.

Tabs (one component each, in `components/agents/`):
Analyst, Brief, Discover, Portfolio, War Room, Ecosystem, Report, Backtest.
Chat is a side panel available on every tab.

Shared pieces (build these first):
- `useEventStream(url)`: reads SSE via `fetch` + stream reader, parses `data: {json}`, stops on `{"type":"done"}`, exposes `events`, `status`, `error`, `cancel()`
- `ApprovalGate`: shows the proposal, buttons Approve / Reject (or Stop) / Revise (with a text input); resumes using the SAME thread UUID
- `TickerSearch`: shadcn `Command` + `Popover`, debounced call to `/api/symbols?q=`
- `Timeline`: renders agent steps as cards, with markdown for text
- `PriceChart`: area chart (recharts), green/red by `change_pct`
- `DataSourceBadge`: shows "Live" or "Sample data" from the `source` field
- `Disclaimer`: footer text on every agent result
- `RiskProfileDialog`: 5 questions, score maps to conservative (<=5), balanced (<=10), aggressive; saves with `PUT /api/me/profile`

Rules:
- Generate the thread id with `crypto.randomUUID()` for each new run
- Chat is disabled until a ticker is selected (the backend returns 422 without one)
- Pass the saved risk profile to chat, portfolio and stress requests
- Cancel any open stream on unmount or when a new run starts
- Mark components that use state or streams with `"use client"`

## Folder layout
client/
  app/
    (marketing)/page.tsx
    (auth)/login/page.tsx
    (auth)/register/page.tsx
    (app)/app/page.tsx
    api/auth/[...action]/route.ts
  components/ui/            (shadcn)
  components/agents/        (one file per tab)
  components/shared/        (ApprovalGate, Timeline, PriceChart, ...)
  lib/api.ts  lib/auth.ts  lib/useEventStream.ts
  middleware.ts

## shadcn components to install
button card input label form alert dialog tabs command popover dropdown-menu
badge skeleton sonner table sheet separator switch

## States every page must handle
Loading (skeleton or spinner), empty (helpful prompt), error (alert with retry), and offline backend ("Cannot reach the server").

## Acceptance criteria
- [ ] A new user can register, land on `/app`, and see the risk-profile dialog
- [ ] A returning user can log in and is sent to `/app` (or `?next`)
- [ ] Visiting `/app` signed out redirects to `/login`
- [ ] Refreshing `/app` keeps the session
- [ ] An agent run streams live, pauses at an approval gate, and resumes after a decision
- [ ] No token or secret appears in localStorage, source code, or the browser console
- [ ] Every agent result shows the disclaimer and the Live/Sample badge
- [ ] Works on mobile, and in both dark and light mode