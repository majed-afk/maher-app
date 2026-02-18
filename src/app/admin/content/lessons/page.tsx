"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { FormField } from "@/components/admin/ui/FormField";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { ageGroupLabels } from "@/lib/admin-constants";

const emptyLesson = {
  id: "", subject_id: "", title_ar: "", title_en: "", description_ar: "", description_en: "",
  content: "[]", duration: 5, sort_order: 0, age_group: "3-6", is_free: true,
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyLesson);
  const [isEdit, setIsEdit] = useState(false);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterAge, setFilterAge] = useState("");

  const fetchLessons = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterSubject) params.set("subject_id", filterSubject);
    if (filterAge) params.set("age_group", filterAge);
    const res = await fetch(`/api/admin/content/lessons?${params}`);
    const data = await res.json();
    setLessons(data.lessons || []);
    setLoading(false);
  };

  const fetchSubjects = async () => {
    const res = await fetch("/api/admin/dashboard");
    // We need subjects list — fetch from lessons API first time
    const { data } = await (await fetch("/api/admin/content/lessons")).json().catch(() => ({ data: null }));
    // For subjects we'll extract unique subjects from lessons or use a simple list
  };

  useEffect(() => { fetchLessons(); }, [filterSubject, filterAge]);

  const openCreate = () => { setForm(emptyLesson); setIsEdit(false); setModalOpen(true); };
  const openEdit = (lesson: any) => {
    setForm({
      ...lesson,
      content: typeof lesson.content === "string" ? lesson.content : JSON.stringify(lesson.content, null, 2),
    });
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const body = { ...form, content: JSON.parse(form.content || "[]") };
    const url = isEdit ? `/api/admin/content/lessons/${form.id}` : "/api/admin/content/lessons";
    const method = isEdit ? "PATCH" : "POST";

    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    setModalOpen(false);
    fetchLessons();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/content/lessons/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    fetchLessons();
  };

  const columns: Column<any>[] = [
    { key: "title_ar", label: "العنوان (عربي)" },
    {
      key: "subject_id",
      label: "المادة",
      render: (l) => (
        <span>{l.subjects?.emoji || ""} {l.subjects?.name_ar || l.subject_id}</span>
      ),
    },
    {
      key: "age_group",
      label: "الفئة العمرية",
      render: (l) => <StatusBadge status={ageGroupLabels[l.age_group] || l.age_group} variant="info" />,
    },
    { key: "duration", label: "المدة", render: (l) => `${l.duration} دقيقة` },
    {
      key: "is_free",
      label: "مجاني",
      render: (l) => <StatusBadge status={l.is_free ? "مجاني" : "مدفوع"} variant={l.is_free ? "success" : "warning"} />,
    },
    {
      key: "actions",
      label: "إجراءات",
      render: (l) => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); openEdit(l); }} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteId(l.id); }} className="p-1.5 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الدروس</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#7C5CFC] text-white rounded-xl hover:bg-[#6B4CE0] font-medium transition-colors">
          <Plus className="w-5 h-5" /> إضافة درس
        </button>
      </div>

      <div className="flex gap-4">
        <select value={filterAge} onChange={(e) => setFilterAge(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white">
          <option value="">كل الأعمار</option>
          <option value="3-6">٣-٦ سنوات</option>
          <option value="6-9">٦-٩ سنوات</option>
          <option value="9-12">٩-١٢ سنة</option>
        </select>
      </div>

      <DataTable columns={columns} data={lessons} loading={loading} emptyMessage="لا توجد دروس" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEdit ? "تعديل درس" : "إضافة درس جديد"} size="lg">
        <div className="space-y-4">
          {!isEdit && (
            <FormField label="المعرف (ID)" required>
              <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" placeholder="math-lesson-1" />
            </FormField>
          )}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="العنوان (عربي)" required>
              <input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" />
            </FormField>
            <FormField label="العنوان (إنجليزي)" required>
              <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" dir="ltr" />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="معرف المادة" required>
              <input value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" placeholder="math" />
            </FormField>
            <FormField label="الفئة العمرية" required>
              <select value={form.age_group} onChange={(e) => setForm({ ...form, age_group: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm">
                <option value="3-6">٣-٦ سنوات</option>
                <option value="6-9">٦-٩ سنوات</option>
                <option value="9-12">٩-١٢ سنة</option>
              </select>
            </FormField>
            <FormField label="المدة (دقائق)">
              <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="الوصف (عربي)">
              <textarea value={form.description_ar || ""} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" rows={2} />
            </FormField>
            <FormField label="الوصف (إنجليزي)">
              <textarea value={form.description_en || ""} onChange={(e) => setForm({ ...form, description_en: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" rows={2} dir="ltr" />
            </FormField>
          </div>
          <FormField label="المحتوى (JSON)">
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-mono" rows={6} dir="ltr" />
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_free} onChange={(e) => setForm({ ...form, is_free: e.target.checked })} className="rounded" />
            درس مجاني
          </label>
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">إلغاء</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-[#7C5CFC] text-white hover:bg-[#6B4CE0] font-medium flex items-center gap-2 disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "حفظ التعديلات" : "إضافة"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="حذف الدرس" message="هل أنت متأكد من حذف هذا الدرس؟ لا يمكن التراجع." loading={deleting} confirmLabel="حذف" />
    </div>
  );
}
