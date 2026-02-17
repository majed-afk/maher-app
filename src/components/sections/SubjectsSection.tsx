"use client";

import { motion } from "framer-motion";
import { BookOpen, PenLine, Calculator, FlaskConical, Globe, Lightbulb } from "lucide-react";
import { subjects } from "@/lib/constants";

interface SubjectsProps {
  locale: "ar" | "en";
}

const iconMap: Record<string, React.ElementType> = {
  "book-open": BookOpen,
  "pen-line": PenLine,
  calculator: Calculator,
  "flask-conical": FlaskConical,
  globe: Globe,
  lightbulb: Lightbulb,
};

export default function SubjectsSection({ locale }: SubjectsProps) {
  const isRTL = locale === "ar";
  const data = subjects[locale];

  return (
    <section id="subjects" className="section-padding" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#2D2D3F] mb-4">
            {isRTL ? "مواد تعليمية " : "Comprehensive "}
            <span className="bg-gradient-to-r from-[#D4A843] via-[#3498DB] to-[#9B59B6] bg-clip-text text-transparent">
              {isRTL ? "شاملة" : "Subjects"}
            </span>
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            {isRTL
              ? "محتوى متكامل يغطي جميع احتياجات طفلك التعليمية"
              : "Complete content covering all your child's educational needs"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((subject, index) => {
            const Icon = iconMap[subject.icon];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl p-6 card-hover group"
                style={{
                  backgroundColor: subject.bg,
                  borderRight: isRTL ? `4px solid ${subject.color}` : "none",
                  borderLeft: !isRTL ? `4px solid ${subject.color}` : "none",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: subject.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2D2D3F] mb-1">{subject.name}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{subject.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
