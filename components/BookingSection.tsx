"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Slot } from "@/lib/types";

type BookingState = {
  name: string;
  email: string;
  linkedinUrl: string;
  organization: string;
  discussionTopic: string;
};

const initialForm: BookingState = {
  name: "",
  email: "",
  linkedinUrl: "",
  organization: "",
  discussionTopic: ""
};

export function BookingSection() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [duration, setDuration] = useState<15 | 30>(30);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState<BookingState>(initialForm);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    fetch(`/api/availability?duration=${duration}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setSlots([]));
  }, [duration]);

  const filteredSlots = useMemo(
    () => slots.filter((slot) => slot.durationMinutes === duration),
    [slots, duration]
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSlot) {
      setStatus("Please pick a time slot first.");
      return;
    }

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slotStart: selectedSlot.start,
        slotEnd: selectedSlot.end,
        durationMinutes: selectedSlot.durationMinutes
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      setStatus(payload.error ?? "Booking failed.");
      return;
    }

    setStatus(`Booked! Meet link: ${payload.meetLink}`);
    setForm(initialForm);
    setSelectedSlot(null);
  }

  return (
    <section className="section-container" id="booking">
      <h2 className="font-serif text-4xl">Book a coffee chat</h2>
      <p className="mt-3 max-w-2xl text-slateDeep/80">
        Pick an open time from Google Calendar-powered availability. Slots include a 15-minute
        buffer to keep each conversation intentional and unrushed.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="rounded-2xl border border-powder/70 bg-white/70 p-6">
          <div className="mb-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDuration(15)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                duration === 15 ? "bg-powder" : "bg-powder/30 hover:bg-powder/60"
              }`}
            >
              15 min
            </button>
            <button
              type="button"
              onClick={() => setDuration(30)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                duration === 30 ? "bg-powder" : "bg-powder/30 hover:bg-powder/60"
              }`}
            >
              30 min
            </button>
          </div>

          <div className="grid max-h-80 gap-2 overflow-y-auto pr-2">
            {filteredSlots.length === 0 && <p>No availability right now.</p>}
            {filteredSlots.map((slot) => {
              const isActive = selectedSlot?.start === slot.start;
              return (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-powderHover bg-powder/60"
                      : "border-powder/70 bg-white hover:bg-powder/30"
                  }`}
                >
                  {new Date(slot.start).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short"
                  })}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-powder/70 bg-white/70 p-6">
          <div className="grid gap-4">
            {[
              ["name", "Name", "text"],
              ["email", "Email", "email"],
              ["linkedinUrl", "LinkedIn URL", "url"],
              ["organization", "School/Company", "text"]
            ].map(([key, label, type]) => (
              <label key={key} className="grid gap-1 text-sm">
                {label}
                <input
                  required
                  type={type}
                  value={form[key as keyof BookingState]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="rounded-lg border border-powder/70 bg-beige px-3 py-2"
                />
              </label>
            ))}

            <label className="grid gap-1 text-sm">
              What would you like to discuss?
              <textarea
                required
                rows={4}
                value={form.discussionTopic}
                onChange={(e) => setForm((prev) => ({ ...prev, discussionTopic: e.target.value }))}
                className="rounded-lg border border-powder/70 bg-beige px-3 py-2"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-5 rounded-full bg-powder px-6 py-3 font-medium transition hover:bg-powderHover"
          >
            Confirm booking
          </button>

          {status && <p className="mt-4 text-sm text-slateDeep/80">{status}</p>}
        </form>
      </div>
    </section>
  );
}
