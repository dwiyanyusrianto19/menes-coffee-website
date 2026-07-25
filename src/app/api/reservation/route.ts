import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, date, time, guests, notes } = body;

    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: "Semua field wajib diisi kecuali catatan" },
        { status: 400 }
      );
    }

    await db.reservation.create({
      data: {
        name: String(name).slice(0, 100),
        phone: String(phone).slice(0, 20),
        date: String(date),
        time: String(time),
        guests: String(guests),
        notes: notes ? String(notes).slice(0, 500) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
