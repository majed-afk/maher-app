import type { Metadata } from "next";
import { Cairo, Nunito } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ماهر | صديق طفلك الذكي في التعلّم",
  description:
    "منصة تعليمية بالذكاء الاصطناعي تحوّل الدراسة إلى مغامرة ممتعة للأطفال من 3 إلى 12 سنة. القرآن الكريم، اللغة العربية، الرياضيات، العلوم، الإنجليزية، ومهارات حياتية.",
  keywords: [
    "ماهر",
    "تعليم أطفال",
    "ذكاء اصطناعي",
    "تعليم القرآن",
    "تطبيق تعليمي",
    "kids education",
    "AI learning",
    "Maher",
  ],
  openGraph: {
    title: "ماهر | صديق طفلك الذكي في التعلّم",
    description:
      "منصة تعليمية بالذكاء الاصطناعي للأطفال من 3 إلى 12 سنة",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${nunito.variable}`}>
      <body
        className="antialiased"
        style={{ fontFamily: "var(--font-cairo), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
