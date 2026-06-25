// Conventional Commits (enforced via Husky commit-msg hook).
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "ci", "build", "revert"],
    ],
  },
};

export default config;
