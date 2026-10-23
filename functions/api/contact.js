// Cloudflare Pages Function: /api/contact. Secrets belong in Pages settings.
const RECIPIENT = 'cskh@tramhuongkhanhhoa.net.vn';
const HOSTS = new Set(['tramhuongkhanhhoa.net.vn', 'www.tramhuongkhanhhoa.net.vn', 'tramhuongkhanhhoa.pages.dev']);
const PRODUCTS = { 'tram-huong': 'Trầm Hương', 'tram-ruc': 'Trầm Rục', 'tram-toc': 'Trầm Tốc', 'tram-loai-4': 'Trầm loại 4', 'tram-loai-5': 'Trầm loại 5', 'bi-ky-nam': 'Bì Kỳ Nam' };
const json = (value, status = 200) => Response.json(value, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
const configured = (env) => Boolean(env.RESEND_API_KEY && env.CONTACT_FROM && env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY);
const escape = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
function handleGet({ env }) {
  return json({ ready: configured(env), siteKey: configured(env) ? env.TURNSTILE_SITE_KEY : null });
}
async function readBody(request) {
  if (Number(request.headers.get('content-length')) > 16384) throw Error('large');
  const reader = request.body?.getReader();
  if (!reader) throw Error('invalid');
  const parts = []; let length = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 16384) { await reader.cancel(); throw Error('large'); }
    parts.push(value);
  }
  const buffer = new Uint8Array(length); let offset = 0;
  parts.forEach(part => { buffer.set(part, offset); offset += part.length; });
  return JSON.parse(new TextDecoder().decode(buffer));
}
async function handlePost({ request, env }) {
  const url = new URL(request.url);
  if (!HOSTS.has(url.hostname) || request.headers.get('origin') !== url.origin) return json({ ok: false, code: 'origin' }, 403);
  if (!configured(env)) return json({ ok: false, code: 'unavailable' }, 503);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json({ ok: false, code: 'invalid' }, 415);
  let body;
  try { body = await readBody(request); } catch (error) { return json({ ok: false, code: 'invalid' }, error.message === 'large' ? 413 : 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ ok: false, code: 'invalid' }, 400);
  if (body.website) return json({ ok: false, code: 'invalid' }, 400);
  const limits = { name: 100, email: 254, phone: 40, subject: 150, message: 5000, product: 40, token: 2048, requestId: 36 };
  const data = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof body[key] !== 'string' || body[key].length > limit) return json({ ok: false, code: 'invalid' }, 400);
    data[key] = body[key].trim();
  }
  if (!data.name || !data.message || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email) || /[\r\n]/.test(data.name + data.email + data.phone + data.subject) || (data.product && !PRODUCTS[data.product]) || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.requestId)) return json({ ok: false, code: 'invalid' }, 400);
  if (!data.token) return json({ ok: false, code: 'verification' }, 400);
  let verification;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: data.token, remoteip: request.headers.get('CF-Connecting-IP') || undefined }), signal: AbortSignal.timeout(10000) });
    verification = await response.json();
    if (!response.ok) return json({ ok: false, code: 'unavailable' }, 503);
  } catch (_) { return json({ ok: false, code: 'unavailable' }, 503); }
  if (!verification.success || verification.hostname !== url.hostname || verification.action !== 'contact') return json({ ok: false, code: 'verification' }, 400);
  const rows = [['Họ và tên', data.name], ['Email', data.email], ['Số điện thoại', data.phone || 'Không cung cấp'], ['Sản phẩm', PRODUCTS[data.product] || 'Tư vấn chung'], ['Chủ đề', data.subject || 'Liên hệ từ website'], ['Nội dung', data.message], ['Mã liên hệ', data.requestId]];
  const payload = {
    from: env.CONTACT_FROM,
    to: [RECIPIENT],
    reply_to: data.email,
    subject: `[Website] ${data.subject || 'Yêu cầu tư vấn'} – ${data.name}`.slice(0, 240),
    text: rows.map(([label, value]) => `${label}: ${value}`).join('\n\n'),
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#362619"><h2>Liên hệ mới từ website</h2><table style="border-collapse:collapse;width:100%">${rows.map(([label, value]) => `<tr><th style="text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #ddd">${label}</th><td style="padding:10px;border-bottom:1px solid #ddd;white-space:pre-wrap">${escape(value)}</td></tr>`).join('')}</table><p>Nhấn Trả lời để phản hồi trực tiếp cho khách hàng.</p></div>`
  };
  try {
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `contact/${data.requestId}` }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) });
    const result = await response.json();
    if (!response.ok || typeof result.id !== 'string' || !result.id) return json({ ok: false, code: response.status === 429 ? 'busy' : 'delivery' }, response.status === 429 ? 429 : 502);
    return json({ ok: true, reference: data.requestId });
  } catch (_) { return json({ ok: false, code: 'delivery' }, 502); }
}
export function onRequest(context) {
  if (context.request.method === 'GET') return handleGet(context);
  if (context.request.method === 'POST') return handlePost(context);
  return json({ ok: false, code: 'method' }, 405);
}
