(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('#contactForm');
    if (!form) return;
    const button = form.querySelector('[type="submit"]');
    const status = form.querySelector('[data-contact-status]');
    const widget = form.querySelector('[data-contact-verification]');
    const t = value => window.siteI18n?.t(value) || value;
    const fetchTimed = async (url, options, milliseconds) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), milliseconds);
      try { return await fetch(url, { ...options, signal: controller.signal }); }
      finally { clearTimeout(timer); }
    };
    let token = '', widgetId, sending = false, ready = false, lastPayload = '', requestId = '';
    const show = (message, type = 'error') => { status.textContent = t(message); status.dataset.state = type; status.hidden = false; };
    const unavailable = () => show('Form liên hệ tạm thời chưa sẵn sàng. Bạn vui lòng gửi email trực tiếp đến cskh@tramhuongkhanhhoa.net.vn.');
    button.disabled = true;
    const initialize = async () => {
    try {
      const response = await fetchTimed('/api/contact', { headers: { Accept: 'application/json' } }, 12000);
      if (!response.ok) throw Error('config');
      const config = await response.json();
      if (!config.ready || typeof config.siteKey !== 'string') throw Error('config');
      await new Promise((resolve, reject) => {
        if (window.turnstile) return resolve();
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        const timer = setTimeout(() => reject(Error('timeout')), 15000);
        script.onload = () => { clearTimeout(timer); resolve(); };
        script.onerror = () => { clearTimeout(timer); reject(Error('script')); };
        document.head.appendChild(script);
      });
      widgetId = window.turnstile.render(widget, {
        sitekey: config.siteKey, action: 'contact', language: window.siteI18n?.language || 'vi', size: 'flexible',
        callback: value => { token = value; ready = true; button.disabled = sending; },
        'expired-callback': () => { token = ''; button.disabled = true; },
        'error-callback': () => { token = ''; button.disabled = true; show('Không thể xác minh. Vui lòng tải lại trang hoặc liên hệ qua email.'); }
      });
    } catch (_) { unavailable(); }
    };
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending) return;
      if (!ready) { unavailable(); return; }
      if (!token) { show('Vui lòng hoàn tất xác minh trước khi gửi.'); return; }
      if (!form.reportValidity()) return;
      const fields = new FormData(form);
      const payload = Object.fromEntries(['name','email','phone','subject','message','product','website'].map(key => [key, String(fields.get(key) || '').trim()]));
      if (!payload.name || !payload.message || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(payload.email)) { show('Vui lòng điền đầy đủ họ tên, email và nội dung liên hệ.'); return; }
      const serialized = JSON.stringify(payload);
      if (serialized !== lastPayload || !requestId) { requestId = crypto.randomUUID(); lastPayload = serialized; }
      sending = true;
      button.disabled = true;
      button.textContent = t('Đang gửi...');
      form.setAttribute('aria-busy', 'true');
      show('Đang gửi thông tin liên hệ...', 'pending');
      try {
        const response = await fetchTimed('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...payload, token, requestId }) }, 30000);
        const result = await response.json();
        if (!response.ok || result.ok !== true) {
          const errors = { invalid: 'Thông tin chưa hợp lệ. Vui lòng kiểm tra lại các trường đã nhập.', verification: 'Xác minh đã hết hạn. Vui lòng xác minh lại rồi gửi.', unavailable: 'Form liên hệ tạm thời chưa sẵn sàng. Bạn vui lòng gửi email trực tiếp đến cskh@tramhuongkhanhhoa.net.vn.', busy: 'Hệ thống đang bận. Vui lòng thử lại sau ít phút.' };
          throw Error(errors[result.code] || 'Chưa gửi được thông tin. Vui lòng thử lại hoặc gửi email trực tiếp đến cskh@tramhuongkhanhhoa.net.vn.');
        }
        form.reset();
        form.querySelector('#product')?.dispatchEvent(new Event('change'));
        requestId = ''; lastPayload = '';
        show('Thông tin đã được gửi thành công. Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.', 'success');
      } catch (error) {
        const message = error.name === 'TimeoutError' || error.name === 'AbortError' ? 'Kết nối bị gián đoạn. Vui lòng thử lại; thông tin bạn nhập vẫn được giữ nguyên.' : error.message;
        show(message.startsWith('Thông tin') || message.startsWith('Xác minh') || message.startsWith('Form liên hệ') || message.startsWith('Hệ thống') || message.startsWith('Chưa gửi') || message.startsWith('Kết nối') ? message : 'Chưa gửi được thông tin. Vui lòng thử lại hoặc gửi email trực tiếp đến cskh@tramhuongkhanhhoa.net.vn.');
      } finally {
        sending = false; token = '';
        form.removeAttribute('aria-busy');
        button.textContent = t('Gửi liên hệ');
        button.disabled = true;
        if (widgetId !== undefined) window.turnstile.reset(widgetId);
      }
    });
    initialize();
  });
})();
