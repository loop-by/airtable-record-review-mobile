import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSource, resolveSource, shareUrl } from './dist/source-url.mjs';
const EXAMPLE_SOURCE = 'https://airtable.com/appABCDEFGHIJKLMN/shrABCDEFGHIJKLMN';

test('missing source parameter never selects an Interface', () => {
  assert.equal(resolveSource(''), null);
  assert.equal(resolveSource('?unrelated=1'), null);
});
test('an explicit public Interface is the only source', () => {
  assert.equal(resolveSource('?url=' + encodeURIComponent(EXAMPLE_SOURCE)).embed,
    'https://airtable.com/embed/appABCDEFGHIJKLMN/shrABCDEFGHIJKLMN');
});
test('record/filter query parameters and hash survive nested URL encoding and sharing', () => {
  const original = EXAMPLE_SOURCE + '?filter=recABCDEFGHIJKLMN&search=a%26b#section';
  const shared = shareUrl('https://example.com/reader?old=1#settings', original);
  assert.equal(resolveSource(new URL(shared).search).original, original);
  assert.equal(resolveSource(new URL(shared).search).embed,
    'https://airtable.com/embed/appABCDEFGHIJKLMN/shrABCDEFGHIJKLMN?filter=recABCDEFGHIJKLMN&search=a%26b#section');
});
test('official embed links normalize to the original and do not duplicate embed', () => {
  const value = 'https://www.airtable.com/embed/appABCDEFGHIJKLMN/shrABCDEFGHIJKLMN/';
  assert.equal(parseSource(value).original, EXAMPLE_SOURCE);
  assert.equal(parseSource(value).embed, EXAMPLE_SOURCE.replace('.com/', '.com/embed/'));
});
test('invalid explicit parameters are rejected without a fallback', () => {
  for (const value of ['', 'javascript:alert(1)', 'https://example.com/',
    'https://airtable.com.evil.test/appABCDEFGHIJKLMN/shrABCDEFGHIJKLMN',
    EXAMPLE_SOURCE.replace('https:', 'http:'), EXAMPLE_SOURCE.replace('airtable.com', 'user:pass@airtable.com'),
    EXAMPLE_SOURCE.replace('/shrABCDEFGHIJKLMN', '/pagABCDEFGHIJKLMN')]) {
    assert.throws(() => resolveSource('?url=' + encodeURIComponent(value)));
  }
});

test('URL parser rejects scheme, authority and encoded-path bypasses', () => {
  const path = '/appABCDEFGHIJKLMN/shrABCDEFGHIJKLMN';
  for (const value of [
    'data:text/html,<script>alert(1)</script>',
    '//airtable.com' + path,
    'https://airtable.com:444' + path,
    'https://airtable.com.' + path,
    'https://airtable.com@attacker.invalid' + path,
    'https://attacker.invalid@airtable.com' + path,
    'https://airtable.com/%61ppABCDEFGHIJKLMN/shrABCDEFGHIJKLMN',
    'https://airtable.com' + path + '/extra',
    '<img src=x onerror=alert(1)>'
  ]) assert.throws(() => parseSource(value));
});
