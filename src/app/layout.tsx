import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const ibmPlexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KKC Home Hug — อสังหาริมทรัพย์ขอนแก่น",
    template: "%s | KKC Home Hug",
  },
  description:
    "ซื้อ ขาย เช่า บ้าน คอนโด ที่ดิน และอาคารพาณิชย์ในจังหวัดขอนแก่น",
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "KKC Home Hug",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      data-theme="light"
      className={ibmPlexThai.variable}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen bg-base-100 text-base-content">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}",
          }}
        />
        {children}
      </body>
    </html>
  );
}
