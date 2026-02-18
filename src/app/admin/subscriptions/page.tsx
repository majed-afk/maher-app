"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Pagination } from "@/components/admin/ui/Pagination";
import { LoadingSpinner } from "@/components/admin/ui/LoadingSpinner";
import { Users, CreditCard, Banknote, XCircle } from "lucide-react";
import { planLabels, statusLabels } from "@/lib/admin-constants";

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchSubs = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (planFilter) params.set("plan", planFilter);
    if (statusFilter) params.set("status", statusFilter);

    const res = await fetch(`/api/admin/subscriptions?${params}`);
    const data = await res.json();
    setSubs(data.subscriptions || []);
    setSummary(data.summary);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => { fetchSubs(); }, [page, planFilter, statusFilter]);

  if (loading && !summary) return <LoadingSpinner />;

  const columns: Column<any>[] = [
    { key: "user", label: "المستخدم", render: (s) => s.profiles?.full_name || s.profiles?.email || "—" },
    { key: "email", label: "الإيميل", render: (s) => s.profiles?.email || "—" },
    {
      key: "plan", label: "الخطة",
      render: (s) => <StatusBadge status={planLabels[s.plan] || s.plan} variant={s.plan === "family" ? "success" : s.plan === "plus" ? "info" : "default"} />,
    },
    {
      key: "status", label: "الحالة",
      render: (s) => <StatusBadge status={statusLabels[s.status] || s.status} variant={s.status === "active" ? "success" : s.status === "cancelled" ? "danger" : "warning"} />,
    },
    { key: "starts_at", label: "تاريخ البدء", render: (s) => new Date(s.starts_at).toLocaleDateString("ar-SA") },
    { key: "expires_at", label: "تاريخ الانتهاء", render: (s) => s.expires_at ? new Date(s.expires_at).toLocaleDateString("ar-SA") : "—" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">الاشتراكات</h1>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="مجاني" value={summary.free} icon={<Users className="w-6 h-6" />} color="blue" />
          <StatCard title="مهرة بلس" value={summary.plus} icon={<CreditCard className="w-6 h-6" />} color="purple" />
          <StatCard title="مهرة عائلي" value={summary.family} icon={<CreditCard className="w-6 h-6" />} color="green" />
          <StatCard title="الإيرادات الشهرية" value={`${summary.estimatedRevenue?.toFixed(0) || 0} ر.س`} icon={<Banknote className="w-6 h-6" />} color="orange" />
        </div>
      )}

      <div className="flex gap-4">
        <select value={planFilter} onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }} className="px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white">
          <option value="">كل الخطط</option>
          <option value="free">مجاني</option>
          <option value="plus">مهرة بلس</option>
          <option value="family">مهرة عائلي</option>
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white">
          <option value="">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="cancelled">ملغي</option>
          <option value="expired">منتهي</option>
        </select>
      </div>

      <DataTable columns={columns} data={subs} loading={loading} emptyMessage="لا توجد اشتراكات" />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
