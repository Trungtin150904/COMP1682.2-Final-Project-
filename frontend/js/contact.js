(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#contactForm');
    if (!form) return;
    const button = form.querySelector('[type="submit"]');
    const status = form.querySelector('[data-contact-status]');
    const widget = form.querySelector('[data-contact-verification]');
    if (widget) widget.hidden = true;
    let sending = false, lastPayload = '', requestId = '';
    button.disabled = false;
    const show = (message, state) => {
      status.textContent = message; status.dataset.state = state; status.hidden = false;
    };
    const t = text => window.siteI18n?.t(text) || text;
    const english = window.siteI18n?.language === 'en';
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending || !form.reportValidity()) return;
      const fields = new FormData(form);
      const payload = Object.fromEntries(['name','email','phone','subject','message','product','website']
        .map(key => [key, String(fields.get(key) || '').trim()]));
      const serialized = JSON.stringify(payload);
      if (!requestId || serialized !== lastPayload) { requestId = crypto.randomUUID(); lastPayload = serialized; }
      sending = true; button.disabled = true;
      button.textContent = t('Đang gửi...'); form.setAttribute('aria-busy', 'true');
      show(english ? 'Saving your enquiry...' : 'Đang lưu yêu cầu...', 'pending');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch('/api/contact', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body:JSON.stringify({...payload,requestId}), signal:controller.signal
        });
        const result = await response.json();
        if (!response.ok || result.ok !== true) throw Error(result.code || 'failed');
        form.reset(); form.querySelector('#product')?.dispatchEvent(new Event('change'));
        requestId = ''; lastPayload = '';
        show(english ? 'Your enquiry has been saved in the local project database. No email was sent.' : 'Đã lưu yêu cầu vào database của dự án local. Hệ thống không gửi email.', 'success');
      } catch (_) {
        show(english ? 'Could not save your enquiry. Check that the local backend and SQL Server are running. Your entries have been kept.' : 'Chưa lưu được yêu cầu. Hãy kiểm tra backend local và SQL Server. Nội dung bạn nhập vẫn được giữ nguyên.', 'error');
      } finally {
        clearTimeout(timeout); sending = false; button.disabled = false;
        button.textContent = t('Gửi liên hệ'); form.removeAttribute('aria-busy');
      }
    });
  });
})();
