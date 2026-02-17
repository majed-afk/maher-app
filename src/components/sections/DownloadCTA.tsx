"use client";

import { motion } from "framer-motion";
import { Smartphone, Play } from "lucide-react";

interface DownloadCTAProps {
  locale: "ar" | "en";
}

export default function DownloadCTA({ locale }: DownloadCTAProps) {
  const isRTL = locale === "ar";

  return (
    <section className="relative overflow-hidden py-20 px-4" dir={isRTL ? "rtl" : "ltr"}>
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

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            {isRTL
              ? "حمّل ماهر الآن وابدأ رحلة طفلك!"
              : "Download Maher Now and Start Your Child's Journey!"}
          </h2>

          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            {isRTL
              ? "مجاني للتجربة - بدون بطاقة ائتمانية"
              : "Free to try - No credit card required"}
          </p>

          {/* Store Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              <Smartphone className="w-7 h-7 text-[#2D2D3F]" />
              <div className={isRTL ? "text-right" : "text-left"}>
                <div className="text-[10px] text-[#6B7280]">{isRTL ? "حمّل من" : "Download on the"}</div>
                <div className="text-base font-bold text-[#2D2D3F]">App Store</div>
              </div>
            </motion.a>

            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              <Play className="w-7 h-7 text-[#2D2D3F] fill-[#2D2D3F]" />
              <div className={isRTL ? "text-right" : "text-left"}>
                <div className="text-[10px] text-[#6B7280]">{isRTL ? "احصل عليه من" : "Get it on"}</div>
                <div className="text-base font-bold text-[#2D2D3F]">Google Play</div>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
