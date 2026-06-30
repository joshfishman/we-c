"use client";

import { useTina } from "tinacms/dist/react";
import { Header } from "./Header";
import { Blocks } from "../blocks/Blocks";
import { Analytics } from "./Analytics";

type TinaProps = { data: any; variables: any; query: string };

export function SiteRenderer(props: { page: TinaProps; settings: TinaProps }) {
  const { data: pageData } = useTina(props.page);
  const { data: settingsData } = useTina(props.settings);

  const settings = settingsData.settings;
  const page = pageData.page;

  // Brand accent is editable in Site Settings → applied site-wide here.
  const style = settings?.accent
    ? ({ ["--accent" as any]: settings.accent } as React.CSSProperties)
    : undefined;

  return (
    <div style={style}>
      <Analytics />
      <Header settings={settings} />
      <main>
        <Blocks blocks={page?.blocks ?? []} settings={settings} />
      </main>
    </div>
  );
}
