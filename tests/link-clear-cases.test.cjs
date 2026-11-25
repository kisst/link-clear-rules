/* Link Clear rules — SPDX-License-Identifier: LGPL-3.0-or-later */
// Example URLs for rules added in this fork. Each case lists query parameters
// that must be stripped and ones that must survive, or the redirect target a
// URL must (or, with null, must not) resolve to.
const test = require('node:test');
const assert = require('node:assert');
const { readFileSync } = require('node:fs');

const { providers } = JSON.parse(readFileSync('data.min.json', 'utf8'));
const cases = JSON.parse(readFileSync('tests/link-clear-cases.json', 'utf8'));

function matching(url) {
  return Object.values(providers).filter(
    (p) =>
      new RegExp(p.urlPattern, 'i').test(url) &&
      !(p.exceptions || []).some((e) => new RegExp(e, 'i').test(url)),
  );
}

function strippedParams(url) {
  const rules = matching(url)
    .flatMap((p) => [...(p.rules || []), ...(p.referralMarketing || [])])
    .map((r) => new RegExp(`^(?:${r})$`, 'i'));
  const keys = [...new URL(url).searchParams.keys()];
  return new Set(keys.filter((k) => rules.some((r) => r.test(k))));
}

function redirectTarget(url) {
  for (const p of matching(url)) {
    for (const r of p.redirections || []) {
      const m = new RegExp(r, 'i').exec(url);
      if (m) return decodeURIComponent(m[1]);
    }
  }
  return null;
}

for (const c of cases) {
  test(c.url, () => {
    if ('redirect' in c) {
      assert.strictEqual(redirectTarget(c.url), c.redirect);
      return;
    }
    const stripped = strippedParams(c.url);
    for (const k of c.strip || []) assert.ok(stripped.has(k), `${k} should be stripped`);
    for (const k of c.keep || []) assert.ok(!stripped.has(k), `${k} should be kept`);
  });
}
