# Formula Market (Farm-Gate Direct Produce Marketplace)

Real-time farm price discovery and direct farmer-to-buyer agricultural marketplace built with Next.js / TanStack Start + Vite + Supabase Realtime.

---

## 🚀 Supabase Shared Database & Realtime Setup

To enable listings to synchronize across all devices in real-time, configure Supabase credentials and execute the database migration.

### 1. Required Environment Variables

Add the following to your local `.env.local` AND in **Vercel Project Settings → Environment Variables** (for **Production**, **Preview**, and **Development**):

```bash
# Supabase Project URL & Anon Key (From Supabase Dashboard -> Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_your_key_here

# Vite environment aliases (automatically supported)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_your_key_here
```

### 2. Run Database Migration

Open your **Supabase Dashboard → SQL Editor → New Query**, paste the contents of [`supabase/migrations/20261008000000_create_listings_and_public_view.sql`](./supabase/migrations/20261008000000_create_listings_and_public_view.sql), and click **Run**.

This migration sets up:

- **`public.listings`**: Shared table for all harvest lots across devices.
- **Row Level Security (RLS)**: Enforces access control, allowing anyone to view active listings while protecting owner writes.
- **`public.public_listings`**: Privacy view omitting farmer phone numbers for unauthenticated visitors.
- **`public.verified_buyer_listings`** & **`get_listing_contact` RPC**: Exposes direct phone numbers only to verified, signed-in buyers.
- **Realtime Publication**: Executes `ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;` so buyer screens update immediately on inserts.

> **Note**: Verify in **Supabase Dashboard → Database → Publications → `supabase_realtime`** that the `listings` table toggle is turned **ON**.
> In **Vercel**, after adding `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, trigger a **Redeploy** of your latest deployment so the environment variables take effect in the production build.

---

## 📲 Cross-Device Testing Flow

1. Open `http://localhost:5173/sell` (or your Vercel deployment URL `/sell`) on **Device A** (e.g., Desktop).
2. Open `/buy` on **Device B** (e.g., Mobile phone or an Incognito browser window).
3. On **Device A**, select a crop, state, district, and mandi, set quantity and ask price, enter your phone number, and click **Post listing**.
4. Within seconds, **Device B** will automatically display the new harvest lot in the marketplace feed with a `LIVE NEW` badge without requiring manual page refresh.
5. On **Device B**, when signed out, the farmer's phone number is securely masked (`Sign in to view farmer contact`); once signed in as a buyer, the phone number and call button are unlocked.

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run build
npm run build

# Run linter
npm run lint
```
