"use client";

import { Header } from "./Header";
import { Analytics } from "./Analytics";
import { RevealOnScroll } from "./RevealOnScroll";
import { LeadQuiz } from "../quiz/LeadQuiz";
import { QuizProvider, useQuiz } from "../quiz/QuizContext";

/**
 * Site shell — header + footer chrome that every page renders inside.
 * Pages pass the global `settings` and slot their content as children:
 *
 *   <SiteLayout settings={settings} headerTone="sky">
 *     …page sections…
 *   </SiteLayout>
 */

/** Renders the modal once, inside the provider, so any CTA can open it. */
function QuizHost({ quiz, theme }: { quiz: any; theme: string }) {
  const { isOpen, setOpen, restoreFocus } = useQuiz();
  return (
    <LeadQuiz
      quiz={quiz}
      theme={theme}
      open={isOpen}
      onOpenChange={setOpen}
      onCloseFocus={restoreFocus}
    />
  );
}

export function SiteLayout({
  settings,
  headerTone = "default",
  theme = "forest",
  children,
}: {
  settings: any;
  headerTone?: "default" | "sky";
  /** Page palette. Passed down because the modal portals to <body>, outside
   *  the themed root, where the --t-* tokens would fall back to :root. */
  theme?: string;
  children: React.ReactNode;
}) {
  const quiz = settings?.quiz;
  const quizEnabled = !!quiz && quiz.visible !== false && !!quiz.steps?.length;

  return (
    <QuizProvider enabled={quizEnabled}>
      <Analytics />
      <RevealOnScroll />
      <Header settings={settings} tone={headerTone} />
      <main>{children}</main>
      {quizEnabled ? <QuizHost quiz={quiz} theme={theme} /> : null}
    </QuizProvider>
  );
}
