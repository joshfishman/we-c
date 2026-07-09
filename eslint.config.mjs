import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "tina/__generated__/**",
      "public/admin/**",
      "next-env.d.ts",
    ],
  },
  ...coreWebVitals,
  ...typescript,
  // Next's core-web-vitals already registers eslint-plugin-jsx-a11y with its
  // recommended set; we promote the accessibility rules to errors and enable a
  // few stricter checks (reusing Next's registered `jsx-a11y` plugin).
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // The Tina schema + content plumbing is deliberately `any`-typed; keep it
      // a warning rather than blocking lint, so real problems stay visible.
      "@typescript-eslint/no-explicit-any": "warn",
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/html-has-lang": "error",
      "jsx-a11y/iframe-has-title": "error",
      "jsx-a11y/img-redundant-alt": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/no-redundant-roles": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
      "jsx-a11y/tabindex-no-positive": "error",
    },
  },
];

export default eslintConfig;
