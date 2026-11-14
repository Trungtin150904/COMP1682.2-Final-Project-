(() => {
  const catalog = window.siteCatalog;
  const filters = document.getElementById('catalogFilters');
  const search = document.getElementById('catalogSearch');
  const grid = document.getElementById('catalogGrid');
  const active = document.getElementById('catalogActive');
  const chips = document.getElementById('catalogChips');
  const count = document.getElementById('catalogCount');
  const empty = document.getElementById('catalogEmpty');
  const priceError = document.getElementById('catalogPriceError');
  const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
  const categories = {
    'vong-chuoi': 'Vòng Và Chuỗi',
    'nu-tram-huong': 'Nụ Trầm Hương',
    'nhang-tram': 'Nhang Trầm',
    'thac-khoi': 'Thác Khói',
    'dung-cu-dot-tram': 'Dụng Cụ Đốt Trầm'
  };
  const purposes = {
    wear: ['vong-chuoi'],
    burn: ['nhang-tram', 'nu-tram-huong', 'thac-khoi', 'dung-cu-dot-tram']
  };
  const featured = [
    'vong-tay-tram-huong-8mm-hat-tron-trung-cap',
    'chuoi-tram-huong-6mm-108-hat-pho-thong',
    'nhang-tram-huong-co-tam-pho-thong'
  ];
  let query = '';

  function groupOf(product) {
    return product.filterGroup;
  }

  function element(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  const categoryOptions = document.getElementById('catalogCategories');
  for (const [group, name] of Object.entries(categories)) {
    const label = element('label', '');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'category';
    checkbox.value = group;
    const quantity = catalog.products.filter(product => groupOf(product) === group).length;
    label.append(checkbox, element('span', name), element('small', quantity, 'catalog-category-count'));
    categoryOptions.append(label);
  }

  function cardFor(product) {
    const article = element('article', '', 'catalog-card');
    const media = element('div', '', 'catalog-card__media');
    const placeholder = element('span', 'Chưa có ảnh', 'catalog-card__placeholder');
    if (product.image) {
      const image = document.createElement('img');
      image.alt = product.name;
      image.loading = 'lazy';
      image.addEventListener('error', () => {
        image.remove();
        placeholder.hidden = false;
      });
      placeholder.hidden = true;
      media.append(image);
      image.src = '../' + product.image + '?v=product-photos-20261114';
    }
    media.append(placeholder, element('span', categories[groupOf(product)] || 'Trầm hương', 'catalog-card__badge'));
    const body = element('div', '', 'catalog-card__body');
    const footer = element('div', '', 'catalog-card__footer');
    const details = element('a', 'Xem chi tiết', 'product-card__cta');
    details.href = 'product-detail.html?product=' + encodeURIComponent(product.id);
    footer.append(element('strong', money.format(product.priceVnd)), details);
    body.append(element('span', 'TRẦM HƯƠNG KHÁNH HÒA', 'catalog-card__brand'), element('h2', product.name, 'product-card__title'), footer);
    article.append(media, body);
    return article;
  }

  const cards = new Map(catalog.products.map(product => [product.id, cardFor(product)]));
  function chip(text, remove) {
    const button = element('button', text + ' ×');
    button.type = 'button';
    button.setAttribute('aria-label', 'Bỏ bộ lọc ' + text);
    button.addEventListener('click', () => {
      const index = Array.from(chips.children).indexOf(button);
      remove();
      render();
      (chips.children[index] || chips.lastElementChild || search.elements.query).focus();
    });
    chips.append(button);
  }

  function render() {
    const data = new FormData(filters);
    const groups = data.getAll('category');
    const uses = data.getAll('purpose');
    const min = filters.elements.minPrice.valueAsNumber;
    const max = filters.elements.maxPrice.valueAsNumber;
    const invalidRange = Number.isFinite(min) && Number.isFinite(max) && min > max;
    priceError.hidden = !invalidRange;
    filters.elements.maxPrice.setAttribute('aria-invalid', String(invalidRange));
    const matches = catalog.search(query, window.siteI18n?.t).filter(product => {
      const group = groupOf(product);
      return (!groups.length || groups.includes(group)) &&
        (!uses.length || uses.some(use => purposes[use].includes(group))) &&
        (!Number.isFinite(min) || product.priceVnd >= min) &&
        (!Number.isFinite(max) || product.priceVnd <= max);
    });
    const sort = data.get('sort');
    const priority = id => featured.includes(id) ? featured.indexOf(id) : featured.length;
    matches.sort((a, b) => {
      if (sort === 'ascending') return a.priceVnd - b.priceVnd;
      if (sort === 'descending') return b.priceVnd - a.priceVnd;
      return priority(a.id) - priority(b.id);
    });
    grid.replaceChildren(...matches.map(product => cards.get(product.id)));
    empty.hidden = matches.length > 0 || invalidRange;
    count.textContent = 'Hiển thị ' + matches.length + ' sản phẩm phù hợp';

    chips.replaceChildren();
    if (query) chip(query, () => { query = ''; search.reset(); });
    filters.querySelectorAll('input:checked').forEach(input => {
      const label = input.name === 'category' ? categories[input.value] : input.labels[0].textContent.trim();
      chip(label, () => { input.checked = false; });
    });
    if (Number.isFinite(min) || Number.isFinite(max)) {
      const priceLabel = [Number.isFinite(min) ? 'Từ ' + money.format(min) : '', Number.isFinite(max) ? 'Đến ' + money.format(max) : ''].filter(Boolean).join(' · ');
      chip(priceLabel, () => { filters.elements.minPrice.value = ''; filters.elements.maxPrice.value = ''; });
    }
    active.hidden = chips.children.length === 0;
  }

  search.addEventListener('submit', event => {
    event.preventDefault();
    query = search.elements.query.value.trim();
    render();
  });
  search.elements.query.addEventListener('input', () => {
    query = search.elements.query.value.trim();
    render();
  });
  document.querySelectorAll('[data-query]').forEach(button => {
    button.addEventListener('click', () => {
      search.elements.query.value = query = button.dataset.query;
      render();
    });
  });
  filters.addEventListener('input', render);
  filters.elements.sort.addEventListener('change', render);
  filters.addEventListener('submit', event => event.preventDefault());
  filters.addEventListener('reset', () => {
    query = '';
    search.reset();
    queueMicrotask(render);
  });
  render();
})();
