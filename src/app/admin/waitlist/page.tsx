"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { Pagination } from "@/components/admin/ui/Pagination";
import { Download } from "lucide-react";

export default function WaitlistPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchEntries = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);

    const res = await fetch(`/api/admin/waitlist?${params}`);
    const data = await res.json();
    setEntries(data.entries || []);
    setTotalPages(data.totalPages || 1);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, [page]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchEntries(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const columns: Column<any>[] = [
    { key: "email", label: "الإيميل" },
    { key: "name", label: "الاسم", render: (e) => e.name || "—" },
    { key: "phone", label: "الهاتف", render: (e) => e.phone || "—" },
    { key: "source", label: "المصدر", render: (e) => e.source || "website" },
    { key: "created_at", label: "تاريخ التسجيل", render: (e) => new Date(e.created_at).toLocaleDateString("ar-SA") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">قائمة الانتظار</h1>
          <p className="text-gray-500 mt-1">{total} مسجل</p>
        </div>
        <a
          href="/api/admin/waitlist/export"
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          <Download className="w-5 h-5" /> تصدير CSV
        </a>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="بحث بالإيميل أو الاسم..." />

      <DataTable columns={columns} data={entries} loading={loading} emptyMessage="لا توجد تسجيلات" />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
