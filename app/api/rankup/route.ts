import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("rankup_pending");

  if (!cookie?.value) return NextResponse.json(null);

  // Clear it so it only fires once
  cookieStore.delete("rankup_pending");

  try {
    const data = JSON.parse(cookie.value);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null);
  }
}
