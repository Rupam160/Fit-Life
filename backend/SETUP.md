# FitTrack Pro — Setup Guide

## Prerequisites
- Node.js 18+ installed
- A [Supabase](https://supabase.com) account

---

## Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Choose a name (e.g. `fittrack-pro`), a strong database password, and your region
3. Wait ~2 minutes for provisioning

---

## Step 2 — Run the Database SQL

In your Supabase project, go to **SQL Editor** and run these files **in order**:

1. `backend/supabase/schema.sql` — Creates all tables and triggers
2. `backend/supabase/policies.sql` — Enables Row-Level Security
3. `backend/supabase/functions.sql` — Creates streak, calendar, calorie functions
4. `backend/supabase/seed.sql` — Creates the avatars storage bucket

Paste each file's content and click **Run**.

---

## Step 3 — Get Your API Keys

Go to **Project Settings → API** and copy:

| Key | Where to find |
|-----|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | "Project URL" |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | "anon / public" key |
| `SUPABASE_SERVICE_ROLE_KEY` | "service_role" key (keep secret!) |

---

## Step 4 — Configure Environment Variables

In `frontend/`, copy the example file:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your actual values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Step 5 — Enable Email Auth

1. Go to **Authentication → Providers → Email**
2. Enable **Email Provider**
3. Set **Confirm email** → enabled (recommended) or disabled for dev

---

## Step 6 — Enable Google OAuth

### 6a. Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client IDs**
4. Application type: **Web application**
5. Authorized redirect URIs — add:
   ```
   https://<your-project-id>.supabase.co/auth/v1/callback
   ```
6. Copy the **Client ID** and **Client Secret**

### 6b. Supabase Auth Settings

1. Go to **Authentication → Providers → Google**
2. Enable Google
3. Paste your **Client ID** and **Client Secret**
4. Save

### 6c. Add Site URL

1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to `http://localhost:3000` (dev) or your production URL
3. Add redirect URLs:
   ```
   http://localhost:3000/**
   https://your-production-domain.com/**
   ```

---

## Step 7 — Install & Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 8 — Production Deployment (Optional)

Deploy to [Vercel](https://vercel.com):

```bash
cd frontend
npx vercel
```

Add all environment variables in Vercel project settings.
Update `NEXT_PUBLIC_SITE_URL` to your production domain.
Update Supabase **Site URL** and redirect URIs to match.

---

## Supabase Storage Notes

- Avatars are stored in the `avatars` bucket (public read)
- Files are scoped per user: `avatars/{user_id}/avatar.{ext}`
- Max file size: 2MB (enforced in the frontend upload component)
