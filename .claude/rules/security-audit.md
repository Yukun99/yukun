# Security Audit

Follow this order when the user asks for a security audit.

1. Run `pnpm audit` from the repo root to list vulnerabilities.
2. Fix by bumping versions in `package.json` first. For each advisory, walk the dependency chain (`pnpm why <pkg>`) all the way up and start from the furthest-upstream package that is a direct dependency — the real root cause — rather than the vulnerable transitive package. Keep versions pinned exactly.
3. Only if a bump can't fix it, add an override (`overrides` in `pnpm-workspace.yaml`).
4. Once steps 1–3 are done, review every override, old and new: is it still needed, and is there a newer version of its dependents that would make it unnecessary? Prefer bumping the dependent and deleting the override.
5. Ask the user before any fix that needs special handling, e.g. bypassing the 3-day cooldown on newly published versions (`minimumReleaseAge` / `minimumReleaseAgeExclude`). Never work around it unprompted.

Re-run `pnpm audit` after each round to confirm, and report what was bumped, what was overridden, which overrides were removed, and anything left unfixed.
