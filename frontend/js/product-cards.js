(() => {
  const siteRoot = new URL('../', document.currentScript.src);
  const categories = {
    'vong-chuoi': 'Vòng Và Chuỗi',
    'nu-tram-huong': 'Nụ Trầm Hương',
    'nhang-tram': 'Nhang Trầm',
    'thac-khoi': 'Thác Khói',
    'dung-cu-dot-tram': 'Dụng Cụ Đốt Trầm'
  };
  const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
  const template = document.createElement('template');
  template.innerHTML = `<article class="featured-card">
  <div class="featured-card__media">
    <span class="featured-card__badge"></span>
  </div>
  <p class="featured-card__brand">TRẦM HƯƠNG KHÁNH HÒA</p>
  <h3 class="product-card__title"></h3>
  <div class="featured-card__footer">
    <div class="featured-card__price"><small>Giá niêm yết</small><strong></strong></div>
    <div class="featured-card__actions">
      <a class="product-card__cta">Xem chi tiết</a>
      <button type="button" class="featured-add" title="Thêm vào giỏ hàng"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14l1 14H4L5 7Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg></button>
    </div>
  </div>
</article>`;

  function create(product) {
    const card = template.content.firstElementChild.cloneNode(true);
    const media = card.querySelector('.featured-card__media');
    const placeholder = document.createElement('span');
    placeholder.className = 'featured-card__placeholder';
    placeholder.textContent = 'Chưa có ảnh';
    if (product.image) {
      const image = document.createElement('img');
      image.alt = product.name;
      image.loading = 'lazy';
      image.addEventListener('error', () => image.replaceWith(placeholder), { once: true });
      image.src = new URL(product.image + '?v=product-photos-20261114', siteRoot).href;
      media.prepend(image);
    } else {
      media.prepend(placeholder);
    }
    media.querySelector('.featured-card__badge').textContent = categories[product.filterGroup] || 'Trầm hương';
    card.querySelector('h3').textContent = product.name;
    card.querySelector('strong').textContent = money.format(product.priceVnd);
    const details = new URL('pages/product-detail.html', siteRoot);
    details.searchParams.set('product', product.id);
    card.querySelector('a').href = details.href;
    const add = card.querySelector('button');
    add.dataset.cartAdd = product.id;
    add.setAttribute('aria-label', 'Thêm ' + product.name + ' vào giỏ hàng');
    return card;
  }

  window.productCards = { categories, create };
  const featuredGrid = document.querySelector('[data-featured-products]');
  if (featuredGrid) {
    const ids = featuredGrid.dataset.featuredProducts.split(/\s+/);
    featuredGrid.replaceChildren(...ids.map(id => window.siteCatalog.byId[id]).filter(Boolean).map(create));
  }
})();
