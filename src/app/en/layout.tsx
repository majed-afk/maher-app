import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maher | Your Child's Smart Learning Friend",
  description:
    "An AI-powered educational platform that turns studying into a fun adventure for kids aged 3-12. Holy Quran, Arabic, Math, Science, English, and Life Skills.",
  keywords: [
    "Maher",
    "kids education",
    "AI learning",
    "Quran memorization",
    "educational app",
    "children learning",
  ],
  openGraph: {
    title: "Maher | Your Child's Smart Learning Friend",
    description:
      "An AI-powered educational platform for kids aged 3-12",
    type: "website",
    locale: "en_US",
  },
};

export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="ltr" lang="en" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
      {children}
    </div>
  );
}
