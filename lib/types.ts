export type Slot = {
  start: string;
  end: string;
  durationMinutes: 15 | 30;
};

export type BookingInput = {
  slotStart: string;
  slotEnd: string;
  durationMinutes: 15 | 30;
  name: string;
  email: string;
  linkedinUrl: string;
  organization: string;
  discussionTopic: string;
};

export type ChatRecord = BookingInput & {
  id: string;
  status: "confirmed" | "cancelled";
  meetLink: string | null;
  googleEventId: string | null;
  createdAt: string;
};
