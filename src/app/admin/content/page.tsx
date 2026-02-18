"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/admin/ui/StatCard";
import { LoadingSpinner } from "@/components/admin/ui/LoadingSpinner";
import { BookOpen, HelpCircle, Layers, Trophy, ArrowLeft } from "lucide-react";

export default function ContentOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const content = data?.content || { lessons: 0, quizzes: 0, flashcards: 0, badges: 0 };

  const sections = [
    { label: "الدروس", count: content.lessons, icon: BookOpen, color: "purple" as const, href: "/admin/content/lessons" },
    { label: "الاختبارات", count: content.quizzes, icon: HelpCircle, color: "blue" as const, href: "/admin/content/quizzes" },
    { label: "البطاقات التعليمية", count: content.flashcards, icon: Layers, color: "green" as const, href: "/admin/content/flashcards" },
    { label: "الشارات", count: content.badges, icon: Trophy, color: "orange" as const, href: "/admin/content/badges" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">إدارة المحتوى</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((s) => (
          <StatCard key={s.href} title={s.label} value={s.count} icon={<s.icon className="w-6 h-6" />} color={s.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <s.icon className="w-6 h-6 text-[#7C5CFC]" />
              <span className="font-semibold text-gray-900">{s.label}</span>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
