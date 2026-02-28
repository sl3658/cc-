import { z } from "zod";
import { supabaseAdmin } from "./supabase";
import { getGoogleCalendarClient } from "./google";
import type { BookingInput } from "./types";
import { ensureEnv } from "./env";

const bookingSchema = z.object({
  slotStart: z.string().datetime(),
  slotEnd: z.string().datetime(),
  durationMinutes: z.union([z.literal(15), z.literal(30)]),
  name: z.string().min(2),
  email: z.string().email(),
  linkedinUrl: z.string().url(),
  organization: z.string().min(2),
  discussionTopic: z.string().min(8)
});

export async function validateAndCreateBooking(payload: unknown) {
  const booking = bookingSchema.parse(payload) as BookingInput;

  const { data: lockData, error: lockError } = await supabaseAdmin.rpc(
    "book_chat_slot",
    {
      p_start_time: booking.slotStart,
      p_end_time: booking.slotEnd,
      p_name: booking.name,
      p_email: booking.email,
      p_linkedin_url: booking.linkedinUrl,
      p_organization: booking.organization,
      p_discussion_topic: booking.discussionTopic,
      p_duration_minutes: booking.durationMinutes
    }
  );

  if (lockError || !lockData || lockData.length === 0) {
    throw new Error("Slot no longer available. Please pick another time.");
  }

  const record = lockData[0] as { id: string };

  const config = ensureEnv();
  const calendar = getGoogleCalendarClient();
  const eventResponse = await calendar.events.insert({
    calendarId: config.GOOGLE_CALENDAR_ID,
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Coffee Chat: ${booking.name}`,
      description: `${booking.discussionTopic}\nLinkedIn: ${booking.linkedinUrl}\n${booking.organization}`,
      start: { dateTime: booking.slotStart },
      end: { dateTime: booking.slotEnd },
      attendees: [{ email: booking.email }],
      reminders: {
        useDefault: false,
        overrides: [{ method: "email", minutes: 24 * 60 }]
      },
      conferenceData: {
        createRequest: {
          requestId: record.id,
          conferenceSolutionKey: { type: "hangoutsMeet" }
        }
      }
    }
  });

  await supabaseAdmin
    .from("coffee_chats")
    .update({
      google_event_id: eventResponse.data.id,
      meet_link: eventResponse.data.hangoutLink,
      status: "confirmed"
    })
    .eq("id", record.id);

  // Placeholder for transactional email integration.
  return {
    bookingId: record.id,
    meetLink: eventResponse.data.hangoutLink
  };
}
