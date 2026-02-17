"use client";

import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { pricing } from "@/lib/constants";

interface PricingProps {
  locale: "ar" | "en";
}

export default function PricingSection({ locale }: PricingProps) {
  const isRTL = locale === "ar";
  const data = pricing[locale];

  return (
    <section id="pricing" className="section-padding" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#2D2D3F] mb-4">
            {isRTL ? "خطط بسيطة " : "Simple Plans "}
            <span className="bg-gradient-to-r from-[#7C5CFC] to-[#4DA6FF] bg-clip-text text-transparent">
              {isRTL ? "تناسب الجميع" : "for Everyone"}
            </span>
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            {isRTL
              ? "اختر الخطة المناسبة لعائلتك وابدأ رحلة التعلم"
              : "Choose the right plan for your family and start the learning journey"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center max-w-5xl mx-auto">
          {data.map((plan, index) => {
            const isPopular = plan.popular;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative rounded-2xl p-8 ${
                  isPopular
                    ? "text-white shadow-2xl shadow-[#7C5CFC]/30 scale-105 z-10"
                    : "bg-white shadow-lg border border-gray-100"
                } card-hover`}
                style={isPopular ? { background: "linear-gradient(135deg, #7C5CFC 0%, #9D85FD 100%)" } : {}}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 bg-[#FFD93D] text-[#2D2D3F] rounded-full text-sm font-bold shadow-lg">
                    <Crown className="w-4 h-4" />
                    {isRTL ? "الأكثر شعبية" : "Most Popular"}
                  </div>
                )}

                {/* Plan Name */}
                <h3 className={`text-xl font-bold mb-2 ${isPopular ? "text-white" : "text-[#2D2D3F]"}`}>
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <span className={`text-4xl font-black ${isPopular ? "text-white" : "text-[#2D2D3F]"}`}>
                    {plan.currency}{plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm ${isPopular ? "text-white/70" : "text-[#6B7280]"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isPopular ? "bg-white/20" : "bg-[#44D4A0]/15"
                        }`}
                      >
                        <Check className={`w-3 h-3 ${isPopular ? "text-white" : "text-[#44D4A0]"}`} />
                      </div>
                      <span className={`text-sm ${isPopular ? "text-white/90" : "text-[#6B7280]"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`block text-center w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                    isPopular
                      ? "bg-white text-[#7C5CFC] hover:bg-white/90 shadow-lg"
                      : "text-white shadow-md shadow-[#7C5CFC]/20 hover:shadow-[#7C5CFC]/40"
                  }`}
                  style={!isPopular ? { background: "linear-gradient(135deg, #7C5CFC 0%, #9D85FD 100%)" } : {}}
                >
                  {plan.cta}
                </motion.a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
