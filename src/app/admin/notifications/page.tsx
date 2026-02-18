"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { FormField } from "@/components/admin/ui/FormField";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Plus, Send, Loader2 } from "lucide-react";
import { targetLabels } from "@/lib/admin-constants";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", body: "", target: "all" });

  const fetchNotifications = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/notifications");
    const data = await res.json();
    setNotifications(data.notifications || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleCreate = async () => {
    setSaving(true);
    await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setModalOpen(false);
    setForm({ title: "", body: "", target: "all" });
    fetchNotifications();
  };

  const handleSend = async (id: string) => {
    setSendingId(id);
    await fetch("/api/admin/notifications/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    setSendingId(null);
    fetchNotifications();
  };

  const columns: Column<any>[] = [
    { key: "title", label: "العنوان" },
    { key: "body", label: "النص", render: (n) => <span className="max-w-xs truncate block">{n.body}</span> },
    {
      key: "target", label: "الجمهور",
      render: (n) => <StatusBadge status={targetLabels[n.target] || n.target} variant="info" />,
    },
    {
      key: "status", label: "الحالة",
      render: (n) => (
        <StatusBadge
          status={n.status === "sent" ? "تم الإرسال" : n.status === "failed" ? "فشل" : "مسودة"}
          variant={n.status === "sent" ? "success" : n.status === "failed" ? "danger" : "default"}
        />
      ),
    },
    { key: "sent_count", label: "عدد الإرسال", render: (n) => n.sent_count || 0 },
    {
      key: "created_at", label: "التاريخ",
      render: (n) => new Date(n.created_at).toLocaleDateString("ar-SA"),
    },
    {
      key: "actions", label: "إجراءات",
      render: (n) =>
        n.status === "draft" ? (
          <button
            onClick={(e) => { e.stopPropagation(); handleSend(n.id); }}
            disabled={sendingId === n.id}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#7C5CFC] text-white text-xs rounded-lg hover:bg-[#6B4CE0] disabled:opacity-60"
          >
            {sendingId === n.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            إرسال
          </button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الإشعارات</h1>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#7C5CFC] text-white rounded-xl hover:bg-[#6B4CE0] font-medium">
          <Plus className="w-5 h-5" /> إنشاء إشعار
        </button>
      </div>

      <DataTable columns={columns} data={notifications} loading={loading} emptyMessage="لا توجد إشعارات" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="إنشاء إشعار جديد" size="md">
        <div className="space-y-4">
          <FormField label="العنوان" required>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" placeholder="عنوان الإشعار" />
          </FormField>
          <FormField label="النص" required>
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" rows={3} placeholder="محتوى الإشعار..." />
          </FormField>
          <FormField label="الجمهور المستهدف" required>
            <select value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm">
              <option value="all">الكل</option>
              <option value="free">المجاني فقط</option>
              <option value="plus">مهرة بلس</option>
              <option value="family">مهرة عائلي</option>
            </select>
          </FormField>
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">إلغاء</button>
            <button onClick={handleCreate} disabled={saving || !form.title || !form.body} className="px-6 py-2.5 rounded-xl bg-[#7C5CFC] text-white hover:bg-[#6B4CE0] font-medium flex items-center gap-2 disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} إنشاء مسودة
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
