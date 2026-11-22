/* Link Clear rules — SPDX-License-Identifier: LGPL-3.0-or-later */
/*
 * Structural checks run before anything is published. They mirror what the
 * Link Clear app requires of a downloaded default ruleset (provider-count band,
 * long-standing providers present), so a commit that would be rejected by the
 * app never reaches Pages. On top of that every pattern must compile, so one
 * typo cannot silently disable a provider.
 */
const { readFileSync } = require('node:fs');

const MIN_PROVIDERS = 50;
const MAX_PROVIDERS = 5000;
const REQUIRED_PROVIDERS = ['globalRules', 'google', 'amazon', 'temu.com'];
const PATTERN_LISTS = ['rules', 'rawRules', 'referralMarketing', 'exceptions', 'redirections'];

function validate(catalog) {
  const errors = [];
  const providers = catalog?.providers;
  if (!providers || typeof providers !== 'object' || Array.isArray(providers)) {
    return ['top level must contain a "providers" object'];
  }
  const names = Object.keys(providers);
  if (names.length < MIN_PROVIDERS || names.length > MAX_PROVIDERS) {
    errors.push(`provider count ${names.length} outside ${MIN_PROVIDERS}..${MAX_PROVIDERS}`);
  }
  for (const required of REQUIRED_PROVIDERS) {
    if (!names.includes(required)) errors.push(`required provider "${required}" is missing`);
  }
  for (const [name, provider] of Object.entries(providers)) {
    if (typeof provider?.urlPattern !== 'string') {
      errors.push(`${name}: urlPattern must be a string`);
      continue;
    }
    const patterns = [['urlPattern', provider.urlPattern]];
    for (const list of PATTERN_LISTS) {
      const value = provider[list];
      if (value === undefined) continue;
      if (!Array.isArray(value) || value.some((p) => typeof p !== 'string')) {
        errors.push(`${name}: ${list} must be an array of strings`);
        continue;
      }
      for (const p of value) patterns.push([list, p]);
    }
    for (const [field, pattern] of patterns) {
      try {
        new RegExp(pattern, 'i');
      } catch (e) {
        errors.push(`${name}: invalid ${field} pattern ${JSON.stringify(pattern)} (${e.message})`);
      }
    }
  }
  return errors;
}

module.exports = { validate, REQUIRED_PROVIDERS };

if (require.main === module) {
  const file = process.argv[2] ?? 'data.min.json';
  const errors = validate(JSON.parse(readFileSync(file, 'utf8')));
  if (errors.length > 0) {
    for (const e of errors) console.error(`::error file=${file}::${e}`);
    process.exit(1);
  }
  console.log(`${file}: ${Object.keys(JSON.parse(readFileSync(file, 'utf8')).providers).length} providers OK`);
}
