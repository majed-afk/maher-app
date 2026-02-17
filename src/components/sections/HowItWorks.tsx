"use client";

import { motion } from "framer-motion";
import { Download, UserPlus, WandSparkles, Rocket, ArrowLeft, ArrowRight } from "lucide-react";
import { howItWorks } from "@/lib/constants";

interface HowItWorksProps {
  locale: "ar" | "en";
}

const iconMap: Record<string, React.ElementType> = {
  download: Download,
  "user-plus": UserPlus,
  "wand-sparkles": WandSparkles,
  rocket: Rocket,
};

export default function HowItWorks({ locale }: HowItWorksProps) {
  const isRTL = locale === "ar";
  const data = howItWorks[locale];
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section id="how-it-works" className="section-padding bg-[#FFF8F0]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2D2D3F] mb-4">
            {isRTL ? "كيف يعمل " : "How Does "}
            <span className="bg-gradient-to-r from-[#FF8C42] to-[#7C5CFC] bg-clip-text text-transparent">
              {isRTL ? "ماهر؟" : "Maher Work?"}
            </span>
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            {isRTL
              ? "أربع خطوات بسيطة لبدء رحلة طفلك التعليمية"
              : "Four simple steps to start your child's learning journey"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {data.map((step, index) => {
            const Icon = iconMap[step.icon];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Connector Arrow (hidden on mobile & last item) */}
                {index < data.length - 1 && (
                  <div className="hidden md:flex absolute top-12 -left-3 z-10" style={isRTL ? { left: "auto", right: "-12px" } : {}}>
                    <Arrow className="w-6 h-6 text-[#7C5CFC]/30" />
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-md p-6 text-center card-hover">
                  {/* Step Number */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-sm"
                    style={{ background: "linear-gradient(135deg, #7C5CFC 0%, #9D85FD 100%)" }}
                  >
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-[#7C5CFC]/10">
                    <Icon className="w-8 h-8 text-[#7C5CFC]" />
                  </div>

                  <h3 className="text-lg font-bold text-[#2D2D3F] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#6B7280]">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
