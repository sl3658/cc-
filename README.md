# Coffee Chat Booking (Next.js + Supabase + Google Calendar)

Single-page coffee chat booking website for school networking and LinkedIn career conversations.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- Google OAuth + Google Calendar API
- Vercel deployment

## Folder Structure

```text
app/
  admin/page.tsx
  api/
    availability/route.ts
    bookings/route.ts
    admin/
      chats/route.ts
      availability/route.ts
  auth/callback/route.ts
  layout.tsx
  page.tsx
components/
  Hero.tsx
  BookingSection.tsx
  About.tsx
  Footer.tsx
lib/
  auth.ts
  booking.ts
  env.ts
  google.ts
  supabase.ts
  types.ts
supabase/
  schema.sql
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env.local
   ```
3. Configure Supabase schema by running SQL in `supabase/schema.sql`.
4. Start dev server:
   ```bash
   npm run dev
   ```

## Google API Setup
1. Create a Google Cloud project.
2. Enable **Google Calendar API** and **Google People API**.
3. Configure OAuth consent screen.
4. Create OAuth client credentials (Web application).
5. Set authorized redirect URI to `http://localhost:3000/auth/callback`.
6. Generate refresh token with calendar scope and add to `GOOGLE_REFRESH_TOKEN`.
7. Add admin emails to `ADMIN_EMAILS` (comma-separated).

## Booking Flow
- Client fetches availability from `/api/availability` (Google Calendar free/busy).
- User submits booking form to `/api/bookings`.
- Server validates payload and executes `book_chat_slot` RPC in Supabase.
- RPC uses advisory lock + overlap check to prevent race conditions/double booking.
- Server creates Google Calendar event with Meet link and 24h reminder.
- Supabase record updated to `confirmed` with `google_event_id` and `meet_link`.

## Admin Dashboard
- Route: `/admin`
- Uses Google OAuth callback at `/auth/callback`.
- Signed HTTP-only session cookie for protected access.
- Admin can view upcoming chats; API route exists to set availability overrides.

## Environment Variables
See `.env.example`.

## Deployment (Vercel)
1. Push repository to GitHub.
2. Import project into Vercel.
3. Add all environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to production URL.
5. Update Google OAuth redirect URI with production callback URL.
6. Deploy.

## Notes
- Confirmation email sending is prepared with SMTP env vars; wire to your preferred provider in `lib/booking.ts`.
- For cancel/reschedule, add admin actions that call Google Calendar `events.patch`/`events.delete` and update Supabase status.
