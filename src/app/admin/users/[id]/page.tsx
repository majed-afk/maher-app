"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/admin/ui/LoadingSpinner";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ArrowRight, Mail, Phone, Globe, Calendar, Trophy, Flame, Star } from "lucide-react";
import { planLabels, statusLabels, ageGroupLabels } from "@/lib/admin-constants";

interface UserDetail {
  profile: any;
  children: any[];
  subscription: any;
  settings: any;
}

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!data?.profile) return <div className="text-center py-12 text-gray-500">المستخدم غير موجود</div>;

  const { profile, children, subscription, settings } = data;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/admin/users")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للمستخدمين
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">معلومات الحساب</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">الإيميل</p>
              <p className="text-sm text-gray-900">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">الهاتف</p>
              <p className="text-sm text-gray-900">{profile.phone || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">اللغة</p>
              <p className="text-sm text-gray-900">{profile.locale === "ar" ? "العربية" : "الإنجليزية"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">تاريخ التسجيل</p>
              <p className="text-sm text-gray-900">{new Date(profile.created_at).toLocaleDateString("ar-SA")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      {subscription && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">الاشتراك</h2>
          <div className="flex items-center gap-4">
            <StatusBadge
              status={planLabels[subscription.plan] || subscription.plan}
              variant={subscription.plan === "family" ? "success" : subscription.plan === "plus" ? "info" : "default"}
            />
            <StatusBadge
              status={statusLabels[subscription.status] || subscription.status}
              variant={subscription.status === "active" ? "success" : subscription.status === "cancelled" ? "danger" : "warning"}
            />
            {subscription.expires_at && (
              <span className="text-sm text-gray-500">
                ينتهي: {new Date(subscription.expires_at).toLocaleDateString("ar-SA")}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Children */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">الأطفال ({children.length})</h2>
        {children.length === 0 ? (
          <p className="text-gray-500 text-sm">لا يوجد أطفال مسجلين</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child: any) => (
              <div key={child.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{child.avatar || "👤"}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{child.name}</h3>
                    <p className="text-xs text-gray-500">
                      {child.age} سنوات • {ageGroupLabels[child.age_group] || child.age_group}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-purple-50 rounded-xl p-2">
                    <Star className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900">{child.total_points}</p>
                    <p className="text-[10px] text-gray-500">نقطة</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-2">
                    <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900">{child.current_streak}</p>
                    <p className="text-[10px] text-gray-500">سلسلة</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-2">
                    <Trophy className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900">{child.badges_count || 0}</p>
                    <p className="text-[10px] text-gray-500">شارة</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
