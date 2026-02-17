import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone } = body;

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مطلوب" },
        { status: 400 }
      );
    }

    // Insert into waitlist
    const { data, error } = await supabase
      .from("waitlist")
      .insert({
        email: email.trim().toLowerCase(),
        name: name?.trim() || null,
        phone: phone?.trim() || null,
        source: "website",
      })
      .select()
      .single();

    if (error) {
      // Duplicate email
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "هذا البريد مسجل مسبقاً!", errorEn: "This email is already registered!" },
          { status: 409 }
        );
      }
      console.error("Waitlist error:", error);
      return NextResponse.json(
        { error: "حدث خطأ، حاول مرة أخرى", errorEn: "Something went wrong, please try again" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "تم التسجيل بنجاح! 🎉", messageEn: "Successfully registered! 🎉" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "حدث خطأ، حاول مرة أخرى", errorEn: "Something went wrong, please try again" },
      { status: 500 }
    );
  }
}
