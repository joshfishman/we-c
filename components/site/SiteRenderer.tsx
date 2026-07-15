"use client";

import { useTina } from "tinacms/dist/react";
import { SiteLayout } from "./SiteLayout";
import { Blocks } from "../blocks/Blocks";

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

  // Colour theme comes from the page (Pages → Color theme). Every section
  // reads the --t-* tokens, so this one value re-skins the whole page.
  const theme = page?.theme || "forest";

  return (
    <div className="themeRoot" data-theme={theme} style={style}>
      <SiteLayout settings={settings}>
        <Blocks blocks={page?.blocks ?? []} settings={settings} />
      </SiteLayout>
    </div>
  );
}
