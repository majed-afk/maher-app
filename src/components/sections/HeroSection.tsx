"use client";

import { motion } from "framer-motion";
import { Smartphone, Play } from "lucide-react";

interface HeroProps {
  locale: "ar" | "en";
}

const content = {
  ar: {
    title: "مهرة.. رفيق التعلّم الذكي!",
    subtitle: "منصة تعليمية بالذكاء الاصطناعي تحوّل الدراسة إلى مغامرة ممتعة للأطفال من 3 إلى 12 سنة",
    cta: "ابدأ مجانًا",
    secondary: "شاهد كيف يعمل",
    appStore: "App Store",
    googlePlay: "Google Play",
  },
  en: {
    title: "Mohra.. Your Smart Learning Companion!",
    subtitle: "An AI-powered educational platform that turns studying into a fun adventure for kids aged 3-12",
    cta: "Start Free",
    secondary: "See How It Works",
    appStore: "App Store",
    googlePlay: "Google Play",
  },
};

export default function HeroSection({ locale }: HeroProps) {
  const isRTL = locale === "ar";
  const t = content[locale];

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Decorative Bubbles */}
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-[#7C5CFC]/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-[#FF6B9D]/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4DA6FF]/5 rounded-full blur-3xl" />

      {/* Small Decorative Elements */}
      <div className="absolute top-32 right-[20%] w-4 h-4 bg-[#FFD93D] rounded-full animate-float opacity-60" />
      <div className="absolute top-48 left-[15%] w-3 h-3 bg-[#FF6B9D] rounded-full animate-float-delay opacity-60" />
      <div className="absolute bottom-40 left-[25%] w-5 h-5 bg-[#44D4A0] rounded-full animate-float-slow opacity-60" />
      <div className="absolute bottom-32 right-[30%] w-3 h-3 bg-[#4DA6FF] rounded-full animate-float opacity-60" />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={isRTL ? "text-center lg:text-right" : "text-center lg:text-left"}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC] text-sm font-semibold mb-6"
            >
              <span className="w-2 h-2 bg-[#44D4A0] rounded-full animate-pulse" />
              {isRTL ? "مدعوم بالذكاء الاصطناعي" : "Powered by AI"}
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug mb-6">
              <span className="bg-gradient-to-r from-[#7C5CFC] via-[#FF6B9D] to-[#FF8C42] bg-clip-text text-transparent">
                {t.title}
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[#6B7280] leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              {t.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start">
              <motion.a
                href="/auth/login"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-white rounded-2xl shadow-xl shadow-[#7C5CFC]/30 hover:shadow-[#7C5CFC]/50 transition-shadow"
                style={{ background: "linear-gradient(135deg, #7C5CFC 0%, #FF6B9D 100%)" }}
              >
                {t.cta}
              </motion.a>

              <motion.a
                href="#how-it-works"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-[#7C5CFC] border-2 border-[#7C5CFC]/30 rounded-2xl hover:bg-[#7C5CFC]/5 transition-colors"
              >
                <Play className="w-5 h-5 fill-[#7C5CFC]" />
                {t.secondary}
              </motion.a>
            </div>

            {/* Store Badges */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="flex items-center gap-3 px-5 py-3 bg-black text-white rounded-xl">
                <Smartphone className="w-6 h-6" />
                <div>
                  <div className="text-[10px] opacity-70">{isRTL ? "حمّل من" : "Download on the"}</div>
                  <div className="text-sm font-bold">{t.appStore}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-black text-white rounded-xl">
                <Play className="w-6 h-6 fill-white" />
                <div>
                  <div className="text-[10px] opacity-70">{isRTL ? "احصل عليه من" : "Get it on"}</div>
                  <div className="text-sm font-bold">{t.googlePlay}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mascot / Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex items-center justify-center hidden sm:flex"
          >
            <div className="relative">
              {/* Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C5CFC]/20 to-[#FF6B9D]/20 rounded-full blur-3xl scale-110" />

              {/* Main Mascot Circle */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-gradient-to-br from-[#7C5CFC] to-[#9D85FD] rounded-[3rem] flex items-center justify-center shadow-2xl shadow-[#7C5CFC]/30"
              >
                <span className="text-[100px] sm:text-[120px] lg:text-[140px] xl:text-[160px]">🦁</span>
              </motion.div>

              {/* Floating Subject Icons */}
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-4 -right-4 w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl lg:text-3xl"
              >
                📖
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0], x: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/4 -left-6 w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl lg:text-2xl"
              >
                🔢
              </motion.div>

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -bottom-2 -left-2 w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl lg:text-3xl"
              >
                🧪
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-8 -right-6 w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl lg:text-2xl"
              >
                🌍
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
