import { NextRequest, NextResponse } from "next/server";
import { validateAndCreateBooking } from "@/lib/booking";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const response = await validateAndCreateBooking(payload);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Booking failed"
      },
      { status: 400 }
    );
  }
}
