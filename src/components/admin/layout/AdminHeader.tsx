"use client";

import { usePathname } from "next/navigation";
import { Menu, UserCircle } from "lucide-react";
import { adminNavItems } from "@/lib/admin-constants";

type AdminHeaderProps = {
  onMenuToggle: () => void;
  adminName: string;
};

function getPageTitle(pathname: string): string {
  // Exact match for dashboard root
  if (pathname === "/admin") return "لوحة التحكم";

  // Check top-level nav items
  for (const item of adminNavItems) {
    if (item.href === pathname) return item.label;

    // Check children
    if (item.children) {
      for (const child of item.children) {
        if (child.href === pathname) return child.label;
      }
    }

    // Partial match for nested routes (e.g., /admin/users/123)
    if (item.href !== "/admin" && pathname.startsWith(item.href)) {
      return item.label;
    }
  }

  return "لوحة التحكم";
}

export default function AdminHeader({
  onMenuToggle,
  adminName,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Right side: menu toggle + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        </div>

        {/* Left side: admin info */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserCircle className="w-5 h-5 text-gray-400" />
          <span className="hidden sm:inline">{adminName}</span>
        </div>
      </div>
    </header>
  );
}
