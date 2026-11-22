# Link Clear rules

URL-cleaning rules for the [Link Clear](https://github.com/kisst/link-clear)
Android app. This is a fork of the
[ClearURLs rules](https://gitlab.com/ClearURLs/rules), with the full upstream
history, kept in sync with upstream and extended with rules that upstream does
not (yet) have.

The format is unchanged: `data.min.json` follows the
[ClearURLs rules specification](https://docs.clearurls.xyz/latest/specs/rules/),
so anything that reads ClearURLs rules can read these.

## Download

Published to GitHub Pages by CI, only after validation passes:

| File | URL |
|------|-----|
| Rules | <https://kisst.github.io/link-clear-rules/data.min.json> |
| Rules (minified) | <https://kisst.github.io/link-clear-rules/data.minify.json> |
| SHA-256 hashes | `rules.min.hash`, `rules.minify.hash` at the same location |
| Source commit | <https://kisst.github.io/link-clear-rules/commit.txt> |

Link Clear bundles a copy of `data.min.json` and, when the user taps "Update
rules now", downloads `data.min.json` from the URL above.

## How this repo relates to ClearURLs

- **Upstream:** `gitlab.com/ClearURLs/rules`, branch `master`. Our default
  branch is `main`.
- **Syncing:** a weekly workflow (`upstream-sync.yml`) opens a PR from the
  `upstream-sync` branch when upstream has new commits. It reports whether the
  merge is clean and passes validation. A maintainer reviews and merges it
  with a merge commit, so upstream history stays intact.
- **Our additions:** new providers are appended at the end of `data.min.json`,
  following upstream's contributing rules, so they can also be offered
  upstream. When upstream ships an equivalent provider, we drop ours in the
  sync PR.
- **Files changed from upstream:** this README, `CONTRIBUTING.md`, the GitHub
  workflows, and `build_tools/validateLinkClear.cjs` / `build_tools/index.html`.
  Upstream's `CNAME`, GitHub Pages deploy workflow, funding and lockdown
  config were removed because they belong to upstream's own infrastructure.

Additions so far:

| Provider | Why | Upstream |
|----------|-----|----------|
| `temu.com` | Product links carry about a dozen tracking parameters | [ClearURLs/Rules#177](https://github.com/ClearURLs/Rules/issues/177) |

## Validation

`build_tools/validateLinkClear.cjs` runs on every push and PR, alongside
upstream's own tests. It requires:

- a `providers` object with 50 to 5000 providers (the same band the app
  enforces on downloads);
- the long-standing providers `globalRules`, `google` and `amazon`, plus
  `temu.com`;
- every `urlPattern`, `rules`, `rawRules`, `referralMarketing`, `exceptions`
  and `redirections` entry to compile as a regular expression.

Run it locally with Node 20 (for example in Docker):

```bash
node build_tools/validateLinkClear.cjs data.min.json
node --test tests/*.test.cjs
```

## License and credits

The rules are © Kevin Röbert and the ClearURLs contributors, plus the
contributors to this fork, and licensed under the
[GNU LGPL-3.0](LICENSE), the same as upstream.
