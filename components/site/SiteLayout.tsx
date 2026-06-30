"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { Analytics } from "./Analytics";

/**
 * Site shell — header + footer chrome that every page renders inside.
 * Pages pass the global `settings` and slot their content as children:
 *
 *   <SiteLayout settings={settings} headerTone="sky">
 *     …page sections…
 *   </SiteLayout>
 */
export function SiteLayout({
  settings,
  headerTone = "default",
  children,
}: {
  settings: any;
  headerTone?: "default" | "sky";
  children: React.ReactNode;
}) {
  return (
    <>
      <Analytics />
      <Header settings={settings} tone={headerTone} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
