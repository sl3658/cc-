import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { start, end, isAvailable } = body as {
    start: string;
    end: string;
    isAvailable: boolean;
  };

  const { error } = await supabaseAdmin.from("availability_overrides").upsert({
    start_time: start,
    end_time: end,
    is_available: isAvailable,
    updated_by: session.email
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
