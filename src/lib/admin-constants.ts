import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Bell,
  Crosshair,
  Clock,
  Settings,
  GraduationCap,
  HelpCircle,
  Trophy,
  Layers,
  BarChart3,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
};

export const adminNavItems: NavItem[] = [
  {
    label: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "المستخدمين",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "المحتوى",
    href: "/admin/content",
    icon: BookOpen,
    children: [
      { label: "الدروس", href: "/admin/content/lessons" },
      { label: "الاختبارات", href: "/admin/content/quizzes" },
      { label: "البطاقات", href: "/admin/content/flashcards" },
      { label: "الشارات", href: "/admin/content/badges" },
    ],
  },
  {
    label: "الاشتراكات",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    label: "التقارير المالية",
    href: "/admin/finance",
    icon: BarChart3,
  },
  {
    label: "الإشعارات",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "البكسلات",
    href: "/admin/pixels",
    icon: Crosshair,
  },
  {
    label: "قائمة الانتظار",
    href: "/admin/waitlist",
    icon: Clock,
  },
  {
    label: "الإعدادات",
    href: "/admin/settings",
    icon: Settings,
  },
];

export const contentTypeLabels: Record<string, { label: string; icon: React.ElementType }> = {
  lessons: { label: "الدروس", icon: GraduationCap },
  quizzes: { label: "الاختبارات", icon: HelpCircle },
  flashcards: { label: "البطاقات", icon: Layers },
  badges: { label: "الشارات", icon: Trophy },
};

export const planLabels: Record<string, string> = {
  free: "مجاني",
  plus: "مهرة بلس",
  family: "مهرة عائلي",
};

export const statusLabels: Record<string, string> = {
  active: "نشط",
  cancelled: "ملغي",
  expired: "منتهي",
};

export const targetLabels: Record<string, string> = {
  all: "الكل",
  free: "المجاني",
  plus: "مهرة بلس",
  family: "مهرة عائلي",
  specific: "مستخدمين محددين",
};

export const ageGroupLabels: Record<string, string> = {
  "3-6": "٣-٦ سنوات (براعم)",
  "6-9": "٦-٩ سنوات (نجوم)",
  "9-12": "٩-١٢ سنة (أبطال)",
};
