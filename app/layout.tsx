import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Spectral } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { Clarity } from "../components/site/Clarity";
import { siteUrl, siteName } from "../lib/site";

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

const defaultDescription =
  "Human-led strategy, AI speed. We grow ecommerce & lifestyle brands — strategy, development, and marketing under one roof.";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: defaultDescription,
  foundingDate: "2011",
  email: "hello@wedigital.studio",
  telephone: "+1-323-412-0544",
  address: {
    "@type": "PostalAddress",
    streetAddress: "268 S. Orange Dr",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    postalCode: "90036",
    addressCountry: "US",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  openGraph: {
    type: "website",
    siteName,
    url: siteUrl,
    title: siteName,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: defaultDescription,
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${spectral.variable}`}>
      {GTM_ID ? <GoogleTagManager gtmId={GTM_ID} /> : null}
      <Clarity id={CLARITY_ID} />
      <body>
        {/* Organization structured data — feeds Google's knowledge panel and
            rich results. Only facts that exist on the site are asserted. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}
