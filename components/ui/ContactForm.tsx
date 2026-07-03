"use client";

import { useState } from "react";
import { trackLead, trackFormSubmit } from "../../lib/track";
import styles from "./contactForm.module.css";

/**
 * Contact form. Posts to Formspree (env NEXT_PUBLIC_FORMSPREE_ENDPOINT) so it
 * works on the static/serverless deploy with no backend. Until an endpoint is
 * configured it falls back to a mailto: to the destination address.
 *
 * To wire it up: create a free form at formspree.io whose notifications go to
 * josh@wecreativeagency.com, then set NEXT_PUBLIC_FORMSPREE_ENDPOINT to its URL
 * (https://formspree.io/f/xxxxxxx). (Resend is an alternative — see README.)
 */
export function ContactForm({
  buttonLabel = "Send message →",
  messageLabel = "How can we help?",
  messagePlaceholder = "Tell us about your brand and goals…",
  to = "josh@wecreativeagency.com",
  location = "contact",
  dark = true,
}: {
  buttonLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  to?: string;
  location?: string;
  dark?: boolean;
}) {
  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    // No endpoint yet → open the visitor's mail client to the destination.
    if (!endpoint) {
      const subject = encodeURIComponent(`New enquiry from ${payload.name || "the WE site"}`);
      const body = encodeURIComponent(
        `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`
      );
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      trackFormSubmit(location);
      trackLead(String(payload.email || "form"), location);
      setStatus("ok");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        setStatus("ok");
        form.reset();
        trackFormSubmit(location);
        trackLead(String(payload.email || "form"), location);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "ok") {
    return (
      <div className={`${styles.form} ${dark ? styles.dark : ""} ${styles.done}`}>
        <p className={styles.thanks}>Thanks — we&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form className={`${styles.form} ${dark ? styles.dark : ""}`} onSubmit={onSubmit}>
      <div className={styles.row}>
        <input className={styles.input} name="name" placeholder="Your name" required autoComplete="name" />
        <input className={styles.input} name="email" type="email" placeholder="Email" required autoComplete="email" />
      </div>
      <label className={styles.srOnly} htmlFor="cf-msg">{messageLabel}</label>
      <textarea
        id="cf-msg"
        className={styles.textarea}
        name="message"
        rows={4}
        placeholder={messagePlaceholder}
        required
      />
      <button className={`btn btn--primary ${styles.submit}`} type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : buttonLabel}
      </button>
      {status === "error" ? (
        <p className={styles.error}>Something went wrong — email us directly at {to}.</p>
      ) : null}
    </form>
  );
}
