import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Nunito } from "next/font/google";
import "./globals.css";
import { supabase } from "@/lib/supabase";
import { MetaPixelScript } from "@/components/shared/pixels/MetaPixelScript";
import { GoogleTagScript } from "@/components/shared/pixels/GoogleTagScript";
import { TikTokPixelScript } from "@/components/shared/pixels/TikTokPixelScript";
import { SnapchatPixelScript } from "@/components/shared/pixels/SnapchatPixelScript";
import { TwitterPixelScript } from "@/components/shared/pixels/TwitterPixelScript";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مهرة | رفيق طفلك الذكي في التعلّم",
  description:
    "منصة تعليمية بالذكاء الاصطناعي تحوّل الدراسة إلى مغامرة ممتعة للأطفال من 3 إلى 12 سنة. القرآن الكريم، اللغة العربية، الرياضيات، العلوم، الإنجليزية، ومهارات حياتية.",
  keywords: [
    "مهرة",
    "تعليم أطفال",
    "ذكاء اصطناعي",
    "تعليم القرآن",
    "تطبيق تعليمي",
    "kids education",
    "AI learning",
    "Mohra",
  ],
  openGraph: {
    title: "مهرة | رفيق طفلك الذكي في التعلّم",
    description:
      "منصة تعليمية بالذكاء الاصطناعي للأطفال من 3 إلى 12 سنة",
    type: "website",
    locale: "ar_SA",
  },
};

async function getPixelSettings() {
  try {
    const { data } = await supabase
      .from("app_settings")
      .select("key, value")
      .like("key", "pixel_%");

    const pixels: Record<string, string> = {};
    data?.forEach((item: any) => {
      if (item.value) pixels[item.key] = item.value;
    });
    return pixels;
  } catch {
    return {};
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pixels = await getPixelSettings();

  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexArabic.variable} ${nunito.variable}`}>
      <body
        className="antialiased"
        style={{ fontFamily: "var(--font-ibm-plex-arabic), sans-serif" }}
      >
        {children}
        {pixels.pixel_meta && <MetaPixelScript pixelId={pixels.pixel_meta} />}
        {pixels.pixel_google_tag && <GoogleTagScript tagId={pixels.pixel_google_tag} />}
        {pixels.pixel_tiktok && <TikTokPixelScript pixelId={pixels.pixel_tiktok} />}
        {pixels.pixel_snapchat && <SnapchatPixelScript pixelId={pixels.pixel_snapchat} />}
        {pixels.pixel_twitter && <TwitterPixelScript pixelId={pixels.pixel_twitter} />}
      </body>
    </html>
  );
}
