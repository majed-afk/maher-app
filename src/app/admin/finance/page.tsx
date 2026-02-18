"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react";

interface Transaction {
  id: string;
  parent_id: string;
  payment_provider: string;
  external_transaction_id: string | null;
  type: string;
  status: string;
  amount: number;
  currency: string;
  plan: string;
  created_at: string;
  profiles?: { email: string; full_name: string | null };
}

interface Stats {
  totalRevenue: number;
  mrr: number;
  growth: number;
  byProvider: Record<string, number>;
  byPlan: Record<string, number>;
  failedCount: number;
  totalTransactions: number;
  completedTransactions: number;
  monthlyRevenue: { month: string; amount: number }[];
}

const providerLabels: Record<string, string> = {
  stripe: "Stripe (بطاقات)",
  apple: "Apple Store",
  google: "Google Play",
  revenuecat: "RevenueCat",
};

const typeLabels: Record<string, string> = {
  purchase: "شراء",
  renewal: "تجديد",
  refund: "استرجاع",
  upgrade: "ترقية",
  downgrade: "تخفيض",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  completed: { label: "مكتمل", color: "bg-green-100 text-green-700" },
  pending: { label: "معلق", color: "bg-yellow-100 text-yellow-700" },
  failed: { label: "فاشل", color: "bg-red-100 text-red-700" },
  refunded: { label: "مسترجع", color: "bg-gray-100 text-gray-700" },
};

const planLabels: Record<string, string> = {
  plus: "مهرة بلس",
  family: "مهرة عائلي",
};

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({ status: "", provider: "", plan: "" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "30",
      });
      if (filter.status) params.set("status", filter.status);
      if (filter.provider) params.set("provider", filter.provider);
      if (filter.plan) params.set("plan", filter.plan);

      const res = await fetch(`/api/admin/transactions?${params}`);
      const data = await res.json();

      setTransactions(data.transactions || []);
      setTotalPages(data.totalPages || 1);
      setStats(data.stats || null);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount: number, currency = "SAR") => {
    return `${amount.toLocaleString("ar-SA", { minimumFractionDigits: 2 })} ${currency === "SAR" ? "ر.س" : currency}`;
  };

  const maxMonthly = stats ? Math.max(...stats.monthlyRevenue.map((m) => m.amount), 1) : 1;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">التقارير المالية</h1>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={DollarSign}
            label="إجمالي الإيرادات"
            value={formatCurrency(stats.totalRevenue)}
            color="purple"
          />
          <StatCard
            icon={TrendingUp}
            label="الإيراد الشهري (MRR)"
            value={formatCurrency(stats.mrr)}
            color="blue"
            trend={stats.growth}
          />
          <StatCard
            icon={CreditCard}
            label="المعاملات المكتملة"
            value={String(stats.completedTransactions)}
            color="green"
          />
          <StatCard
            icon={AlertTriangle}
            label="المعاملات الفاشلة"
            value={String(stats.failedCount)}
            color="red"
          />
        </div>
      )}

      {/* Revenue Chart */}
      {stats && stats.monthlyRevenue.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">الإيرادات الشهرية (آخر 12 شهر)</h2>
          <div className="flex items-end gap-2 h-48">
            {stats.monthlyRevenue.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-500 font-medium">
                  {m.amount > 0 ? formatCurrency(m.amount) : ""}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-[#7C5CFC] to-[#9D85FD] rounded-t-md transition-all"
                  style={{
                    height: `${Math.max((m.amount / maxMonthly) * 100, 2)}%`,
                    minHeight: "4px",
                  }}
                />
                <span className="text-[9px] text-gray-400 mt-1 truncate w-full text-center">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Breakdown */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* By Provider */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">حسب بوابة الدفع</h3>
            {Object.entries(stats.byProvider).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.byProvider).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{providerLabels[key] || key}</span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(val)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">لا توجد بيانات بعد</p>
            )}
          </div>

          {/* By Plan */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">حسب الخطة</h3>
            {Object.entries(stats.byPlan).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.byPlan).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{planLabels[key] || key}</span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(val)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">لا توجد بيانات بعد</p>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filter.status}
          onChange={(e) => { setFilter((f) => ({ ...f, status: e.target.value })); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
        >
          <option value="">كل الحالات</option>
          <option value="completed">مكتمل</option>
          <option value="pending">معلق</option>
          <option value="failed">فاشل</option>
          <option value="refunded">مسترجع</option>
        </select>
        <select
          value={filter.provider}
          onChange={(e) => { setFilter((f) => ({ ...f, provider: e.target.value })); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
        >
          <option value="">كل البوابات</option>
          <option value="stripe">Stripe</option>
          <option value="apple">Apple</option>
          <option value="google">Google</option>
          <option value="revenuecat">RevenueCat</option>
        </select>
        <select
          value={filter.plan}
          onChange={(e) => { setFilter((f) => ({ ...f, plan: e.target.value })); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
        >
          <option value="">كل الخطط</option>
          <option value="plus">مهرة بلس</option>
          <option value="family">مهرة عائلي</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-right font-medium text-gray-600">المستخدم</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">النوع</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">الخطة</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">المبلغ</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">البوابة</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">الحالة</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    جارٍ التحميل...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    لا توجد معاملات بعد
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const st = statusLabels[tx.status] || { label: tx.status, color: "bg-gray-100 text-gray-600" };
                  return (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900 text-xs">
                            {tx.profiles?.full_name || "—"}
                          </div>
                          <div className="text-gray-400 text-xs">{tx.profiles?.email || tx.parent_id}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{typeLabels[tx.type] || tx.type}</td>
                      <td className="px-4 py-3 text-gray-700">{planLabels[tx.plan] || tx.plan}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {providerLabels[tx.payment_provider] || tx.payment_provider}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(tx.created_at).toLocaleDateString("ar-SA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-white"
            >
              السابق
            </button>
            <span className="text-sm text-gray-500">
              صفحة {page} من {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-white"
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Stat Card Component ──────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  trend?: number;
}) {
  const colors: Record<string, string> = {
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {trend !== undefined && trend !== 0 && (
          <span
            className={`flex items-center text-xs font-medium ${
              trend > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}
