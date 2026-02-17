"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { navLinks } from "@/lib/constants";
import MobileMenu from "./MobileMenu";

interface HeaderProps {
  locale: "ar" | "en";
}

export default function Header({ locale }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRTL = locale === "ar";
  const links = navLinks[locale];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/20"
            : "bg-transparent"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href={isRTL ? "/" : "/en"} className="flex items-center gap-2 group">
              <motion.span
                className="text-3xl"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🦁
              </motion.span>
              <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#7C5CFC] to-[#FF6B9D] bg-clip-text text-transparent">
                {isRTL ? "ماهر" : "Maher"}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative px-4 py-2 text-sm font-semibold text-[#2D2D3F] hover:text-[#7C5CFC] transition-colors rounded-xl group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#7C5CFC] to-[#FF6B9D] rounded-full transition-all duration-300 group-hover:w-2/3" />
                </motion.a>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href={isRTL ? "/en" : "/"}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] hover:text-[#7C5CFC] transition-colors rounded-xl hover:bg-[#7C5CFC]/5"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{isRTL ? "EN" : "عربي"}</span>
              </Link>

              <motion.a
                href="#pricing"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg shadow-[#7C5CFC]/25 hover:shadow-[#7C5CFC]/40 transition-shadow"
                style={{ background: "linear-gradient(135deg, #7C5CFC 0%, #FF6B9D 100%)" }}
              >
                {isRTL ? "جرّب مجانًا" : "Try Free"}
              </motion.a>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-[#2D2D3F] hover:bg-gray-100 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} locale={locale} />
    </>
  );
}
