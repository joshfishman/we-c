"use client";

import { Hero } from "./hero/Hero";
import { Proof } from "./proof/Proof";
import { CaseStudy } from "./caseStudy/CaseStudy";
import { Framework } from "./framework/Framework";
import { OurWork } from "./ourWork/OurWork";
import { Approach } from "./approach/Approach";
import { BuiltInADay } from "./builtInADay/BuiltInADay";
import { CtaSection } from "./cta/CtaSection";

// Keyed by the GraphQL union __typename Tina returns for each block.
const REGISTRY: Record<
  string,
  React.ComponentType<{ data: any; settings?: any }>
> = {
  PageBlocksHero: Hero,
  PageBlocksProof: Proof,
  PageBlocksCaseStudy: CaseStudy,
  PageBlocksFramework: Framework,
  PageBlocksOurWork: OurWork,
  PageBlocksApproach: Approach,
  PageBlocksBuiltInADay: BuiltInADay,
  PageBlocksCtaSection: CtaSection,
};

export function Blocks({
  blocks,
  settings,
}: {
  blocks: any[];
  settings?: any;
}) {
  return (
    <>
      {blocks.map((block, i) => {
        // The `visible` toggle from the editor — skip hidden sections.
        if (block?.visible === false) return null;
        const Component = block?.__typename
          ? REGISTRY[block.__typename]
          : undefined;
        if (!Component) return null;
        return <Component key={i} data={block} settings={settings} />;
      })}
    </>
  );
}
