# Contributing

Thanks for helping keep links clean.

## Adding or changing rules

1. Open a PR against `main` here on GitHub.
2. **Append** new providers at the end of `data.min.json`. Don't move or
   reformat existing ones; that keeps upstream syncs conflict-free and lets
   additions be offered upstream as-is.
3. Follow the [rules specification](https://docs.clearurls.xyz/latest/specs/rules/).
4. In the PR, include an example URL with the tracking parameters and the
   cleaned URL you expect. Say which parameters are functional and must stay.
5. Keep PRs small: one site per PR.
6. CI must pass (see "Validation" in the README).

## Fixing an upstream rule

If a fix applies to a provider that came from ClearURLs, please also report it
upstream at <https://gitlab.com/ClearURLs/rules> so everyone benefits. We can
carry the fix here in the meantime.

## Syncing upstream

Maintainers: review the weekly "Sync from upstream ClearURLs" PR. Resolve any
conflicts on the `upstream-sync` branch. Keep upstream's deleted
infrastructure files (`CNAME`, `.github/workflows/deploy.yml`, funding and
lockdown config) deleted, then merge with a merge commit.
