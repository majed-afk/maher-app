"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogOut,
  User,
  Star,
  Flame,
  Trophy,
  Crown,
  Download,
  Loader2,
  Baby,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

interface Child {
  id: string;
  name: string;
  age: number;
  age_group: string;
  avatar: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  favorite_subjects: string[];
}

interface Subscription {
  plan: "free" | "plus" | "family";
  status: string;
  expires_at: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, email, full_name, role")
        .eq("id", user.id)
        .single();

      if (profileData) setProfile(profileData);

      // Load children
      const { data: childrenData } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", user.id);

      if (childrenData) setChildren(childrenData);

      // Load subscription
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("plan, status, expires_at")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subData) setSubscription(subData);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #F8F7FF 0%, #EDE9FE 50%, #E0E7FF 100%)",
        }}
      >
        <Loader2 className="w-8 h-8 animate-spin text-[#7C5CFC]" />
      </div>
    );
  }

  const planLabels: Record<string, string> = {
    free: "مجاني",
    plus: "بلس",
    family: "عائلي",
  };

  const planColors: Record<string, string> = {
    free: "#6B7280",
    plus: "#7C5CFC",
    family: "#FF6B9D",
  };

  const currentPlan = subscription?.plan || "free";

  return (
    <div
      className="min-h-screen relative"
      dir="rtl"
      style={{
        background:
          "linear-gradient(135deg, #F8F7FF 0%, #EDE9FE 50%, #E0E7FF 100%)",
      }}
    >
      {/* Decorative blurs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#7C5CFC]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#4DA6FF]/10 rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🦁</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#7C5CFC] to-[#FF6B9D] bg-clip-text text-transparent">
              مهرة
            </span>
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            {loggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            خروج
          </button>
        </motion.div>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-[#2D2D3F]">
            مرحباً{profile?.full_name ? ` ${profile.full_name}` : ""} 👋
          </h1>
          <p className="text-[#6B7280] mt-1">
            إليك ملخص رحلة طفلك التعليمية
          </p>
        </motion.div>

        {/* Subscription Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-lg shadow-[#7C5CFC]/5 border border-gray-100 p-5 mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: planColors[currentPlan] + "15" }}
              >
                <Crown
                  className="w-5 h-5"
                  style={{ color: planColors[currentPlan] }}
                />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">الاشتراك الحالي</p>
                <p
                  className="font-bold"
                  style={{ color: planColors[currentPlan] }}
                >
                  {planLabels[currentPlan]}
                </p>
              </div>
            </div>
            {currentPlan === "free" && (
              <Link
                href="/#pricing"
                className="px-4 py-2 text-sm font-bold text-white rounded-xl shadow-md shadow-[#7C5CFC]/25"
                style={{
                  background:
                    "linear-gradient(135deg, #7C5CFC 0%, #9D85FD 100%)",
                }}
              >
                ترقية
              </Link>
            )}
          </div>
        </motion.div>

        {/* Children Cards */}
        {children.length > 0 ? (
          children.map((child, i) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white rounded-2xl shadow-lg shadow-[#7C5CFC]/5 border border-gray-100 p-5 mb-4"
            >
              {/* Child Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#7C5CFC]/10 flex items-center justify-center text-2xl">
                  {child.avatar || "👶"}
                </div>
                <div>
                  <h3 className="font-bold text-[#2D2D3F]">{child.name}</h3>
                  <p className="text-sm text-[#6B7280]">
                    {child.age} سنوات · {child.age_group}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#FFB800]/10 rounded-xl p-3 text-center">
                  <Star className="w-5 h-5 text-[#FFB800] mx-auto mb-1" />
                  <p className="text-lg font-bold text-[#2D2D3F]">
                    {child.total_points}
                  </p>
                  <p className="text-xs text-[#6B7280]">نقطة</p>
                </div>
                <div className="bg-[#FF6B35]/10 rounded-xl p-3 text-center">
                  <Flame className="w-5 h-5 text-[#FF6B35] mx-auto mb-1" />
                  <p className="text-lg font-bold text-[#2D2D3F]">
                    {child.current_streak}
                  </p>
                  <p className="text-xs text-[#6B7280]">يوم متتالي</p>
                </div>
                <div className="bg-[#44D4A0]/10 rounded-xl p-3 text-center">
                  <Trophy className="w-5 h-5 text-[#44D4A0] mx-auto mb-1" />
                  <p className="text-lg font-bold text-[#2D2D3F]">
                    {child.longest_streak}
                  </p>
                  <p className="text-xs text-[#6B7280]">أعلى سلسلة</p>
                </div>
              </div>

              {/* Favorite Subjects */}
              {child.favorite_subjects && child.favorite_subjects.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-[#6B7280] mb-2 flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    المواد المفضلة
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {child.favorite_subjects.map((subj) => (
                      <span
                        key={subj}
                        className="px-3 py-1 bg-[#7C5CFC]/10 text-[#7C5CFC] text-sm font-medium rounded-full"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg shadow-[#7C5CFC]/5 border border-gray-100 p-8 mb-4 text-center"
          >
            <Baby className="w-12 h-12 text-[#7C5CFC]/30 mx-auto mb-3" />
            <h3 className="font-bold text-[#2D2D3F] mb-1">لا يوجد طفل بعد</h3>
            <p className="text-sm text-[#6B7280]">
              حمّل تطبيق مهرة وأضف بيانات طفلك لبدء رحلة التعلّم
            </p>
          </motion.div>
        )}

        {/* Download App CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#7C5CFC] to-[#9D85FD] rounded-2xl p-6 text-center text-white shadow-xl shadow-[#7C5CFC]/20"
        >
          <Download className="w-8 h-8 mx-auto mb-3 opacity-90" />
          <h3 className="text-lg font-bold mb-2">حمّل تطبيق مهرة</h3>
          <p className="text-sm opacity-80 mb-4">
            تجربة تعليمية تفاعلية وممتعة لطفلك على الجوال
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="#"
              className="px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-colors"
            >
              App Store
            </a>
            <a
              href="#"
              className="px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-colors"
            >
              Google Play
            </a>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-[#6B7280] flex items-center justify-center gap-1">
            <User className="w-3.5 h-3.5" />
            {profile?.email}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
