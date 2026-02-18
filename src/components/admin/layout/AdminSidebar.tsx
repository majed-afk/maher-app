"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  X,
} from "lucide-react";
import { adminNavItems, type NavItem } from "@/lib/admin-constants";

type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>(["/admin/content"]);
  const [loggingOut, setLoggingOut] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const isActive = (item: NavItem) => {
    if (item.href === "/admin") return pathname === "/admin";
    return pathname.startsWith(item.href);
  };

  const isChildActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
          <span className="text-3xl">🦁</span>
          <span className="text-xl font-bold text-gray-900">مهرة</span>
        </Link>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          const hasChildren = item.children && item.children.length > 0;
          const expanded = expandedItems.includes(item.href);

          return (
            <div key={item.href}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#7C5CFC]/10 text-[#7C5CFC]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="flex-1 text-start">{item.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#7C5CFC]/10 text-[#7C5CFC]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )}

              {/* Children submenu */}
              {hasChildren && expanded && (
                <div className="mt-1 mr-4 pr-4 border-r border-gray-200 space-y-1">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClose}
                      className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                        isChildActive(child.href)
                          ? "bg-[#7C5CFC]/10 text-[#7C5CFC] font-medium"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>{loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 right-0 h-screen w-[280px] bg-white border-l border-gray-200 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 right-0 h-screen w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
