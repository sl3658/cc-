import Link from "next/link";
import { createGoogleAuthUrl } from "@/lib/google";
import { requireAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

async function getChats() {
  const { data } = await supabaseAdmin
    .from("coffee_chats")
    .select("*")
    .order("slot_start", { ascending: true })
    .limit(100);

  return data ?? [];
}

export default async function AdminPage() {
  const session = await requireAdminSession();
  if (!session) {
    return (
      <main className="section-container space-y-5">
        <h1 className="font-serif text-4xl">Admin dashboard</h1>
        <p>Use Google OAuth to access upcoming chats and manage availability.</p>
        <Link href={createGoogleAuthUrl()} className="inline-block rounded-full bg-powder px-6 py-3">
          Sign in with Google
        </Link>
      </main>
    );
  }

  const chats = await getChats();
  return (
    <main className="section-container">
      <h1 className="font-serif text-4xl">Upcoming chats</h1>
      <p className="mt-2 text-sm text-slateDeep/80">Signed in as {session.email}</p>
      <div className="mt-6 grid gap-3">
        {chats.length === 0 && <p>No upcoming bookings yet.</p>}
        {chats.map((chat) => (
          <article key={chat.id} className="rounded-xl border border-powder/70 bg-white/70 p-4">
            <p className="font-medium">{chat.name}</p>
            <p>{chat.email}</p>
            <p>{new Date(chat.slot_start).toLocaleString()}</p>
            <p className="text-sm text-slateDeep/70">Status: {chat.status}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
