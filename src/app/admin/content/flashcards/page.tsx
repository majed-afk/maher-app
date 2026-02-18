"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { FormField } from "@/components/admin/ui/FormField";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { ageGroupLabels } from "@/lib/admin-constants";

const emptyDeck = { id: "", subject_id: "", title_ar: "", title_en: "", cards: "[]", age_group: "3-6" };

export default function FlashcardsPage() {
  const [decks, setDecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyDeck);
  const [isEdit, setIsEdit] = useState(false);

  const fetchDecks = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/content/flashcards");
    const data = await res.json();
    setDecks(data.flashcards || []);
    setLoading(false);
  };

  useEffect(() => { fetchDecks(); }, []);

  const openCreate = () => { setForm(emptyDeck); setIsEdit(false); setModalOpen(true); };
  const openEdit = (d: any) => {
    setForm({ ...d, cards: typeof d.cards === "string" ? d.cards : JSON.stringify(d.cards, null, 2) });
    setIsEdit(true); setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const body = { ...form, cards: JSON.parse(form.cards || "[]") };
    const url = isEdit ? `/api/admin/content/flashcards/${form.id}` : "/api/admin/content/flashcards";
    await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false); setModalOpen(false); fetchDecks();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/content/flashcards/${deleteId}`, { method: "DELETE" });
    setDeleting(false); setDeleteId(null); fetchDecks();
  };

  const getCardsCount = (d: any) => {
    try {
      const cards = typeof d.cards === "string" ? JSON.parse(d.cards) : d.cards;
      return Array.isArray(cards) ? cards.length : 0;
    } catch { return 0; }
  };

  const columns: Column<any>[] = [
    { key: "title_ar", label: "العنوان" },
    { key: "subject_id", label: "المادة", render: (d) => `${d.subjects?.emoji || ""} ${d.subjects?.name_ar || d.subject_id}` },
    { key: "age_group", label: "الفئة العمرية", render: (d) => <StatusBadge status={ageGroupLabels[d.age_group] || d.age_group} variant="info" /> },
    { key: "cards_count", label: "عدد البطاقات", render: (d) => getCardsCount(d) },
    {
      key: "actions", label: "إجراءات", render: (d) => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); openEdit(d); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-500" /></button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteId(d.id); }} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">البطاقات التعليمية</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#7C5CFC] text-white rounded-xl hover:bg-[#6B4CE0] font-medium"><Plus className="w-5 h-5" /> إضافة مجموعة</button>
      </div>

      <DataTable columns={columns} data={decks} loading={loading} emptyMessage="لا توجد بطاقات" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEdit ? "تعديل المجموعة" : "إضافة مجموعة"} size="lg">
        <div className="space-y-4">
          {!isEdit && <FormField label="المعرف (ID)" required><input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" /></FormField>}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="العنوان (عربي)" required><input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" /></FormField>
            <FormField label="العنوان (إنجليزي)" required><input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" dir="ltr" /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="معرف المادة" required><input value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" /></FormField>
            <FormField label="الفئة العمرية" required>
              <select value={form.age_group} onChange={(e) => setForm({ ...form, age_group: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm">
                <option value="3-6">٣-٦ سنوات</option><option value="6-9">٦-٩ سنوات</option><option value="9-12">٩-١٢ سنة</option>
              </select>
            </FormField>
          </div>
          <FormField label="البطاقات (JSON)"><textarea value={form.cards} onChange={(e) => setForm({ ...form, cards: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-mono" rows={8} dir="ltr" /></FormField>
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">إلغاء</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-[#7C5CFC] text-white hover:bg-[#6B4CE0] font-medium flex items-center gap-2 disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}{isEdit ? "حفظ" : "إضافة"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="حذف المجموعة" message="هل أنت متأكد؟" loading={deleting} confirmLabel="حذف" />
    </div>
  );
}
