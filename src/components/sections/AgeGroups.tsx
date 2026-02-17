"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ageGroups } from "@/lib/constants";

interface AgeGroupsProps {
  locale: "ar" | "en";
}

const colorMap: Record<string, { bg: string; border: string; text: string; check: string }> = {
  green: { bg: "bg-[#44D4A0]/5", border: "border-t-[#44D4A0]", text: "text-[#44D4A0]", check: "#44D4A0" },
  blue: { bg: "bg-[#4DA6FF]/5", border: "border-t-[#4DA6FF]", text: "text-[#4DA6FF]", check: "#4DA6FF" },
  purple: { bg: "bg-[#7C5CFC]/5", border: "border-t-[#7C5CFC]", text: "text-[#7C5CFC]", check: "#7C5CFC" },
};

export default function AgeGroups({ locale }: AgeGroupsProps) {
  const isRTL = locale === "ar";
  const data = ageGroups[locale];

  return (
    <section id="age-groups" className="section-padding bg-[#F8F6FF]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2D2D3F] mb-4">
            {isRTL ? "مسارات تعلّم " : "Learning Paths "}
            <span className="bg-gradient-to-r from-[#44D4A0] via-[#4DA6FF] to-[#7C5CFC] bg-clip-text text-transparent">
              {isRTL ? "مصممة لكل عمر" : "Designed for Every Age"}
            </span>
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            {isRTL
              ? "محتوى مخصص يتكيف مع عمر طفلك ومستواه"
              : "Customized content that adapts to your child's age and level"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((group, index) => {
            const colors = colorMap[group.color];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`bg-white rounded-2xl shadow-lg border-t-4 ${colors.border} p-8 card-hover`}
              >
                <div className="text-center mb-6">
                  <span className="text-6xl block mb-4">{group.emoji}</span>
                  <h3 className="text-2xl font-bold text-[#2D2D3F]">{group.name}</h3>
                  <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold ${colors.bg} ${colors.text}`}>
                    {group.range}
                  </span>
                </div>

                <ul className="space-y-3">
                  {group.skills.map((skill, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${colors.check}20` }}
                      >
                        <Check className="w-3 h-3" style={{ color: colors.check }} />
                      </div>
                      <span className="text-[#6B7280] text-sm">{skill}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
