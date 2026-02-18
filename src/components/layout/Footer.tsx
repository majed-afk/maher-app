"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Twitter, Instagram, Youtube, Send } from "lucide-react";

interface FooterProps {
  locale: "ar" | "en";
}

const footerData = {
  ar: {
    description: "منصة تعليمية ذكية للأطفال من 3 إلى 12 سنة. نجعل التعلم متعة باستخدام الذكاء الاصطناعي.",
    columns: [
      { title: "المنصة", links: [{ label: "المميزات", href: "#features" }, { label: "المواد", href: "#subjects" }, { label: "الفئات العمرية", href: "#age-groups" }, { label: "الأسعار", href: "#pricing" }] },
      { title: "الدعم", links: [{ label: "الأسئلة الشائعة", href: "#faq" }, { label: "تواصل معنا", href: "#" }, { label: "الشروط والأحكام", href: "/terms" }, { label: "سياسة الخصوصية", href: "/privacy" }] },
    ],
    madeWith: "صُنع بحب في السعودية",
    copyright: `جميع الحقوق محفوظة © ${new Date().getFullYear()} مهرة`,
  },
  en: {
    description: "A smart educational platform for children aged 3-12. We make learning fun using AI.",
    columns: [
      { title: "Platform", links: [{ label: "Features", href: "#features" }, { label: "Subjects", href: "#subjects" }, { label: "Age Groups", href: "#age-groups" }, { label: "Pricing", href: "#pricing" }] },
      { title: "Support", links: [{ label: "FAQ", href: "#faq" }, { label: "Contact Us", href: "#" }, { label: "Terms of Service", href: "/terms" }, { label: "Privacy Policy", href: "/privacy" }] },
    ],
    madeWith: "Made with love in Saudi Arabia",
    copyright: `All rights reserved © ${new Date().getFullYear()} Mohra`,
  },
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Send, href: "#", label: "Telegram" },
];

export default function Footer({ locale }: FooterProps) {
  const isRTL = locale === "ar";
  const data = footerData[locale];

  return (
    <footer className="relative bg-[#1a1a2e] text-gray-300 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C5CFC] via-[#FF6B9D] to-[#FF8C42]" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#7C5CFC] rounded-full blur-[128px]" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#FF6B9D] rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-16 pb-12"
        >
          <div className="lg:col-span-2">
            <Link href={isRTL ? "/" : "/en"} className="inline-flex items-center gap-2 mb-5">
              <span className="text-3xl">🦁</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#9D85FD] to-[#FF8FB5] bg-clip-text text-transparent">
                {isRTL ? "مهرة" : "Mohra"}
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">{data.description}</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-[#7C5CFC]/20 text-gray-400 hover:text-[#9D85FD] transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {data.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-400 hover:text-[#9D85FD] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        <div className="border-t border-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="flex items-center gap-1.5 text-sm text-gray-500">
            {data.madeWith} 🇸🇦 <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
          <p className="text-sm text-gray-500">{data.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
