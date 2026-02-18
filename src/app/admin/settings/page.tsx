"use client";

import { useEffect, useState } from "react";
import { Settings, ExternalLink, Database, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => r.json())
      .then((data) => setAdmin(data.admin));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>

      {/* Admin Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#7C5CFC]" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">حساب الإدارة</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">الإيميل</span>
            <span className="text-sm text-gray-900">{admin?.email || "—"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">الاسم</span>
            <span className="text-sm text-gray-900">{admin?.full_name || "—"}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">الصلاحية</span>
            <span className="text-sm font-medium text-[#7C5CFC]">مدير النظام</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Database className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">روابط سريعة</h2>
        </div>
        <div className="space-y-3">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm text-gray-700">لوحة تحكم Supabase</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm text-gray-700">لوحة تحكم Vercel</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Settings className="w-5 h-5 text-green-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">معلومات التطبيق</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">اسم التطبيق</span>
            <span className="text-sm text-gray-900">مهرة — Mohra</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">الإصدار</span>
            <span className="text-sm text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">الموقع</span>
            <a href="https://maher-app.vercel.app" target="_blank" rel="noopener noreferrer" className="text-sm text-[#7C5CFC] hover:underline">
              maher-app.vercel.app
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
