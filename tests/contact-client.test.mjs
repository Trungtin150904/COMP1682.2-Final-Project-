import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';
const source = await readFile(new URL('../js/contact.js', import.meta.url), 'utf8');
async function setup({ configured = true, submission = { ok: true }, httpOK = true } = {}) {
  let start, submit, calls = 0, reset = 0, tokenReset = 0;
  const button = { disabled: false, textContent: 'Gửi liên hệ' };
  const status = { hidden: true, dataset: {} };
  const fields = { name: 'Khách', email: 'visitor@example.com', phone: '', subject: '', message: 'Xin tư vấn', product: 'tram-huong', website: '' };
  const form = {
    querySelector: selector => selector === '[type="submit"]' ? button : selector === '[data-contact-status]' ? status : selector === '[data-contact-verification]' ? {} : null,
    addEventListener: (name, fn) => { if (name === 'submit') submit = fn; },
    setAttribute() {}, removeAttribute() {}, reportValidity: () => true, reset: () => { reset++; }
  };
  const ctx = {
    document: { querySelector: () => form, addEventListener: (_, fn) => { start = fn; } },
    window: { siteI18n: { language: 'vi', t: value => value }, turnstile: { render: (_, opts) => { opts.callback('valid-token'); return 0; }, reset: () => { tokenReset++; } } },
    FormData: class { get(key) { return fields[key]; } }, Event: class {},
    crypto: { randomUUID: () => '12345678-1234-4123-8123-123456789012' },
    AbortController, setTimeout, clearTimeout,
    fetch: async (_, options) => {
      if (options.method === 'POST') { calls++; return { ok: httpOK, json: async () => submission }; }
      return { ok: true, json: async () => ({ ready: configured, siteKey: configured ? 'site-key' : null }) };
    }
  };
  vm.runInNewContext(source, ctx);
  await start();
  await new Promise(resolve => setImmediate(resolve));
  return { button, status, submit: () => submit({ preventDefault() {} }), counts: () => ({ calls, reset, tokenReset }) };
}
test('unconfigured form stays disabled and provides direct email fallback', async () => {
  const form = await setup({ configured: false });
  assert(form.button.disabled); assert(form.status.textContent.includes('cskh@'));
  await form.submit(); assert.equal(form.counts().calls, 0);
});
test('confirmed success resets the form and refreshes verification', async () => {
  const form = await setup();
  assert.equal(form.button.disabled, false);
  await form.submit();
  assert.equal(form.status.dataset.state, 'success');
  assert.deepEqual(form.counts(), { calls: 1, reset: 1, tokenReset: 1 });
});
test('delivery failure preserves entered data and never displays success', async () => {
  const form = await setup({ submission: { ok: false, code: 'delivery' }, httpOK: false });
  await form.submit();
  assert.equal(form.status.dataset.state, 'error'); assert.equal(form.counts().reset, 0);
  assert(form.status.textContent.includes('Chưa gửi')); assert(form.button.disabled);
});
