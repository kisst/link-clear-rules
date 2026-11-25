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
| `twitter`, `x` | `a`, added by "Copy link" | [PR 354](https://github.com/ClearURLs/Rules/pull/354) |
| `instagram` | `igsi`, `exln`, `stkn` share ids | [PR 321](https://github.com/ClearURLs/Rules/pull/321), [PR 350](https://github.com/ClearURLs/Rules/pull/350), [PR 332](https://github.com/ClearURLs/Rules/pull/332) |
| `instagram`, `vk.com` | Redirects only to http(s) targets, only on the real link wrappers | [MR 89](https://gitlab.com/ClearURLs/rules/-/merge_requests/89) |
| `youtube` | `is`, the mobile app's `si` | [PR 191](https://github.com/ClearURLs/Rules/pull/191) |
| `threads` (new) | `xmt` on threads.com and threads.net | [PR 179](https://github.com/ClearURLs/Rules/pull/179) |
| `tiktok.com` | `is_from_webapp`, `sender_device` | [PR 199](https://github.com/ClearURLs/Rules/pull/199) |
| `bilibili.com`, `live.bilibili.com` | `trackid`, `spmid`, `from_spmid`, `launch_id` | [PR 337](https://github.com/ClearURLs/Rules/pull/337), [PR 127](https://github.com/ClearURLs/Rules/pull/127), [MR 72](https://gitlab.com/ClearURLs/rules/-/merge_requests/72) |
| `ebay` | `_skw`, `itmmeta`, `itmprp` | [issue 310](https://gitlab.com/ClearURLs/rules/-/issues/310) |
| `aliexpress` | Share and recommendation ids (`sku_id` kept) | [issue 326](https://gitlab.com/ClearURLs/rules/-/issues/326), [PR 317](https://github.com/ClearURLs/Rules/pull/317) |
| `github.com` | `notification_referrer_id` | [issue 114](https://github.com/ClearURLs/Rules/issues/114) |
| `LinkedIn` | `isSelfProfile` | [issue 348](https://github.com/ClearURLs/Rules/issues/348) |
| `steampowered` | `curator_clanid` | [issue 349](https://github.com/ClearURLs/Rules/issues/349) |
| `airbnb` | Also airbnb.fr | [MR 75](https://gitlab.com/ClearURLs/rules/-/merge_requests/75) |
| `globalRules` | Ad-click and email ids: `ttclid`, `li_fat_id`, `[gw]braid`, HubSpot, Klaviyo, Segment and others | [MR 90](https://gitlab.com/ClearURLs/rules/-/merge_requests/90) |
| `globalRules` | Eloqua `elq*` | [MR 1](https://gitlab.com/ClearURLs/rules/-/merge_requests/1) |
| `globalRules` | beehiiv `_bhlid` | [PR 190](https://github.com/ClearURLs/Rules/pull/190) |
| `globalRules` | `ysclid`, `pk_cid` | [issue 350](https://gitlab.com/ClearURLs/rules/-/issues/350) |
| `globalRules` | Piano `pnespid` | [issue 112](https://github.com/ClearURLs/Rules/issues/112) |
| `globalRules` | Greenhouse `gh_src` | [issue 345](https://gitlab.com/ClearURLs/rules/-/issues/345) |

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
