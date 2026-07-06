import type { Metadata } from "next";
import Script from "next/script";
import { Anuphan } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const fontSans = Anuphan({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "KKC Home Hug Property — อสังหาริมทรัพย์ขอนแก่น",
    template: "%s | KKC Home Hug Property",
  },
  description:
    "ซื้อ ขาย เช่า บ้าน คอนโด ที่ดิน และอาคารพาณิชย์ในจังหวัดขอนแก่น",
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "KKC Home Hug Property",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      data-theme="corporate"
      className={fontSans.variable}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen bg-base-100 text-base-content">
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t||'corporate')}catch(e){}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
