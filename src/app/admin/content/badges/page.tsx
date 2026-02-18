"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { FormField } from "@/components/admin/ui/FormField";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const emptyBadge = { id: "", name_ar: "", name_en: "", description_ar: "", description_en: "", emoji: "", requirement: "", sort_order: 0 };

export default function BadgesPage() {
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyBadge);
  const [isEdit, setIsEdit] = useState(false);

  const fetchBadges = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/content/badges");
    const data = await res.json();
    setBadges(data.badges || []);
    setLoading(false);
  };

  useEffect(() => { fetchBadges(); }, []);

  const openCreate = () => { setForm(emptyBadge); setIsEdit(false); setModalOpen(true); };
  const openEdit = (b: any) => { setForm(b); setIsEdit(true); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    const url = isEdit ? `/api/admin/content/badges/${form.id}` : "/api/admin/content/badges";
    await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); setModalOpen(false); fetchBadges();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/content/badges/${deleteId}`, { method: "DELETE" });
    setDeleting(false); setDeleteId(null); fetchBadges();
  };

  const columns: Column<any>[] = [
    { key: "emoji", label: "الإيموجي", render: (b) => <span className="text-2xl">{b.emoji}</span> },
    { key: "name_ar", label: "الاسم (عربي)" },
    { key: "name_en", label: "الاسم (إنجليزي)" },
    { key: "requirement", label: "المتطلب" },
    { key: "sort_order", label: "الترتيب" },
    {
      key: "actions", label: "إجراءات", render: (b) => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); openEdit(b); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-500" /></button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteId(b.id); }} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الشارات</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#7C5CFC] text-white rounded-xl hover:bg-[#6B4CE0] font-medium"><Plus className="w-5 h-5" /> إضافة شارة</button>
      </div>

      <DataTable columns={columns} data={badges} loading={loading} emptyMessage="لا توجد شارات" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEdit ? "تعديل شارة" : "إضافة شارة"} size="md">
        <div className="space-y-4">
          {!isEdit && <FormField label="المعرف (ID)" required><input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" placeholder="first-lesson" /></FormField>}
          <FormField label="الإيموجي" required><input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-2xl text-center" placeholder="🏆" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="الاسم (عربي)" required><input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" /></FormField>
            <FormField label="الاسم (إنجليزي)" required><input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" dir="ltr" /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="الوصف (عربي)" required><textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" rows={2} /></FormField>
            <FormField label="الوصف (إنجليزي)" required><textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" rows={2} dir="ltr" /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="المتطلب" required><input value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" placeholder="complete_10_lessons" /></FormField>
            <FormField label="الترتيب"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" /></FormField>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">إلغاء</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-[#7C5CFC] text-white hover:bg-[#6B4CE0] font-medium flex items-center gap-2 disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}{isEdit ? "حفظ" : "إضافة"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="حذف الشارة" message="هل أنت متأكد؟" loading={deleting} confirmLabel="حذف" />
    </div>
  );
}
