import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const { data, error: dbError } = await supabaseAdmin
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  // Build CSV
  const headers = ["Email", "Name", "Phone", "Source", "Created At"];
  const rows = (data || []).map((entry: any) => [
    entry.email,
    entry.name || "",
    entry.phone || "",
    entry.source || "",
    entry.created_at,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row: string[]) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
