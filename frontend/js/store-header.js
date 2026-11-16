(() => {
  const searchButton = document.querySelector('.header__actions .icon-btn');
  const siteRoot = new URL('../', document.currentScript.src);
  const contactUrl = new URL('pages/contact.html', siteRoot);
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

    <dialog id="storeCart" class="store-dialog store-cart-dialog" aria-labelledby="storeCartTitle">
      <form method="dialog"><button type="submit" class="store-dialog__close" aria-label="Đóng giỏ hàng">×</button></form>
      <h2 id="storeCartTitle">Giỏ hàng</h2>
      <p data-cart-empty>Giỏ hàng của bạn đang trống.</p>
      <div class="store-cart__layout" data-cart-summary hidden>
        <section aria-label="Sản phẩm trong giỏ">
          <p class="store-cart__item-count" data-cart-item-count></p>
          <ul class="store-cart__items" data-cart-items></ul>
        </section>
        <aside class="store-cart__checkout" aria-labelledby="checkoutTitle">
          <h3 id="checkoutTitle">Chi tiết thanh toán</h3>
          <dl class="store-cart__totals">
            <div><dt>Tạm tính</dt><dd data-cart-subtotal></dd></div>
            <div><dt>Phí giao hàng</dt><dd>Chờ xác nhận</dd></div>
            <div class="store-cart__total"><dt>Tổng tiền hàng</dt><dd data-cart-total></dd></div>
          </dl>
          <form class="store-cart__form" data-checkout-form>
            <h4>Thông tin giao hàng</h4>
            <label>Họ và tên<input name="name" autocomplete="shipping name" required maxlength="100"></label>
            <label>Số điện thoại<input name="phone" type="tel" autocomplete="shipping tel" required maxlength="25"></label>
            <label>Email (không bắt buộc)<input name="email" type="email" autocomplete="shipping email" maxlength="254"></label>
            <label>Địa chỉ giao hàng<textarea name="address" autocomplete="shipping street-address" required maxlength="300" rows="2" placeholder="Số nhà, đường, xã/phường, tỉnh/thành phố"></textarea></label>
            <label>Ghi chú (không bắt buộc)<textarea name="note" maxlength="300" rows="2"></textarea></label>
            <div class="store-cart__payment"><strong>Phương thức thanh toán</strong><p>Thanh toán khi nhận hàng (COD)</p></div>
            <button class="btn btn--primary" type="submit">Xem lại thông tin đặt hàng</button>
            <p class="store-cart__notice">Đơn hàng và phí giao hàng cần được cửa hàng xác nhận.</p>
          </form>
          <section class="store-cart__review" data-checkout-review hidden tabindex="-1" aria-labelledby="checkoutReviewTitle">
            <h4 id="checkoutReviewTitle">Kiểm tra thông tin đặt hàng</h4>
            <dl data-checkout-details></dl>
            <p>Thông tin này chưa được gửi đến cửa hàng.</p>
            <button class="btn btn--outline" type="button" data-checkout-edit>Chỉnh thông tin</button>
          </section>
        </aside>
      </div>
      <form method="dialog" class="store-cart__continue"><button type="submit" class="btn btn--outline">Tiếp tục mua sắm</button></form>
    </dialog>
    <p class="store-visually-hidden" role="status" data-cart-status></p>
    <div class="store-cart-toast" data-cart-toast aria-hidden="true" hidden></div>
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
  const cartDialog = document.getElementById('storeCart');
  const toast = document.querySelector('[data-cart-toast]');
  let toastTimer;
  const subtotalLabel = document.querySelector('[data-cart-subtotal]');
  const itemCountLabel = document.querySelector('[data-cart-item-count]');

  const checkoutForm = document.querySelector('[data-checkout-form]');
  const checkoutReview = document.querySelector('[data-checkout-review]');
  const checkoutDetails = document.querySelector('[data-checkout-details]');
  const checkoutFields = [
    ['name', 'Họ và tên'], ['phone', 'Số điện thoại'], ['email', 'Email'],
    ['address', 'Địa chỉ giao hàng'], ['note', 'Ghi chú']
  ];

  checkoutForm.addEventListener('submit', event => {
    event.preventDefault();
    if (quantityById.size === 0) return;
    const data = new FormData(checkoutForm);
    const details = checkoutFields.map(([field, label]) => [label, String(data.get(field)).trim()]);
    const emptyRequired = ['name', 'phone', 'address'].find(field => !String(data.get(field)).trim());
    if (emptyRequired) {
      checkoutForm.elements.namedItem(emptyRequired).value = '';
      checkoutForm.reportValidity();
      return;
    }
    details.push(['Phương thức thanh toán', 'Thanh toán khi nhận hàng (COD)']);
    checkoutDetails.replaceChildren(...details.filter(([, value]) => value).flatMap(([label, value]) => {
      const term = document.createElement('dt');
      const definition = document.createElement('dd');
      term.textContent = label;
      definition.textContent = value;
      return [term, definition];
    }));
    checkoutForm.hidden = true;
    checkoutReview.hidden = false;
    checkoutReview.focus();
  });

  document.querySelector('[data-checkout-edit]').addEventListener('click', () => {
    checkoutReview.hidden = true;
    checkoutForm.hidden = false;
    checkoutForm.elements.namedItem('name').focus();
  });



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
      row.dataset.cartProduct = id;
      const picture = document.createElement(product.image ? 'img' : 'span');
      picture.className = 'store-cart__photo';
      if (product.image) {
        picture.src = new URL(product.image + '?v=product-photos-20261114', siteRoot);
        picture.alt = product.name;
        picture.loading = 'lazy';
      } else {
        picture.textContent = 'Chưa có ảnh';
      }

      const description = document.createElement('div');
      description.className = 'store-cart__product';
      const name = document.createElement('a');
      const detailUrl = new URL('pages/product-detail.html', siteRoot);
      detailUrl.searchParams.set('product', id);
      name.href = detailUrl.href;
      name.textContent = product.name;
      const unitPrice = document.createElement('span');
      unitPrice.textContent = 'Đơn giá ' + formatPrice.format(product.priceVnd);
      const linePrice = document.createElement('strong');
      linePrice.textContent = 'Thành tiền ' + formatPrice.format(lineTotal);

      const controls = document.createElement('div');
      controls.className = 'store-cart__quantity';
      const quantityLabel = document.createElement('span');
      quantityLabel.textContent = quantity;
      quantityLabel.setAttribute('aria-label', 'Số lượng ' + quantity);
      function stepButton(step, symbol, label) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.cartStep = step;
        button.textContent = symbol;
        button.setAttribute('aria-label', label + ' ' + product.name);
        button.disabled = quantity + step < 1 || quantity + step > 99;
        button.addEventListener('click', () => {
          quantityById.set(id, quantity + step);
          saveCart();
          const updatedRow = [...items.children].find(item => item.dataset.cartProduct === id);
          const sameButton = updatedRow.querySelector('[data-cart-step="' + step + '"]');
          const otherButton = updatedRow.querySelector('[data-cart-step="' + -step + '"]');
          (sameButton.disabled ? otherButton : sameButton).focus();
        });
        return button;
      }
      controls.append(stepButton(-1, '−', 'Giảm số lượng'), quantityLabel, stepButton(1, '+', 'Tăng số lượng'));

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'store-cart__remove';
      remove.textContent = 'Xóa';
      remove.setAttribute('aria-label', `Xóa ${product.name} khỏi giỏ hàng`);
      remove.addEventListener('click', () => {
        quantityById.delete(id);
        saveCart();
        status.textContent = `Đã xóa ${product.name} khỏi giỏ hàng.`;
        (items.querySelector('a') || document.querySelector('#storeCart .store-dialog__close')).focus();
      });
      description.append(name, unitPrice, linePrice);
      const actions = document.createElement('div');
      actions.className = 'store-cart__actions';
      actions.append(controls, remove);
      row.append(picture, description, actions);
      return row;
    });

    items.replaceChildren(...rows);
    count.textContent = itemCount;
    cartButton.setAttribute('aria-label', `Giỏ hàng, ${itemCount} sản phẩm`);
    empty.hidden = itemCount > 0;
    summary.hidden = itemCount === 0;
    itemCountLabel.textContent = itemCount + ' sản phẩm trong giỏ';
    total.textContent = subtotalLabel.textContent = formatPrice.format(subtotal);
    if (itemCount === 0) {
      checkoutForm.hidden = false;
      checkoutReview.hidden = true;
    }
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
      if (!Object.hasOwn(byId, id)) return;
      const field = button.closest('.product-detail__actions')?.querySelector('#detailQuantity');
      if (field && !field.reportValidity()) return;
      const requested = field ? field.valueAsNumber : 1;
      const quantity = quantityById.get(id) || 0;
      if (quantity + requested > 99) {
        status.textContent = 'Sản phẩm đã đạt số lượng tối đa trong giỏ hàng.';
        return;
      }
      quantityById.set(id, quantity + requested);
      saveCart();
      if (button.hasAttribute('data-cart-open')) cartDialog.showModal();
      (cartDialog.open ? cartDialog : document.body).append(toast);
      toast.textContent = 'Đã thêm sản phẩm vào giỏ hàng thành công';
      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
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
