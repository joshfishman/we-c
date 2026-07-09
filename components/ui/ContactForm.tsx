"use client";

import { useEffect } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { trackLead, trackFormSubmit } from "../../lib/track";
import styles from "./contactForm.module.css";

/**
 * Contact form — posts to Formspree via the official @formspree/react SDK, so it
 * works on the static/serverless deploy with no backend and no secret key (the
 * form id is public). Notifications are routed to josh@wecreativeagency.com from
 * the Formspree dashboard. Override the form id with NEXT_PUBLIC_FORMSPREE_ID.
 */
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "mdarygor";

export function ContactForm({
  buttonLabel = "Send message →",
  messageLabel = "How can we help?",
  messagePlaceholder = "Tell us about your brand and goals…",
  location = "contact",
  dark = true,
  forest = false,
}: {
  buttonLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  location?: string;
  dark?: boolean;
  forest?: boolean;
}) {
  const [state, handleSubmit] = useForm(FORMSPREE_ID);

  // Fire the GTM conversion events once the submission succeeds.
  useEffect(() => {
    if (state.succeeded) {
      trackFormSubmit(location);
      trackLead("form", location);
    }
  }, [state.succeeded, location]);

  if (state.succeeded) {
    return (
      <div
        className={`${styles.form} ${dark ? styles.dark : ""} ${
          forest ? styles.forest : ""
        } ${styles.done}`}
      >
        <p className={styles.thanks}>Thanks — we&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form
      className={`${styles.form} ${dark ? styles.dark : ""} ${
        forest ? styles.forest : ""
      }`}
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="_subject" value="New enquiry — WE Creative Agency" />
      <div className={styles.row}>
        <input
          className={styles.input}
          name="name"
          placeholder="Your name"
          aria-label="Your name"
          required
          autoComplete="name"
        />
        <input
          className={styles.input}
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          aria-label="Email"
          required
          autoComplete="email"
        />
      </div>
      <ValidationError
        prefix="Email"
        field="email"
        errors={state.errors}
        className={styles.error}
      />
      <label className={styles.srOnly} htmlFor="cf-msg">
        {messageLabel}
      </label>
      <textarea
        id="cf-msg"
        className={styles.textarea}
        name="message"
        rows={4}
        placeholder={messagePlaceholder}
        required
      />
      <ValidationError
        prefix="Message"
        field="message"
        errors={state.errors}
        className={styles.error}
      />
      <button
        className={`btn ${forest ? "btn--secondary" : "btn--primary"} ${styles.submit}`}
        type="submit"
        disabled={state.submitting}
      >
        {state.submitting ? "Sending…" : buttonLabel}
      </button>
      <ValidationError errors={state.errors} className={styles.error} />
    </form>
  );
}
