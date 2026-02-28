import { NextRequest, NextResponse } from "next/server";
import { ensureEnv } from "@/lib/env";
import { getGoogleCalendarClient } from "@/lib/google";
import type { Slot } from "@/lib/types";

const BUFFER_MINUTES = 15;

export async function GET(request: NextRequest) {
  const duration = Number(request.nextUrl.searchParams.get("duration") ?? "30") as 15 | 30;
  const calendar = getGoogleCalendarClient();
  const config = ensureEnv();
  const now = new Date();
  const endWindow = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14);

  const busy = await calendar.freebusy.query({
    requestBody: {
      timeMin: now.toISOString(),
      timeMax: endWindow.toISOString(),
      items: [{ id: config.GOOGLE_CALENDAR_ID }]
    }
  });

  const busyRanges = busy.data.calendars?.[config.GOOGLE_CALENDAR_ID]?.busy ?? [];
  const slots: Slot[] = [];

  for (let day = 0; day < 14; day += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + day);
    date.setHours(10, 0, 0, 0);

    for (let i = 0; i < 8; i += 1) {
      const start = new Date(date.getTime() + i * (duration + BUFFER_MINUTES) * 60000);
      const end = new Date(start.getTime() + duration * 60000);
      if (end.getHours() >= 18) continue;

      const overlapsBusy = busyRanges.some((range) => {
        const busyStart = new Date(range.start ?? "").getTime();
        const busyEnd = new Date(range.end ?? "").getTime();
        return start.getTime() < busyEnd && end.getTime() > busyStart;
      });

      if (!overlapsBusy && start > now) {
        slots.push({
          start: start.toISOString(),
          end: end.toISOString(),
          durationMinutes: duration
        });
      }
    }
  }

  return NextResponse.json({ slots });
}
