"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

type Mode = "login" | "signup";

export default function AuthLoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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

      // Redirect to home or dashboard
      router.push("/");
      router.refresh();
    } catch {
      setError("حدث خطأ في الاتصال");
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      setLoading(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "user",
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("هذا البريد الإلكتروني مسجل مسبقاً");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      setSuccess("تم إنشاء حسابك بنجاح! تحقق من بريدك الإلكتروني لتفعيل الحساب.");
      setEmail("");
      setPassword("");
      setFullName("");
      setLoading(false);
    } catch {
      setError("حدث خطأ في الاتصال");
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setSuccess("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      dir="rtl"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #F8F7FF 0%, #EDE9FE 50%, #E0E7FF 100%)",
        }}
      />

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#7C5CFC]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#4DA6FF]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-[#44D4A0]/10 rounded-full blur-2xl" />

      <div className="relative w-full max-w-md z-10">
        {/* Logo / Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-block">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-3"
            >
              🦁
            </motion.div>
          </Link>
          <h1 className="text-2xl font-bold text-[#2D2D3F]">
            {mode === "login" ? "مرحباً بعودتك!" : "أنشئ حسابك"}
          </h1>
          <p className="text-[#6B7280] mt-1">
            {mode === "login"
              ? "سجّل دخولك لمتابعة رحلة التعلّم"
              : "ابدأ رحلة طفلك التعليمية مع مهرة"}
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl shadow-[#7C5CFC]/5 border border-gray-100 p-8"
        >
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                mode === "login"
                  ? "bg-white text-[#7C5CFC] shadow-sm"
                  : "text-[#6B7280] hover:text-[#2D2D3F]"
              }`}
            >
              <LogIn className="w-4 h-4" />
              تسجيل الدخول
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                mode === "signup"
                  ? "bg-white text-[#7C5CFC] shadow-sm"
                  : "text-[#6B7280] hover:text-[#2D2D3F]"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              حساب جديد
            </button>
          </div>

          <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
            {/* Full Name (signup only) */}
            {mode === "signup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-[#2D2D3F] mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pr-11 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/50 focus:border-[#7C5CFC] transition-colors text-[#2D2D3F]"
                    placeholder="اسم ولي الأمر"
                  />
                </div>
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#2D2D3F] mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                  className="w-full pr-11 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/50 focus:border-[#7C5CFC] transition-colors text-[#2D2D3F]"
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#2D2D3F] mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  minLength={6}
                  className="w-full pr-11 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/50 focus:border-[#7C5CFC] transition-colors text-[#2D2D3F]"
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
              {mode === "signup" && (
                <p className="text-xs text-[#6B7280] mt-1">
                  6 أحرف على الأقل
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 text-sm py-3 px-4 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            {/* Success */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 text-green-600 text-sm py-3 px-4 rounded-xl"
              >
                {success}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 px-4 text-white font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-[#7C5CFC]/25"
              style={{
                background:
                  "linear-gradient(135deg, #7C5CFC 0%, #9D85FD 100%)",
              }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === "login" ? (
                <>
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  إنشاء الحساب
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-[#6B7280]">أو</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Switch Mode */}
          <button
            onClick={switchMode}
            className="w-full py-3 text-sm text-[#7C5CFC] font-bold hover:bg-[#7C5CFC]/5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {mode === "login" ? (
              <>
                <UserPlus className="w-4 h-4" />
                ليس لديك حساب؟ أنشئ حساباً جديداً
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                لديك حساب بالفعل؟ سجّل دخولك
              </>
            )}
          </button>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#7C5CFC] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للصفحة الرئيسية
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
