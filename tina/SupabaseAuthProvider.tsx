import React, { useState } from "react";
import { AbstractAuthProvider } from "tinacms";

import {
  getSupabaseBrowserClient,
  isAllowedEditor,
} from "../lib/supabase";

/**
 * TinaCMS editor login backed by Supabase Auth.
 *
 * Tina calls getToken() for every content request and puts the result in the
 * Authorization header; the API route then re-verifies that JWT with Supabase
 * server-side (pages/api/tina/[...routes].ts). The browser side here is only a
 * gate on the UI — the server check is the one that actually protects writes.
 */
export class SupabaseAuthProvider extends AbstractAuthProvider {
  /** Email + password, so show Tina's inline login screen rather than redirect. */
  getLoginStrategy() {
    return "LoginScreen" as const;
  }

  /** Tina renders this itself, so hand back the component, not an element. */
  getLoginScreen() {
    return SupabaseLoginScreen;
  }

  async authenticate(props?: Record<string, string>) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: props?.email || "",
      password: props?.password || "",
    });
    if (error) throw error;
    return data;
  }

  /** Tina sends this as `Authorization: Bearer <id_token>`. */
  async getToken() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { id_token: "" };
    const { data } = await supabase.auth.getSession();
    return { id_token: data.session?.access_token || "" };
  }

  async getUser() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return false;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return false;
    // Signed in is not the same as allowed to edit.
    if (!isAllowedEditor(data.user.email)) return false;
    return data.user;
  }

  async logout() {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
  }
}

/** Minimal email/password form rendered inside the Tina admin. */
function SupabaseLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setBusy(false);
      return;
    }
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message);
      setBusy(false);
      return;
    }
    if (!isAllowedEditor(data.user?.email)) {
      await supabase.auth.signOut();
      setError("This account doesn't have editor access.");
      setBusy(false);
      return;
    }
    window.location.reload();
  };

  return (
    <div style={styles.wrap}>
      <form style={styles.card} onSubmit={onSubmit}>
        <h1 style={styles.title}>Sign in to edit</h1>
        <p style={styles.sub}>WE Creative Agency</p>

        <label style={styles.label} htmlFor="sb-email">
          Email
        </label>
        <input
          id="sb-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label} htmlFor="sb-password">
          Password
        </label>
        <input
          id="sb-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {error ? (
          <p role="alert" style={styles.error}>
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={busy} style={styles.button}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d1710",
    fontFamily:
      '"Helvetica Neue", Helvetica, Arial, sans-serif',
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "360px",
    display: "flex",
    flexDirection: "column",
    background: "#fffdf8",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 30px 64px -34px rgba(0,0,0,0.6)",
  },
  title: { margin: 0, fontSize: "22px", color: "#17140f" },
  sub: {
    margin: "6px 0 22px",
    fontSize: "13px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#8a8375",
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#5c584f",
    marginBottom: "6px",
  },
  input: {
    marginBottom: "16px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d8d2c4",
    fontSize: "15px",
  },
  error: {
    margin: "0 0 14px",
    fontSize: "13px",
    color: "#a1301a",
  },
  button: {
    padding: "11px 16px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
    color: "#2a1520",
    background: "linear-gradient(90deg, #f4c06a, #ee9a55, #e0728e)",
  },
};
