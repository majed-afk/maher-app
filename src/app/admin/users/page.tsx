"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Pagination } from "@/components/admin/ui/Pagination";
import { planLabels } from "@/lib/admin-constants";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  children_count: number;
  subscriptions: { plan: string; status: string } | { plan: string; status: string }[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (planFilter) params.set("plan", planFilter);

    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [page, planFilter]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchUsers(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const getPlan = (user: User) => {
    const sub = Array.isArray(user.subscriptions) ? user.subscriptions[0] : user.subscriptions;
    return sub?.plan || "free";
  };

  const columns: Column<User>[] = [
    { key: "full_name", label: "الاسم", render: (u) => u.full_name || "—" },
    { key: "email", label: "الإيميل" },
    {
      key: "plan",
      label: "الخطة",
      render: (u) => {
        const plan = getPlan(u);
        const variant = plan === "family" ? "success" : plan === "plus" ? "info" : "default";
        return <StatusBadge status={planLabels[plan] || plan} variant={variant} />;
      },
    },
    { key: "children_count", label: "الأطفال" },
    {
      key: "created_at",
      label: "تاريخ التسجيل",
      render: (u) => new Date(u.created_at).toLocaleDateString("ar-SA"),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="بحث بالاسم أو الإيميل..." />
        </div>
        <select
          value={planFilter}
          onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
          className="px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/50"
        >
          <option value="">كل الخطط</option>
          <option value="free">مجاني</option>
          <option value="plus">مهرة بلس</option>
          <option value="family">مهرة عائلي</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="لا يوجد مستخدمين"
        onRowClick={(u) => router.push(`/admin/users/${u.id}`)}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
