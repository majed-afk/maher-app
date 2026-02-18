import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const { error, admin } = await requireAdmin();
  if (error) return error;
  return NextResponse.json({ admin });
}
