import { Inter, Lora } from "next/font/google";

import { SITE } from "@/shared/config/site";
import { SiteFooter } from "@/widgets/site-footer/site-footer";
import { SiteHeader } from "@/widgets/site-header/site-header";

import type { Metadata, Viewport } from "next";

import "@/shared/styles/globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin", "cyrillic"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline.toLowerCase()}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline.toLowerCase()}`,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1800, height: 1200, alt: "Горный хребет на рассвете" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f9f7f3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${inter.variable} ${lora.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Перейти к содержимому
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
