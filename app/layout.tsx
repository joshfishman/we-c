import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Spectral } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bricolage",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic", "normal"],
  variable: "--font-spectral",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WE Creative Agency",
  description:
    "Human-led strategy and process, powered by AI speed. We grow brands.",
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${spectral.variable}`}>
      {GTM_ID ? <GoogleTagManager gtmId={GTM_ID} /> : null}
      <body>{children}</body>
    </html>
  );
}
