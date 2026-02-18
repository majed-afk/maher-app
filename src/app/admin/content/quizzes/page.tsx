"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { FormField } from "@/components/admin/ui/FormField";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { ageGroupLabels } from "@/lib/admin-constants";

const emptyQuiz = { id: "", subject_id: "", title_ar: "", title_en: "", questions: "[]", age_group: "3-6" };

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyQuiz);
  const [isEdit, setIsEdit] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/content/quizzes");
    const data = await res.json();
    setQuizzes(data.quizzes || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const openCreate = () => { setForm(emptyQuiz); setIsEdit(false); setModalOpen(true); };
  const openEdit = (q: any) => {
    setForm({ ...q, questions: typeof q.questions === "string" ? q.questions : JSON.stringify(q.questions, null, 2) });
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const body = { ...form, questions: JSON.parse(form.questions || "[]") };
    const url = isEdit ? `/api/admin/content/quizzes/${form.id}` : "/api/admin/content/quizzes";
    await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false); setModalOpen(false); fetchQuizzes();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/content/quizzes/${deleteId}`, { method: "DELETE" });
    setDeleting(false); setDeleteId(null); fetchQuizzes();
  };

  const getQuestionsCount = (q: any) => {
    try {
      const questions = typeof q.questions === "string" ? JSON.parse(q.questions) : q.questions;
      return Array.isArray(questions) ? questions.length : 0;
    } catch { return 0; }
  };

  const columns: Column<any>[] = [
    { key: "title_ar", label: "العنوان" },
    { key: "subject_id", label: "المادة", render: (q) => `${q.subjects?.emoji || ""} ${q.subjects?.name_ar || q.subject_id}` },
    { key: "age_group", label: "الفئة العمرية", render: (q) => <StatusBadge status={ageGroupLabels[q.age_group] || q.age_group} variant="info" /> },
    { key: "questions_count", label: "عدد الأسئلة", render: (q) => getQuestionsCount(q) },
    {
      key: "actions", label: "إجراءات", render: (q) => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); openEdit(q); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-500" /></button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteId(q.id); }} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الاختبارات</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#7C5CFC] text-white rounded-xl hover:bg-[#6B4CE0] font-medium"><Plus className="w-5 h-5" /> إضافة اختبار</button>
      </div>

      <DataTable columns={columns} data={quizzes} loading={loading} emptyMessage="لا توجد اختبارات" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEdit ? "تعديل اختبار" : "إضافة اختبار"} size="lg">
        <div className="space-y-4">
          {!isEdit && (
            <FormField label="المعرف (ID)" required>
              <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" placeholder="math-quiz-1" />
            </FormField>
          )}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="العنوان (عربي)" required><input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" /></FormField>
            <FormField label="العنوان (إنجليزي)" required><input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" dir="ltr" /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="معرف المادة" required><input value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm" placeholder="math" /></FormField>
            <FormField label="الفئة العمرية" required>
              <select value={form.age_group} onChange={(e) => setForm({ ...form, age_group: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm">
                <option value="3-6">٣-٦ سنوات</option><option value="6-9">٦-٩ سنوات</option><option value="9-12">٩-١٢ سنة</option>
              </select>
            </FormField>
          </div>
          <FormField label="الأسئلة (JSON)">
            <textarea value={form.questions} onChange={(e) => setForm({ ...form, questions: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-mono" rows={8} dir="ltr" />
          </FormField>
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">إلغاء</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-[#7C5CFC] text-white hover:bg-[#6B4CE0] font-medium flex items-center gap-2 disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}{isEdit ? "حفظ" : "إضافة"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="حذف الاختبار" message="هل أنت متأكد؟" loading={deleting} confirmLabel="حذف" />
    </div>
  );
}
