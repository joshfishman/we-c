"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm, ValidationError } from "@formspree/react";

import { track, trackFormSubmit, trackLead } from "../../lib/track";
import styles from "./leadQuiz.module.css";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "mdarygor";

type Branch = "any" | "marketing" | "site";
type Picks = "marketing" | "site" | "both" | "";

type QuizOption = { label?: string; value?: string; picks?: Picks };
type QuizStep = {
  key?: string;
  question?: string;
  help?: string;
  type?: "single" | "multi";
  branch?: Branch;
  options?: QuizOption[];
};

const valueOf = (o: QuizOption) => o.value || o.label || "";

/**
 * Which questions this person actually gets.
 *
 * One shared spine with conditional slots rather than parallel tracks: picking
 * "Both" costs one extra question, not a second set of them. Steps with no
 * branch are asked of everyone; a branched step is asked when its service was
 * picked, or when they picked Both.
 */
function stepsFor(all: QuizStep[], service: Picks) {
  return all.filter((s) => {
    const b = s.branch || "any";
    if (b === "any") return true;
    if (!service) return false;
    return service === "both" || service === b;
  });
}

export function LeadQuiz({
  quiz,
  theme = "forest",
  open,
  onOpenChange,
  onCloseFocus,
}: {
  quiz: any;
  /** The page's palette. Radix portals the dialog to <body>, outside the themed
   *  root, so without this the --t-* tokens fall back to :root and the modal
   *  renders in the wrong palette. */
  theme?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Hands focus back to whatever opened the quiz. Radix only does this for its
   *  own <Dialog.Trigger>, and these triggers aren't one. */
  onCloseFocus?: () => void;
}) {
  const allSteps: QuizStep[] = useMemo(() => quiz?.steps ?? [], [quiz]);

  // 0 is the first question; steps.length is the contact capture. There's no
  // separate intro panel — a screen with nothing to answer is a step that costs
  // a click and asks nothing, so the intro line sits above question one.
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const [state, handleSubmit] = useForm(FORMSPREE_ID);

  // The service answer decides which questions exist, so the flow length is
  // derived from the answers rather than fixed.
  const service = (() => {
    const first = allSteps[0];
    if (!first?.key) return "" as Picks;
    const picked = answers[first.key];
    const opt = first.options?.find((o) => valueOf(o) === picked);
    return (opt?.picks || "") as Picks;
  })();

  const steps = useMemo(
    () => stepsFor(allSteps, service),
    [allSteps, service]
  );
  const total = steps.length + 1; // + contact capture
  const onContact = index === steps.length;
  const step = onContact ? null : steps[index];

  // Reset on close so a reopened quiz starts clean. Done in the close handler
  // rather than an effect on `open`: setState synchronously inside an effect
  // cascades an extra render, and this is an event, not derived state.
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setIndex(0);
      setAnswers({});
      setError(null);
    }
    onOpenChange(next);
  };

  /**
   * Move focus to the new step's heading on every step change.
   *
   * Focus moves announce more reliably than aria-live, and firing both makes
   * them collide — so this is the only announcement. Radix handles the initial
   * focus, the focus trap, Esc, and returning focus to the trigger on close.
   */
  useEffect(() => {
    if (open) headingRef.current?.focus();
  }, [index, open]);

  useEffect(() => {
    if (state.succeeded) {
      trackFormSubmit("lead_quiz");
      trackLead("quiz", "lead_quiz");
    }
  }, [state.succeeded]);

  const setAnswer = (key: string, value: string | string[]) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setError(null);
  };

  const toggleMulti = (key: string, value: string) => {
    const current = (answers[key] as string[]) || [];
    setAnswer(
      key,
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  const next = () => {
    if (index === 0) track("quiz_start", { form: "lead_quiz" });
    if (step?.key) {
      const a = answers[step.key];
      const empty = Array.isArray(a) ? a.length === 0 : !a;
      if (empty) {
        setError("Pick an answer to carry on.");
        return;
      }
      track("quiz_step", { form: "lead_quiz", step: step.key, answer: String(a) });
    }
    setIndex((i) => i + 1);
  };

  const back = () => {
    setError(null);
    setIndex((i) => Math.max(0, i - 1));
  };

  if (!quiz || quiz.visible === false) return null;

  const progress = ((index + 1) / total) * 100;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.modal}
          data-theme={theme}
          aria-describedby={undefined}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            onCloseFocus?.();
          }}
        >
          <div className={styles.head}>
            <Dialog.Title className={styles.title}>
              {quiz.title || "Let's find your fit"}
            </Dialog.Title>
            <Dialog.Close className={styles.close} aria-label="Close">
              ×
            </Dialog.Close>
          </div>

          {!state.succeeded ? (
            <div className={styles.progressWrap}>
              {/* The bar is decorative; the step count below it is the text
                  equivalent, and the total shifts when "Both" adds a step. */}
              <div className={styles.progressTrack} aria-hidden="true">
                <div
                  className={styles.progressBar}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className={styles.progressText}>
                Step {index + 1} of {total}
              </p>
            </div>
          ) : null}

          <div className={styles.body}>
            {/* ---- Done ---- */}
            {state.succeeded ? (
              <div className={styles.panel}>
                <h3 className={styles.question}>
                  {quiz.done?.title || "Got it — your plan is on the way."}
                </h3>
                <p className={styles.help}>{quiz.done?.body}</p>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => handleOpenChange(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : onContact ? (
              /* ---- Contact capture ---- */
              <form className={styles.panel} onSubmit={handleSubmit}>
                <h3
                  className={styles.question}
                  tabIndex={-1}
                  ref={headingRef}
                >
                  {quiz.contact?.question || "Where should we send it?"}
                </h3>
                {quiz.contact?.help ? (
                  <p className={styles.help}>{quiz.contact.help}</p>
                ) : null}

                {/* The answers ride along so the notification email has the
                    full picture without a lookup. */}
                <input
                  type="hidden"
                  name="_subject"
                  value="New quiz lead — WE Creative Agency"
                />
                {steps.map((s) =>
                  s.key ? (
                    <input
                      key={s.key}
                      type="hidden"
                      name={s.key}
                      value={
                        Array.isArray(answers[s.key])
                          ? (answers[s.key] as string[]).join(", ")
                          : (answers[s.key] as string) || ""
                      }
                    />
                  ) : null
                )}

                <div className={styles.fields}>
                  <label className={styles.label} htmlFor="quiz-name">
                    Name
                  </label>
                  <input
                    id="quiz-name"
                    className={styles.input}
                    name="name"
                    required
                    autoComplete="name"
                  />

                  <label className={styles.label} htmlFor="quiz-email">
                    Company email
                  </label>
                  <input
                    id="quiz-email"
                    className={styles.input}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                  />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                    className={styles.error}
                  />

                  <label className={styles.label} htmlFor="quiz-company">
                    Company
                  </label>
                  <input
                    id="quiz-company"
                    className={styles.input}
                    name="company"
                    required
                    autoComplete="organization"
                  />

                  <label className={styles.label} htmlFor="quiz-site">
                    Website <span className={styles.optional}>(optional)</span>
                  </label>
                  <input
                    id="quiz-site"
                    className={styles.input}
                    name="website"
                    type="url"
                    inputMode="url"
                    placeholder="https://"
                    autoComplete="url"
                  />

                  <label className={styles.label} htmlFor="quiz-note">
                    Anything else we should know?{" "}
                    <span className={styles.optional}>(optional)</span>
                  </label>
                  <textarea
                    id="quiz-note"
                    className={styles.textarea}
                    name="message"
                    rows={3}
                  />
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.back}
                    onClick={back}
                  >
                    ← Back
                  </button>
                  <button
                    className="btn btn--primary"
                    type="submit"
                    disabled={state.submitting}
                  >
                    {state.submitting
                      ? "Sending…"
                      : quiz.submitLabel || "Get my plan"}
                  </button>
                </div>
                <ValidationError errors={state.errors} className={styles.error} />
              </form>
            ) : (
              /* ---- A question ---- */
              <div className={styles.panel}>
                <fieldset className={styles.fieldset}>
                  <legend className={styles.srOnly}>{step?.question}</legend>
                  <h3
                    className={styles.question}
                    tabIndex={-1}
                    ref={headingRef}
                  >
                    {step?.question}
                  </h3>
                  {index === 0 && quiz.intro ? (
                    <p className={styles.intro}>{quiz.intro}</p>
                  ) : null}
                  {step?.help ? (
                    <p className={styles.help}>{step.help}</p>
                  ) : null}

                  <div className={styles.options}>
                    {step?.options?.map((o, i) => {
                      const v = valueOf(o);
                      const multi = step.type === "multi";
                      const key = step.key || "";
                      const checked = multi
                        ? ((answers[key] as string[]) || []).includes(v)
                        : answers[key] === v;
                      return (
                        <label
                          key={i}
                          className={`${styles.option} ${
                            checked ? styles.optionOn : ""
                          }`}
                        >
                          <input
                            className={styles.srOnly}
                            type={multi ? "checkbox" : "radio"}
                            name={key}
                            value={v}
                            checked={checked}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={error ? "quiz-error" : undefined}
                            onChange={() =>
                              multi
                                ? toggleMulti(key, v)
                                : setAnswer(key, v)
                            }
                          />
                          <span className={styles.optionLabel}>{o.label}</span>
                          <span className={styles.tick} aria-hidden="true" />
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {error ? (
                  <p id="quiz-error" className={styles.error} role="alert">
                    {error}
                  </p>
                ) : null}

                <div className={styles.actions}>
                  {index > 0 ? (
                    <button type="button" className={styles.back} onClick={back}>
                      ← Back
                    </button>
                  ) : null}
                  {/* Never auto-advance on select: keyboard users arrow through
                      radios, firing change on every option they pass, and a
                      context change on input is a WCAG 3.2.2 failure. */}
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={next}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
