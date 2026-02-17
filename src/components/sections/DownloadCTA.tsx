"use client";

import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface DownloadCTAProps {
  locale: "ar" | "en";
}

export default function DownloadCTA({ locale }: DownloadCTAProps) {
  const isRTL = locale === "ar";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage(isRTL ? "الرجاء إدخال بريد إلكتروني صحيح" : "Please enter a valid email");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setStatus("success");
        setEmail("");
        setName("");
      } else if (res.status === 409) {
        setStatus("duplicate");
        setErrorMessage(isRTL ? data.error : data.errorEn);
      } else {
        setStatus("error");
        setErrorMessage(isRTL ? data.error : data.errorEn);
      }
    } catch {
      setStatus("error");
      setErrorMessage(isRTL ? "حدث خطأ في الاتصال" : "Connection error");
    }
  };

  return (
    <section id="waitlist" className="relative overflow-hidden py-20 px-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* Background Gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #7C5CFC 0%, #4DA6FF 50%, #44D4A0 100%)" }}
      />

      {/* Decorative Circles */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-white/10 rounded-full blur-xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Mascot */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl mb-6"
          >
            🦁
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-snug">
            {isRTL
              ? "كن أول من يجرّب ماهر!"
              : "Be the First to Try Maher!"}
          </h2>

          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            {isRTL
              ? "سجّل في قائمة الانتظار وسنُعلمك فور إطلاق التطبيق"
              : "Join the waitlist and we'll notify you when the app launches"}
          </p>

          {/* Waitlist Form */}
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 p-6 bg-white/20 backdrop-blur-sm rounded-2xl max-w-md mx-auto"
            >
              <CheckCircle className="w-12 h-12 text-white" />
              <p className="text-xl font-bold text-white">
                {isRTL ? "تم التسجيل بنجاح! 🎉" : "Successfully registered! 🎉"}
              </p>
              <p className="text-white/80">
                {isRTL ? "سنُرسل لك إشعاراً عند الإطلاق" : "We'll notify you when we launch"}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
              {/* Name Input */}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isRTL ? "الاسم (اختياري)" : "Name (optional)"}
                className="w-full px-5 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />

              {/* Email Input + Submit */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 ${isRTL ? "right-4" : "left-4"}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error" || status === "duplicate") setStatus("idle");
                    }}
                    placeholder={isRTL ? "بريدك الإلكتروني" : "Your email"}
                    required
                    className={`w-full py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all ${isRTL ? "pr-12 pl-5" : "pl-12 pr-5"}`}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={status === "loading"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white text-[#7C5CFC] font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    isRTL ? "سجّل الآن" : "Join Now"
                  )}
                </motion.button>
              </div>

              {/* Error/Duplicate Message */}
              {(status === "error" || status === "duplicate") && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 justify-center text-white/90"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errorMessage}</span>
                </motion.div>
              )}

              <p className="text-xs text-white/50 mt-2">
                {isRTL
                  ? "لن نشارك بريدك مع أي طرف آخر"
                  : "We won't share your email with anyone"}
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
