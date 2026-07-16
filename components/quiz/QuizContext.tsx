"use client";

import { createContext, useContext, useRef, useState } from "react";

/**
 * Lets any CTA open the lead quiz while the modal itself lives once, at the
 * layout level.
 *
 * Only the header button uses this today. Anything else can opt in by calling
 * `useQuiz().open()` — but a trigger must stay a real focusable control, because
 * closing the dialog sends focus back to it.
 *
 * Radix normally restores focus to its own <Dialog.Trigger>. These triggers
 * aren't one (the modal is rendered elsewhere in the tree), so Radix's
 * triggerRef is null and focus would land on <body>. We remember whatever was
 * focused when the quiz opened and hand focus back to it ourselves.
 *
 * `enabled` is false when the editor unchecks the quiz, and then triggers fall
 * back to their normal href (the contact form).
 */
type QuizContextValue = {
  enabled: boolean;
  isOpen: boolean;
  open: () => void;
  setOpen: (open: boolean) => void;
  restoreFocus: () => void;
};

const QuizContext = createContext<QuizContextValue>({
  enabled: false,
  isOpen: false,
  open: () => {},
  setOpen: () => {},
  restoreFocus: () => {},
});

export const useQuiz = () => useContext(QuizContext);

export function QuizProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = () => {
    triggerRef.current =
      typeof document !== "undefined"
        ? (document.activeElement as HTMLElement | null)
        : null;
    setOpen(true);
  };

  const restoreFocus = () => triggerRef.current?.focus?.();

  return (
    <QuizContext.Provider
      value={{ enabled, isOpen, open, setOpen, restoreFocus }}
    >
      {children}
    </QuizContext.Provider>
  );
}
