"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Globe } from "lucide-react";
import { navLinks } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: "ar" | "en";
}

export default function MobileMenu({ isOpen, onClose, locale }: MobileMenuProps) {
  const isRTL = locale === "ar";
  const links = navLinks[locale];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: isRTL ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} z-[70] h-full w-[85%] max-w-sm bg-white shadow-2xl`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🦁</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#7C5CFC] to-[#FF6B9D] bg-clip-text text-transparent">
                    {isRTL ? "ماهر" : "Maher"}
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <nav className="flex-1 py-6 px-5 overflow-y-auto">
                <ul className="space-y-1">
                  {links.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <a
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center px-4 py-3.5 text-base font-semibold text-[#2D2D3F] rounded-xl hover:bg-[#7C5CFC]/5 hover:text-[#7C5CFC] transition-colors"
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="p-5 border-t border-gray-100 space-y-3">
                <button className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-[#6B7280] border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>{isRTL ? "English" : "العربية"}</span>
                </button>

                <a
                  href="#pricing"
                  onClick={onClose}
                  className="flex items-center justify-center w-full px-4 py-3.5 text-base font-bold text-white rounded-xl shadow-lg shadow-[#7C5CFC]/25"
                  style={{ background: "linear-gradient(135deg, #7C5CFC 0%, #FF6B9D 100%)" }}
                >
                  {isRTL ? "جرّب مجانًا" : "Try Free"}
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
