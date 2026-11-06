(() => {
  const searchButton = document.querySelector('.header__actions .icon-btn');
  const contactUrl = new URL('../pages/contact.html', document.currentScript.src);
  searchButton.insertAdjacentHTML('afterend', `
          <button type="button" class="icon-btn store-search" aria-label="Tìm kiếm sản phẩm" aria-haspopup="dialog">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4 4"/></svg>
            <span>Tìm trầm mộc...</span>
          </button>
          <button type="button" class="store-advice" data-store-dialog="storeAdvice" aria-haspopup="dialog">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5 14.4 9.6 21.5 12 14.4 14.4 12 21.5 9.6 14.4 2.5 12 9.6 9.6Z"/></svg>
            <span>Tư vấn chọn trầm</span>
          </button>
          <button type="button" class="store-cart" data-store-dialog="storeCart" aria-label="Giỏ hàng" aria-haspopup="dialog">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14l1 14H4L5 7Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>
            <span class="store-cart__count" aria-hidden="true" data-cart-count>0</span>
          </button>
  `);
  searchButton.remove();
  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="storeAdvice" class="store-dialog" aria-labelledby="storeAdviceTitle">
      <form method="dialog"><button type="submit" class="store-dialog__close" aria-label="Đóng">×</button></form>
      <h2 id="storeAdviceTitle">Tư vấn chọn trầm (AI)</h2>
      <p>Tính năng tư vấn AI đang được phát triển. Bạn có thể gửi nhu cầu để được cửa hàng tư vấn.</p>
      <a class="btn btn--primary" href="${contactUrl.href}">Liên hệ tư vấn</a>
    </dialog>

    <dialog id="storeCart" class="store-dialog" aria-labelledby="storeCartTitle">
      <form method="dialog"><button type="submit" class="store-dialog__close" aria-label="Đóng">×</button></form>
      <h2 id="storeCartTitle">Giỏ hàng</h2>
      <p data-cart-empty>Giỏ hàng của bạn đang trống.</p>
      <ul class="store-cart__items" data-cart-items></ul>
      <p data-cart-summary hidden>Tạm tính <strong data-cart-total></strong></p>
      <form method="dialog"><button type="submit" class="btn btn--primary">Đóng giỏ hàng</button></form>
    </dialog>
    <p class="store-visually-hidden" role="status" data-cart-status></p>
  `);
  const { byId } = window.siteCatalog;
  const storageKey = 'nha-tram-home-cart';
  const quantityById = new Map();
  const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
  const cartButton = document.querySelector('.store-cart');
  const count = document.querySelector('[data-cart-count]');
  const items = document.querySelector('[data-cart-items]');
  const empty = document.querySelector('[data-cart-empty]');
  const summary = document.querySelector('[data-cart-summary]');
  const total = document.querySelector('[data-cart-total]');
  const status = document.querySelector('[data-cart-status]');

  function restoreCart() {
    quantityById.clear();
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      for (const [id, quantity] of Object.entries(saved)) {
        if (Object.hasOwn(byId, id) && Number.isSafeInteger(quantity) && quantity > 0) {
          quantityById.set(id, Math.min(quantity, 99));
        }
      }
    } catch {
      // The cart still works for this visit if storage is unavailable.
    }
  }

  function renderCart() {
    let itemCount = 0;
    let subtotal = 0;
    const rows = Array.from(quantityById, ([id, quantity]) => {
      const product = byId[id];
      const lineTotal = product.priceVnd * quantity;
      itemCount += quantity;
      subtotal += lineTotal;

      const row = document.createElement('li');
      const description = document.createElement('div');
      const name = document.createElement('strong');
      const amount = document.createElement('div');
      const remove = document.createElement('button');
      name.textContent = product.name;
      amount.textContent = `×${quantity} · ${formatPrice.format(lineTotal)}`;
      remove.type = 'button';
      remove.textContent = 'Xóa';
      remove.setAttribute('aria-label', `Xóa ${product.name} khỏi giỏ hàng`);
      remove.addEventListener('click', () => {
        quantityById.delete(id);
        saveCart();
        status.textContent = `Đã xóa ${product.name} khỏi giỏ hàng.`;
        (items.querySelector('button') || document.querySelector('#storeCart .store-dialog__close')).focus();
      });
      description.append(name, amount);
      row.append(description, remove);
      return row;
    });

    items.replaceChildren(...rows);
    count.textContent = itemCount;
    cartButton.setAttribute('aria-label', `Giỏ hàng, ${itemCount} sản phẩm`);
    empty.hidden = itemCount > 0;
    summary.hidden = itemCount === 0;
    total.textContent = formatPrice.format(subtotal);
  }

  function saveCart() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(quantityById)));
    } catch {
      // Keep the in-memory cart when storage is unavailable.
    }
    renderCart();
  }

  document.querySelectorAll('[data-store-dialog]').forEach(button => {
    button.addEventListener('click', () => document.getElementById(button.dataset.storeDialog).showModal());
  });

  document.querySelectorAll('[data-cart-add]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.cartAdd;
      const quantity = quantityById.get(id) || 0;
      if (quantity >= 99) {
        status.textContent = 'Sản phẩm đã đạt số lượng tối đa trong giỏ hàng.';
        return;
      }
      quantityById.set(id, quantity + 1);
      saveCart();
      status.textContent = `Đã thêm ${byId[id].name} vào giỏ hàng. Giỏ hiện có ${count.textContent} sản phẩm.`;
    });
  });

  restoreCart();
  renderCart();
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      restoreCart();
      renderCart();
    }
  });
})();
