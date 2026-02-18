"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { LoadingSpinner } from "@/components/admin/ui/LoadingSpinner";
import {
  Users,
  Baby,
  CreditCard,
  Banknote,
  TrendingUp,
  Clock,
  BookOpen,
  HelpCircle,
  Layers,
  Trophy,
} from "lucide-react";

interface DashboardData {
  totalUsers: number;
  totalChildren: number;
  planCounts: { free: number; plus: number; family: number };
  activeSubscriptions: number;
  waitlistCount: number;
  content: {
    lessons: number;
    quizzes: number;
    flashcards: number;
    badges: number;
  };
  newUsersWeek: number;
  estimatedRevenue: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على المنصة</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المستخدمين"
          value={data.totalUsers}
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="إجمالي الأطفال"
          value={data.totalChildren}
          icon={<Baby className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="الاشتراكات النشطة"
          value={data.activeSubscriptions}
          icon={<CreditCard className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="الإيرادات الشهرية"
          value={`${data.estimatedRevenue.toFixed(0)} ر.س`}
          icon={<Banknote className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="مستخدمين جدد (هذا الأسبوع)"
          value={data.newUsersWeek}
          icon={<TrendingUp className="w-6 h-6" />}
          color="pink"
        />
        <StatCard
          title="قائمة الانتظار"
          value={data.waitlistCount}
          icon={<Clock className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="خطة مجانية"
          value={data.planCounts.free}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="مهرة بلس + عائلي"
          value={data.planCounts.plus + data.planCounts.family}
          icon={<CreditCard className="w-6 h-6" />}
          color="green"
        />
      </div>

      {/* Content Stats */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          المحتوى التعليمي
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="الدروس"
            value={data.content.lessons}
            icon={<BookOpen className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="الاختبارات"
            value={data.content.quizzes}
            icon={<HelpCircle className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="البطاقات التعليمية"
            value={data.content.flashcards}
            icon={<Layers className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="الشارات"
            value={data.content.badges}
            icon={<Trophy className="w-6 h-6" />}
            color="orange"
          />
        </div>
      </div>
    </div>
  );
}
