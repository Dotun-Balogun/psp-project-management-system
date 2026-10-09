# Plapoly Projects

Web-based student project management system for the School of ICT, Plateau State Polytechnic, Barkin Ladi.
Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui style components, React Hook Form, Zod and Supabase. Package manager: pnpm.

> Status: every screen is built as a design with sample data. Login, sign-up and the database are not connected yet.

## 1. What you need installed

| Tool | Why | Get it |
|---|---|---|
| Node.js 20 or newer (22 recommended) | runs the app | https://nodejs.org |
| pnpm | installs packages | after Node: `npm install -g pnpm` |
| Git | optional, for version control | https://git-scm.com |
| VS Code | editor | https://code.visualstudio.com |

Check your setup in a terminal:

```bash
node -v
pnpm -v
```

## 2. Get the project running

```bash
cd plapoly          # open the project folder
pnpm install        # download packages (first time only)
pnpm dev            # start the app
```

Open http://localhost:3000. Stop the app with Ctrl+C.

## 3. Environment variables

The project reads keys from files in the project root.

| File | Purpose |
|---|---|
| `.env` | Your real keys. Already filled in. Never share or upload it. |
| `.env.local` | Format example only (all lines commented). Uncomment a line to override `.env` on your own machine. |
| `.env.example` | Safe template to share with teammates. |

| Variable | Meaning | Safe in browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project address | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public key. Row Level Security protects the data | Yes |
| `SUPABASE_SECRET_KEY` | Admin key for inviting users, deactivating accounts, resetting passwords | **No. Server code only** |

Rules: never put the secret key in a variable starting with `NEXT_PUBLIC_`, never paste it in chat, and never commit `.env`. If it leaks, open Supabase, Project Settings, API Keys, create a new secret key and delete the old one. After editing any env file, restart `pnpm dev`.

## 4. Try the screens

Open http://localhost:3000/login and use the "Design preview" links, or go directly:

- Student: `/student/dashboard`
- Supervisor: `/supervisor/dashboard`
- Admin: `/admin/dashboard`
- Public: `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/invite/activate`, `/no-access`

Student matric format: `PSP/SICT/CSC1/ND/24/0010`.

## 5. Supabase and migrations (Supabase CLI)

Migrations are SQL files in `supabase/migrations/`. Run these once Docker Desktop is installed (needed for local Supabase only):

```bash
pnpm dlx supabase login                         # sign in
pnpm dlx supabase link --project-ref ssnjkadiywlpsgxyqweq
pnpm dlx supabase db push                       # apply migrations to the hosted project
pnpm dlx supabase start                         # optional: run a local copy
```

Note: the migration currently in the repo is an early draft and will be replaced to match the final table list (profiles, projects, topics, documents, progress, feedback, messages, notifications, assignments, activity logs, announcements, settings). Do not push it to production.

Create a new migration with `pnpm dlx supabase migration new add_something`.

## 6. Folder guide

```
src/app/            pages (each folder is a URL)
  student/ supervisor/ admin/   role areas, each with its own layout
src/components/     shared pieces (shell, blocks, crest, ui/)
src/lib/            schemas.ts (Zod rules), mock.ts, supabase/ clients
public/crest.png    the school crest
supabase/migrations SQL files
```

Supabase clients: `client.ts` for the browser, `server.ts` for server code, `admin.ts` for secret-key actions (server only).

## 7. Commands

| Command | What it does |
|---|---|
| `pnpm dev` | run locally |
| `pnpm build` | production build, also finds type errors |
| `pnpm start` | run the production build |
| `pnpm exec eslint .` | check code style |

## 8. Troubleshooting

- `pnpm: command not found`: run `npm install -g pnpm`.
- Port 3000 busy: `pnpm dev -p 3001`.
- Changed `.env` but nothing changed: stop and restart `pnpm dev`.
- Odd errors after switching branches: delete the `.next` folder and `node_modules`, then `pnpm install`.
- Adding shadcn components: `pnpm dlx shadcn@latest add dialog` (needs internet).

## 9. Connect Supabase (do these in order)

1. **Apply the schema:** `pnpm dlx supabase login`, `pnpm dlx supabase link --project-ref ssnjkadiywlpsgxyqweq`, then `pnpm dlx supabase db push`.
2. **Seed sample data:** `pnpm seed`. It creates an admin, 2 supervisors and 8 students, all with password `Plapoly@2026`:
   `admin@plapoly.edu.ng`, `mangut@plapoly.edu.ng`, `hannatu@plapoly.edu.ng`, `student1@plapoly.edu.ng` to `student8@plapoly.edu.ng`. Students can also sign in with their matric number, for example `PSP/SICT/CSC1/ND/24/0010`.
3. **Redirect URLs:** Supabase dashboard, Authentication, URL Configuration. Site URL `http://localhost:3000`, and add `http://localhost:3000/**` to Redirect URLs.
4. **Email templates** (Authentication, Emails). Change each link to this form so verification, invites and password resets work:
   - Confirm signup: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&next=/login`
   - Invite user: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/invite/activate`
   - Reset password: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password`
5. **Email limits:** the built-in sender allows only a few emails an hour. For real use add an SMTP provider (Authentication, Emails, SMTP Settings).
6. **Route protection** lives in `src/proxy.ts` (Next.js 16 uses `proxy.ts`; with a `src/` folder it sits inside `src/`). Database protection is Row Level Security in the migration.

Roles: students and supervisors both self-register on the Register page by choosing their role. A supervisor gets an ID such as PSP-SUP-ICT-003 and appears on the admin Supervisors page straight away. Admin accounts come only from the seed script or an invite sent by an existing admin. After pulling this update run `pnpm dlx supabase db push` again to apply the new migration.
