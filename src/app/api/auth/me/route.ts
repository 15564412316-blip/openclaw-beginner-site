import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const phone = cookieStore.get("oc_user_phone")?.value ?? "";
  if (!phone) {
    return NextResponse.json({ ok: true, loggedIn: false }, { status: 200 });
  }
  return NextResponse.json(
    { ok: true, loggedIn: true, phone },
    { status: 200 }
  );
}
