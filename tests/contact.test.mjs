import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const source = await readFile(new URL('../functions/api/contact.js', import.meta.url), 'utf8');
const { onRequest } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const env = { RESEND_API_KEY: 'test-key-not-real', CONTACT_FROM: 'Website <website@notify.tramhuongkhanhhoa.net.vn>', TURNSTILE_SITE_KEY: 'test-site-key', TURNSTILE_SECRET_KEY: 'test-secret-not-real' };
const origin = 'https://tramhuongkhanhhoa.net.vn';
const valid = { name: 'Khách hàng', email: 'visitor@example.com', phone: '0901234567', subject: 'Tư vấn', product: 'tram-loai-4', message: 'Xin tư vấn sản phẩm.', website: '', token: 'test-token', requestId: '12345678-1234-4123-8123-123456789012' };
function request(body = valid, headers = {}, url = `${origin}/api/contact`) {
  return new Request(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
}
async function run(req, settings = env, responses = []) {
  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    const response = responses.shift();
    if (response instanceof Error) throw response;
    if (!response) throw Error('Unexpected external request');
    return Response.json(response.body, { status: response.status || 200 });
  };
  try { const response = await onRequest({ request: req, env: settings }); return { status: response.status, body: await response.json(), calls }; }
  finally { globalThis.fetch = originalFetch; }
}
const verified = { body: { success: true, hostname: 'tramhuongkhanhhoa.net.vn', action: 'contact' } };
test('public configuration returns only readiness and the public site key', async () => {
  const result = await run(new Request(`${origin}/api/contact`));
  assert.deepEqual(result.body, { ready: true, siteKey: 'test-site-key' });
  assert.equal(result.calls.length, 0);
});
test('unconfigured form fails closed', async () => {
  const result = await run(request(), {});
  assert.equal(result.status, 503); assert.equal(result.body.ok, false); assert.equal(result.calls.length, 0);
});
test('foreign origin is rejected without sending mail', async () => {
  const result = await run(request(valid, { Origin: 'https://untrusted.example' }));
  assert.equal(result.status, 403); assert.equal(result.calls.length, 0);
});
test('preview host cannot use production mail credentials', async () => {
  const result = await run(request(valid, { Origin: 'https://preview.example' }, 'https://preview.example/api/contact'));
  assert.equal(result.status, 403);
});
test('unsupported method and content type are rejected', async () => {
  assert.equal((await run(new Request(`${origin}/api/contact`, { method: 'PUT' }))).status, 405);
  assert.equal((await run(request(valid, { 'Content-Type': 'text/plain' }))).status, 415);
});
test('invalid input and unknown products do not reach providers', async () => {
  for (const patch of [{ name: '' }, { message: ' ' }, { email: 'invalid' }, { email: 'a@b.com\r\nBCC:x@y.com' }, { subject: 'x\r\nBCC:y' }, { product: 'unknown' }, { name: 123 }, { requestId: 'bad' }, { website: 'bot.example' }]) {
    const result = await run(request({ ...valid, ...patch }));
    assert.equal(result.status, 400); assert.equal(result.calls.length, 0);
  }
});
test('malformed and oversized JSON are rejected', async () => {
  assert.equal((await run(request('{'))).status, 400);
  assert.equal((await run(request('x'.repeat(17000)))).status, 413);
});
test('field limits prevent oversized messages', async () => {
  assert.equal((await run(request({ ...valid, message: 'x'.repeat(5001) }))).status, 400);
});
test('missing verification token blocks delivery', async () => {
  const result = await run(request({ ...valid, token: '' }));
  assert.equal(result.body.code, 'verification'); assert.equal(result.calls.length, 0);
});
test('failed, wrong-host or wrong-action verification blocks delivery', async () => {
  for (const body of [{ success: false }, { success: true, hostname: 'evil.example', action: 'contact' }, { success: true, hostname: 'tramhuongkhanhhoa.net.vn', action: 'other' }]) {
    const result = await run(request(), env, [{ body }]);
    assert.equal(result.status, 400); assert.equal(result.calls.length, 1);
  }
});
test('verification service outage never returns success', async () => {
  const result = await run(request(), env, [Error('offline')]);
  assert.equal(result.status, 503); assert.equal(result.body.ok, false);
});
test('successful delivery has fixed recipient, visitor reply-to and escaped HTML', async () => {
  const result = await run(request({ ...valid, message: '<script>alert(1)</script>\nNội dung', to: 'attacker@example.com' }), env, [verified, { body: { id: 'mail-id' } }]);
  assert.equal(result.status, 200); assert.equal(result.body.ok, true);
  assert.equal(result.calls.length, 2);
  const mail = JSON.parse(result.calls[1].options.body);
  assert.deepEqual(mail.to, ['cskh@tramhuongkhanhhoa.net.vn']);
  assert.equal(mail.reply_to, valid.email);
  assert(mail.html.includes('&lt;script&gt;')); assert(!mail.html.includes('<script>'));
  assert(mail.text.includes('0901234567')); assert(mail.text.includes('Trầm loại 4'));
  assert.equal(result.calls[1].options.headers['Idempotency-Key'], `contact/${valid.requestId}`);
  assert(!JSON.stringify(result.body).includes('test-key'));
});
test('provider rejection or missing receipt never becomes success', async () => {
  for (const response of [{ status: 403, body: { message: 'Domain not verified' } }, { body: {} }, Error('timeout')]) {
    const result = await run(request(), env, [verified, response]);
    assert.equal(result.status, 502); assert.equal(result.body.ok, false);
  }
});
test('provider throttling reports a retryable busy response', async () => {
  const result = await run(request(), env, [verified, { status: 429, body: {} }]);
  assert.equal(result.status, 429); assert.equal(result.body.code, 'busy');
});
test('retrying identical content uses the same idempotency key and mail body', async () => {
  const first = await run(request(), env, [verified, { body: { id: 'same-id' } }]);
  const second = await run(request({ ...valid, token: 'fresh-token' }), env, [verified, { body: { id: 'same-id' } }]);
  assert.equal(first.calls[1].options.body, second.calls[1].options.body);
  assert.equal(first.calls[1].options.headers['Idempotency-Key'], second.calls[1].options.headers['Idempotency-Key']);
});
