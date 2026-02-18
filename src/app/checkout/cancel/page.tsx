"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F7FF] to-[#F0F9FF] p-6" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
        <div className="w-20 h-20 bg-[#F59E0B]/15 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-[#F59E0B]" />
        </div>

        <h1 className="text-2xl font-bold text-[#2D2D3F] mb-2">تم إلغاء عملية الدفع</h1>
        <p className="text-[#6B7280] mb-8">
          لم يتم إجراء أي خصم من حسابك. يمكنك المحاولة مرة أخرى في أي وقت.
        </p>

        <div className="space-y-3">
          <Link
            href="/#pricing"
            className="block w-full py-3.5 rounded-xl font-bold text-white text-center"
            style={{ background: "linear-gradient(135deg, #7C5CFC 0%, #9D85FD 100%)" }}
          >
            العودة لصفحة الأسعار
          </Link>
          <Link
            href="/"
            className="block w-full py-3.5 rounded-xl font-bold text-[#7C5CFC] text-center border-2 border-[#7C5CFC]/20 hover:bg-[#7C5CFC]/5 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
