"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { trackPurchase } from "@/lib/tracking";

interface SessionData {
  plan: string | null;
  amount: number;
  currency: string;
  paid: boolean;
  sessionId: string;
}

const planNames: Record<string, { ar: string; en: string }> = {
  plus: { ar: "مهرة بلس", en: "Mohra Plus" },
  family: { ar: "مهرة عائلي", en: "Mohra Family" },
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    async function verifySession() {
      try {
        const res = await fetch(`/api/payments/session?session_id=${sessionId}`);
        const data: SessionData = await res.json();

        if (!res.ok || !data.paid) {
          setStatus("error");
          return;
        }

        setSessionData(data);
        setStatus("success");

        // Fire Purchase conversion event (only once)
        if (!trackedRef.current && data.plan && data.amount > 0) {
          trackedRef.current = true;
          trackPurchase({
            transactionId: sessionId!,
            plan: data.plan,
            value: data.amount,
            currency: data.currency,
          });
        }
      } catch {
        setStatus("error");
      }
    }

    verifySession();
  }, [sessionId]);

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-16 h-16 text-[#7C5CFC] animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-[#2D2D3F] mb-2">جارٍ تأكيد الدفع...</h1>
          <p className="text-[#6B7280]">يرجى الانتظار بينما نتحقق من عملية الدفع</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-20 h-20 bg-[#44D4A0]/15 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-[#44D4A0]" />
          </div>
          <h1 className="text-2xl font-bold text-[#2D2D3F] mb-2">تم الاشتراك بنجاح! 🎉</h1>
          <p className="text-[#6B7280] mb-2">
            شكراً لاشتراكك في مهرة. يمكنك الآن الاستمتاع بجميع الميزات المتاحة لخطتك.
          </p>
          {sessionData?.plan && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC] font-bold text-sm mb-6">
              {planNames[sessionData.plan]?.ar || sessionData.plan}
              {sessionData.amount > 0 && (
                <span className="text-[#7C5CFC]/70 font-normal">
                  — {sessionData.amount} {sessionData.currency}
                </span>
              )}
            </div>
          )}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3.5 rounded-xl font-bold text-white text-center"
              style={{ background: "linear-gradient(135deg, #7C5CFC 0%, #9D85FD 100%)" }}
            >
              العودة للرئيسية
            </Link>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-[#2D2D3F] mb-2">حدث خطأ</h1>
          <p className="text-[#6B7280] mb-8">
            لم نتمكن من تأكيد عملية الدفع. إذا تم خصم المبلغ، سيتم تفعيل اشتراكك تلقائياً خلال دقائق.
          </p>
          <Link
            href="/"
            className="block w-full py-3.5 rounded-xl font-bold text-white text-center"
            style={{ background: "linear-gradient(135deg, #7C5CFC 0%, #9D85FD 100%)" }}
          >
            العودة للرئيسية
          </Link>
        </>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F7FF] to-[#F0F9FF] p-6" dir="rtl">
      <Suspense
        fallback={
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
            <Loader2 className="w-16 h-16 text-[#7C5CFC] animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-[#2D2D3F] mb-2">جارٍ تأكيد الدفع...</h1>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
