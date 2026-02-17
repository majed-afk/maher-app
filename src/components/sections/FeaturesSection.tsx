"use client";

import { motion } from "framer-motion";
import { Bot, Gamepad2, BookHeart, Languages, ShieldCheck, BarChart3 } from "lucide-react";
import { features } from "@/lib/constants";

interface FeaturesProps {
  locale: "ar" | "en";
}

const iconMap: Record<string, React.ElementType> = {
  bot: Bot,
  "gamepad-2": Gamepad2,
  "book-heart": BookHeart,
  languages: Languages,
  "shield-check": ShieldCheck,
  "chart-bar": BarChart3,
};

const colorMap: Record<string, string> = {
  purple: "#7C5CFC",
  pink: "#FF6B9D",
  green: "#44D4A0",
  blue: "#4DA6FF",
  orange: "#FF8C42",
  yellow: "#FFD93D",
};

export default function FeaturesSection({ locale }: FeaturesProps) {
  const isRTL = locale === "ar";
  const data = features[locale];

  return (
    <section id="features" className="section-padding" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#2D2D3F] mb-4">
            {isRTL ? "لماذا يحب الأطفال " : "Why Do Kids Love "}
            <span className="bg-gradient-to-r from-[#7C5CFC] to-[#FF6B9D] bg-clip-text text-transparent">
              {isRTL ? "ماهر؟" : "Maher?"}
            </span>
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            {isRTL
              ? "مميزات ذكية تجعل التعلم متعة لا تنتهي"
              : "Smart features that make learning an endless joy"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {data.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            const color = colorMap[feature.color];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-7 shadow-md shadow-black/5 border border-gray-100 card-hover group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="text-xl font-bold text-[#2D2D3F] mb-3">{feature.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
