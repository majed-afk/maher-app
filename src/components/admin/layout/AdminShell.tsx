"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

type AdminShellProps = {
  children: React.ReactNode;
  adminName: string;
};

export default function AdminShell({ children, adminName }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area — offset for desktop sidebar */}
      <div className="lg:mr-[280px]">
        <AdminHeader
          onMenuToggle={() => setSidebarOpen(true)}
          adminName={adminName}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
