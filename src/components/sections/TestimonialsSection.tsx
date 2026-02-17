"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/constants";

interface TestimonialsProps {
  locale: "ar" | "en";
}

export default function TestimonialsSection({ locale }: TestimonialsProps) {
  const isRTL = locale === "ar";
  const data = testimonials[locale];

  return (
    <section className="section-padding bg-[#FFF8F0]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#2D2D3F] mb-4">
            {isRTL ? "ماذا يقول الأهل عن " : "What Do Parents Say About "}
            <span className="bg-gradient-to-r from-[#FF8C42] to-[#FF6B9D] bg-clip-text text-transparent">
              {isRTL ? "ماهر؟" : "Maher?"}
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-50 card-hover"
            >
              <Quote className="w-8 h-8 text-[#7C5CFC]/20 mb-4" />
              <p className="text-[#2D2D3F] leading-relaxed mb-6">{testimonial.text}</p>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: "linear-gradient(135deg, #7C5CFC 0%, #9D85FD 100%)" }}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-[#2D2D3F]">{testimonial.name}</h4>
                  <p className="text-sm text-[#6B7280]">{testimonial.role}</p>
                </div>
                <div className={`flex gap-0.5 ${isRTL ? "mr-auto" : "ml-auto"}`}>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFD93D] fill-[#FFD93D]" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
