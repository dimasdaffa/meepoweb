import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";
import "./meepo.css";

const title = "Meepo — Meet Your People";
const description = "Connect with your group on nearby iPhones to share updates, find meeting points, and send group SOS alerts without internet access.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "Meepo",
  icons: { icon: "/meepo-icon.png", apple: "/meepo-icon.png" },
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Meepo",
  },
  other: { "site-kind": "software", "page-type": "software" },
};

export const viewport: Viewport = { themeColor: "#f5f7fa", viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-type="software" data-radius="round" data-buttons="arrow" data-ground="sky" data-motion="on" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags -- The design kit loads its motion stylesheet as a standalone asset. */}
        <link rel="stylesheet" href="/assets/motion/motion.css" />
        <script dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)",
        }} />
      </head>
      <body>
        <SmoothScroll />
        {children}
        <Script src="/assets/motion/motion.js" type="module" />
        <Script src="/assets/moments/moments.js" type="module" />
      </body>
    </html>
  );
}
