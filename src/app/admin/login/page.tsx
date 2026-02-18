"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setLoading(false);
        return;
      }

      // Verify admin role via API
      const res = await fetch("/api/admin/auth");
      if (!res.ok) {
        await supabase.auth.signOut();
        setError("ليس لديك صلاحيات الإدارة");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("حدث خطأ في الاتصال");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#7C5CFC]/10 mb-4">
            <ShieldCheck className="w-8 h-8 text-[#7C5CFC]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة الإدارة</h1>
          <p className="text-gray-500 mt-1">مهرة — إدارة المنصة</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/50 focus:border-[#7C5CFC] transition-colors text-gray-900"
              placeholder="admin@mohra.app"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/50 focus:border-[#7C5CFC] transition-colors text-gray-900"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm py-3 px-4 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#7C5CFC] hover:bg-[#6B4CE0] text-white font-bold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                تسجيل الدخول
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
