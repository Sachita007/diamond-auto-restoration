// Run: node diamond-auto-restoration/smoke-ghl-success.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const frame = { id: 'inline-GTAlCCv4SFtoIZ1TMQ0A-0', dataset: { formId: 'GTAlCCv4SFtoIZ1TMQ0A' }, contentWindow: {} };
let listener;
const destinations = [];
runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], {
  URL,
  document: { querySelectorAll: () => [frame] },
  window: {
    addEventListener: (_, callback) => { listener = callback; },
    location: { href: 'https://example.com/diamond/', assign: url => destinations.push(url) },
  },
});
const data = ['set-sticky-contacts', `embedded_iframe_${frame.id}`, frame.id, 'Bl44IxhoWBTyvmtlsVUf', 'synthetic-success'];
const event = { origin: 'https://api.leadconnectorhq.com', source: frame.contentWindow, data };
for (const invalid of [
  { origin: 'https://untrusted.example' },
  { source: {} },
  { data: { submitted: true } },
  ...[ [0, 'resize'], [1, 'another-storage-key'], [2, 'another-frame'], [3, 'another-location'], [4, ''] ]
    .map(([index, value]) => ({ data: data.map((item, i) => i === index ? value : item) })),
]) listener({ ...event, ...invalid });
assert.deepEqual(destinations, [], 'Untrusted or incomplete messages must not show success');
listener(event);
assert.deepEqual(destinations, ['https://example.com/diamond/thank-you.html']);
console.log('GHL success-message boundary checks passed; no lead submitted.');
