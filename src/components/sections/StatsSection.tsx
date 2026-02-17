"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, School, BookOpen, Star } from "lucide-react";
import { stats } from "@/lib/constants";

interface StatsProps {
  locale: "ar" | "en";
}

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  school: School,
  "book-open": BookOpen,
  star: Star,
};

const colorMap: Record<string, string> = {
  users: "#7C5CFC",
  school: "#FF6B9D",
  "book-open": "#4DA6FF",
  star: "#FFD93D",
};

function AnimatedCounter({ value, decimal, suffix }: { value: number; decimal?: boolean; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(decimal ? Math.round(current * 10) / 10 : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value, decimal]);

  return (
    <span ref={ref} className="text-3xl sm:text-4xl font-bold text-[#2D2D3F]">
      {decimal ? count.toFixed(1) : count.toLocaleString()}
      <span className="text-[#7C5CFC]">{suffix}</span>
    </span>
  );
}

export default function StatsSection({ locale }: StatsProps) {
  const data = stats[locale];

  return (
    <section className="relative -mt-16 z-10 max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {data.map((stat, index) => {
          const Icon = iconMap[stat.icon];
          const color = colorMap[stat.icon];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 sm:p-6 text-center shadow-lg shadow-black/5 border border-white/50 card-hover"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <AnimatedCounter value={stat.value} decimal={stat.decimal} suffix={stat.suffix} />
              <p className="text-sm text-[#6B7280] mt-1 font-medium">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
