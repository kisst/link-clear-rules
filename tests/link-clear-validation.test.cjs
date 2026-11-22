/* Link Clear rules — SPDX-License-Identifier: LGPL-3.0-or-later */
const test = require('node:test');
const assert = require('node:assert');
const { readFileSync } = require('node:fs');
const { validate, REQUIRED_PROVIDERS } = require('../build_tools/validateLinkClear.cjs');

function catalogWith(extra = {}) {
  const providers = {};
  for (let i = 0; i < 60; i++) providers[`p${i}`] = { urlPattern: '.*' };
  for (const name of REQUIRED_PROVIDERS) providers[name] = { urlPattern: '.*' };
  return { providers: { ...providers, ...extra } };
}

test('the shipped data.min.json passes', () => {
  assert.deepStrictEqual(validate(JSON.parse(readFileSync('data.min.json', 'utf8'))), []);
});

test('a broken pattern is reported with its provider', () => {
  const errors = validate(catalogWith({ bad: { urlPattern: '.*', rules: ['(unclosed'] } }));
  assert.strictEqual(errors.length, 1);
  assert.match(errors[0], /^bad: invalid rules pattern/);
});

test('a truncated ruleset is rejected', () => {
  const errors = validate({ providers: { globalRules: { urlPattern: '.*' } } });
  assert.ok(errors.some((e) => e.includes('provider count')));
  assert.ok(errors.some((e) => e.includes('"temu.com"')));
});

test('a missing providers object is rejected', () => {
  assert.deepStrictEqual(validate({}), ['top level must contain a "providers" object']);
});
