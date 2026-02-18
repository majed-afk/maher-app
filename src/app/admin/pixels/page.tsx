"use client";

import { useEffect, useState } from "react";
import { FormField } from "@/components/admin/ui/FormField";
import { LoadingSpinner } from "@/components/admin/ui/LoadingSpinner";
import { Save, Loader2, CheckCircle } from "lucide-react";

const pixelFields = [
  { key: "pixel_meta", label: "Meta Pixel ID", placeholder: "مثال: 1234567890", description: "Facebook / Instagram Pixel" },
  { key: "pixel_google_tag", label: "Google Tag ID", placeholder: "مثال: G-XXXXXXXXXX", description: "Google Analytics 4 + Google Ads" },
  { key: "pixel_tiktok", label: "TikTok Pixel ID", placeholder: "مثال: CXXXXXXXXXXXXXXX", description: "TikTok Ads Pixel" },
  { key: "pixel_snapchat", label: "Snapchat Pixel ID", placeholder: "مثال: xxxxxxxx-xxxx-xxxx", description: "Snapchat Ads Pixel" },
  { key: "pixel_twitter", label: "X (Twitter) Pixel ID", placeholder: "مثال: oXXXX", description: "X / Twitter Ads Pixel" },
];

export default function PixelsPage() {
  const [pixels, setPixels] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/pixels")
      .then((r) => r.json())
      .then((data) => setPixels(data.pixels || {}))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/pixels", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pixels),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">البكسلات التسويقية</h1>
        <p className="text-gray-500 mt-1">أدخل معرفات البكسل لتتبع الأحداث التسويقية على الموقع</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
        {pixelFields.map((field) => (
          <FormField key={field.key} label={field.label}>
            <input
              value={pixels[field.key] || ""}
              onChange={(e) => setPixels({ ...pixels, [field.key]: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/50 focus:border-[#7C5CFC]"
              placeholder={field.placeholder}
              dir="ltr"
            />
            <p className="text-xs text-gray-400 mt-1">{field.description}</p>
          </FormField>
        ))}

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#7C5CFC] text-white rounded-xl hover:bg-[#6B4CE0] font-medium disabled:opacity-60 transition-colors"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            حفظ الإعدادات
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" /> تم الحفظ بنجاح
            </span>
          )}
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
        <h3 className="font-semibold text-blue-900 mb-2">كيف تعمل البكسلات؟</h3>
        <p className="text-sm text-blue-700">
          عند إدخال معرف البكسل وحفظه، سيتم حقن كود التتبع تلقائياً في جميع صفحات الموقع التسويقي.
          يمكنك التحقق من عمل البكسل عبر أدوات المطور في المتصفح أو من خلال لوحة تحكم المنصة الإعلانية.
        </p>
      </div>
    </div>
  );
}
