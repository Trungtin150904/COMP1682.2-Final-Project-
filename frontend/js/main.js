const siteRoot = new URL("../", document.currentScript.src);

document.addEventListener("DOMContentLoaded", () => {
  const catalog = window.siteCatalog;
  const featuredProducts = catalog.byId;
  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);
  const assetUrl = (path) =>
    new URL(String(path || "").replace(/^(?:\.\.\/)+/, ""), siteRoot).href;
  // Static HTML remains a no-JavaScript fallback; catalog data drives live cards.
  document.querySelectorAll('.product-card[data-product-id]').forEach(card => {
    const product = featuredProducts[card.dataset.productId];
    if (!product) return;
    const title = card.querySelector('.product-card__title');
    const image = card.querySelector('img');
    if (title) title.textContent = product.name;
    if (image && product.image) { image.src = assetUrl(product.image); image.alt = product.name; }
    const price = card.querySelector('.product-card__price');
    if (price && Number.isFinite(product.priceVnd)) price.textContent = new Intl.NumberFormat('vi-VN').format(product.priceVnd) + ' ₫';
    if (card.hasAttribute('data-category')) card.dataset.category = product.filterGroup || product.id;
    card.querySelectorAll('a[href]').forEach(link => {
      const url = new URL(link.href, location.href);
      if (url.searchParams.has('product')) { url.searchParams.set('product', product.id); link.href = url.href; }
    });
  });
  const contactProducts = document.querySelector('#contactForm #product');
  if (contactProducts) {
    const placeholder = contactProducts.querySelector('option[value=""]');
    const options = catalog.products.filter(product => !product.categoryId).map(product => {
      const option = document.createElement('option');
      option.value = product.id; option.textContent = product.name;
      return option;
    });
    contactProducts.replaceChildren(...(placeholder ? [placeholder] : []), ...options);
  }
  const productDetailInfo = document.querySelector(".product-detail__info[data-product-id]");
  if (productDetailInfo) {
    const requestedProductId =
      new URLSearchParams(window.location.search).get("product") ||
      productDetailInfo.dataset.productId;
    const product = featuredProducts[requestedProductId];
    if (product) {
      productDetailInfo.dataset.productId = requestedProductId;
      document.querySelector("[data-product-category]").textContent = product.category;
      document.querySelector('meta[name="description"]').content = product.description;
      document.title = `${product.name} | Nha Trầm`;
      productDetailInfo.querySelector("[data-product-title]").textContent = product.name;
      productDetailInfo.querySelector("[data-product-description]").textContent = product.description;
      const mainImage = document.querySelector("[data-product-main-image]");
      const thumbnails = document.querySelector("[data-product-thumbnails]");
      const productImages = [...new Set([product.image, ...(product.images || [])].filter(Boolean))];
      if (productImages.length) {
      const previous = document.querySelector("[data-gallery-prev]");
      const next = document.querySelector("[data-gallery-next]");
      const counter = document.querySelector("[data-image-count]");
      let selectedImage = 0;
      const thumbnailButtons = productImages.map((image, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "product-detail__thumbnail";
        button.setAttribute("aria-label", `Xem ảnh ${index + 1} của ${product.name}`);
        const thumbnail = document.createElement("img");
        thumbnail.src = assetUrl(image);
        thumbnail.alt = `${product.name} - ảnh ${index + 1}`;
        thumbnail.loading = "lazy";
        button.appendChild(thumbnail);
        button.addEventListener("click", () => selectImage(index));
        return button;
      });
      const selectImage = (index) => {
        selectedImage = (index + productImages.length) % productImages.length;
        mainImage.src = assetUrl(productImages[selectedImage]);
        mainImage.alt = `${product.name} - ảnh ${selectedImage + 1}`;
        counter.textContent = `${selectedImage + 1} / ${productImages.length}`;
        thumbnailButtons.forEach((button, buttonIndex) => {
          const active = buttonIndex === selectedImage;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", String(active));
        });
        const activeThumbnail = thumbnailButtons[selectedImage];
        thumbnails.scrollTo({
          left: activeThumbnail.offsetLeft - thumbnails.offsetLeft -
            (thumbnails.clientWidth - activeThumbnail.offsetWidth) / 2,
          behavior: "smooth",
        });
      };
      thumbnails.replaceChildren(...thumbnailButtons);
      thumbnails.hidden = productImages.length < 2;
      previous.disabled = next.disabled = productImages.length < 2;
      previous.addEventListener("click", () => selectImage(selectedImage - 1));
      next.addEventListener("click", () => selectImage(selectedImage + 1));
      document.querySelector(".product-detail__gallery").addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          selectImage(selectedImage + (event.key === "ArrowRight" ? 1 : -1));
        }
      });
      selectImage(0);
      } else {
        const gallery = document.querySelector('.product-detail__gallery');
        const placeholder = document.createElement('p');
        placeholder.className = 'product-detail__empty-image';
        placeholder.textContent = 'Chưa thêm ảnh sản phẩm';
        gallery.replaceChildren(placeholder);
      }
      const detailPrice = document.querySelector('[data-product-price]');
      if (detailPrice && Number.isFinite(product.priceVnd)) detailPrice.textContent = new Intl.NumberFormat('vi-VN').format(product.priceVnd) + ' ₫';
      const contactHref = `contact.html?product=${encodeURIComponent(product.categoryId || requestedProductId)}`;
      productDetailInfo.querySelector("[data-product-contact]").href = contactHref;

      const specs = productDetailInfo.querySelector("[data-product-specs]");
      specs.replaceChildren(
        ...[
          ["Sản phẩm", product.name],
          ["Đặc điểm", product.feature],
          ["Tư vấn", "Liên hệ cửa hàng để biết thêm chi tiết."],
        ].map(([label, value]) => {
          const item = document.createElement("li");
          const strong = document.createElement("strong");
          strong.textContent = `${label}: `;
          item.append(strong, document.createTextNode(value));
          return item;
        })
      );
    } else {
      productDetailInfo.dataset.productId = "";
      productDetailInfo.querySelector("[data-product-title]").textContent = "Không tìm thấy sản phẩm";
      productDetailInfo.querySelector("[data-product-description]").textContent =
        "Sản phẩm này không tồn tại. Vui lòng quay lại danh sách sản phẩm.";
      productDetailInfo.querySelector(".product-detail__actions").hidden = true;
      document.querySelector(".product-detail__gallery").hidden = true;
      document.querySelector("[data-product-thumbnails]").hidden = true;
      document.querySelector("[data-product-help]").hidden = true;
    }
  }
  const buildSearchUI = () => {
    if (document.querySelector("#searchOverlay")) return;
    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <div id="searchOverlay" class="search-overlay" aria-hidden="true">
          <div class="search-overlay__backdrop" data-search-close></div>
          <div class="search-overlay__panel" role="dialog" aria-modal="true" aria-label="Tìm kiếm sản phẩm">
            <div class="search-overlay__header">
              <h3>Tìm kiếm sản phẩm</h3>
              <button type="button" class="search-overlay__close" data-search-close aria-label="Đóng tìm kiếm">×</button>
            </div>
            <div class="search-overlay__field">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 3a7.5 7.5 0 015.9 12.8l4.3 4.3 1.4-1.4-4.3-4.3A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"/></svg>
              <input id="productSearch" type="search" placeholder="Nhập tên sản phẩm bạn muốn tìm..." />
            </div>
            <div class="search-overlay__results" id="searchResults"></div>
          </div>
        </div>
      `
    );

    document.querySelectorAll("[data-search-close]").forEach((button) => {
      button.addEventListener("click", () => {
        const overlay = document.querySelector("#searchOverlay");
        if (overlay) {
          overlay.classList.remove("is-open");
          overlay.setAttribute("aria-hidden", "true");
        }
      });
    });

    const searchInput = document.querySelector("#productSearch");
    const results = document.querySelector("#searchResults");

    const renderSearchResults = (query) => {
      if (!results) return;
      const translate = value => window.siteI18n?.t(value) || value;
      const filtered = catalog.search(query, translate).map(product => ({
        name: product.name, image: product.image,
        link: new URL('pages/product-detail.html?product=' + encodeURIComponent(product.id), siteRoot).href
      }));

      if (!filtered.length) {
        results.innerHTML = '<div class="search-empty">Không tìm thấy sản phẩm phù hợp.</div>';
        return;
      }

      results.innerHTML = filtered
        .slice(0, 6)
        .map(
          (item) => `
            <a href="${escapeHtml(item.link)}" class="search-result">
              ${item.image ? `<img src="${escapeHtml(assetUrl(item.image))}" alt="${escapeHtml(item.name)}" loading="lazy" />` : '<span class="search-result__empty-image" aria-hidden="true">—</span>'}
              <div>
                <strong>${escapeHtml(item.name)}</strong>
              </div>
            </a>
          `
        )
        .join("");
    };

    if (searchInput) {
      searchInput.addEventListener("input", (event) => renderSearchResults(event.target.value));
      renderSearchResults("");
    }
  };

  buildSearchUI();
  const searchButton = document.querySelector(".header__actions .icon-btn");

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const overlay = document.querySelector("#searchOverlay");
      if (!overlay) return;
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      const input = document.querySelector("#productSearch");
      if (input) {
        setTimeout(() => input.focus(), 50);
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const searchOverlay = document.querySelector("#searchOverlay");
      if (searchOverlay) {
        searchOverlay.classList.remove("is-open");
        searchOverlay.setAttribute("aria-hidden", "true");
      }
    }
  });

  const filterButtons = [...document.querySelectorAll(".product-filters .filter-btn")];
  const catalogCards = [...document.querySelectorAll(".product-grid--catalog .product-card")];
  filterButtons.forEach((button) => {
    const category = button.dataset.filter || "all";
    button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      catalogCards.forEach((card) => {
        const matches = category === "all" || card.dataset.category === category;
        card.style.display = matches ? "" : "none";
      });
    });
  });
  const sliderWrap = document.querySelector(".product-slider");
  if (sliderWrap) {
    const productGrid = sliderWrap.querySelector(".product-grid");
    const prevBtn = sliderWrap.querySelector("[data-slider='prev']");
    const nextBtn = sliderWrap.querySelector("[data-slider='next']");

    if (productGrid && prevBtn && nextBtn) {
      const scrollAmount = productGrid.querySelector(".product-card")?.offsetWidth + 18 || 260;

      prevBtn.addEventListener("click", () => {
        productGrid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });

      nextBtn.addEventListener("click", () => {
        productGrid.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    }
  }

  const lightbox = document.querySelector(".lightbox");
  const lightboxContent = document.querySelector(".lightbox__content");
  const closeBtn = document.querySelector(".lightbox__close");

  const openLightbox = (contentNode) => {
    if (!lightbox || !lightboxContent) return;
    lightboxContent.innerHTML = "";
    lightboxContent.appendChild(contentNode.cloneNode(true));
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightboxContent?.querySelectorAll("video").forEach(video => video.pause());
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    if (lightboxContent) lightboxContent.innerHTML = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.querySelectorAll("img:not(.product-detail__thumbs img), video").forEach((media) => {
    if (media.closest("a, button")) return;
    media.addEventListener("click", () => {
      if (media.tagName.toLowerCase() === "video") {
        const videoCopy = media.cloneNode(true);
        videoCopy.controls = true;
        videoCopy.autoplay = true;
        openLightbox(videoCopy);
      } else {
        const imgCopy = media.cloneNode(true);
        openLightbox(imgCopy);
      }
    });
  });

  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    const productSelect = contactForm.querySelector("#product");
    const productContext = contactForm.querySelector("#productContactContext");
    const requestedProduct = new URLSearchParams(window.location.search).get("product");
    const selectedProduct = productSelect
      ? Array.from(productSelect.options).find((option) => option.value === requestedProduct)
      : null;

    if (selectedProduct && productSelect) {
      productSelect.value = selectedProduct.value;
    }

    const updateProductContext = () => {
      const currentProduct = productSelect?.selectedOptions[0];
      if (!productContext || !currentProduct?.value) {
        if (productContext) productContext.hidden = true;
        return;
      }

      productContext.textContent = `Bạn đang cần tư vấn về: ${currentProduct.textContent.trim()}.`;
      productContext.hidden = false;
    };

    if (productSelect) {
      productSelect.addEventListener("change", updateProductContext);
    }
    updateProductContext();

  }

  // Keep separators horizontal while retaining the serif product typography.
  document.querySelectorAll('.category-card__content h3, .product-card__title, [data-product-title]').forEach(heading => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (!node.nodeValue.includes(' - ')) return;
      const fragment = document.createDocumentFragment();
      node.nodeValue.split(/( - )/).forEach(part => {
        if (part === ' - ') {
          const separator = document.createElement('span');
          separator.className = 'product-name-separator';
          separator.textContent = ' - ';
          fragment.appendChild(separator);
        } else fragment.appendChild(document.createTextNode(part));
      });
      node.replaceWith(fragment);
    });
  });

  const toggleBtn = document.querySelector(".mobile-menu-toggle");
  const nav = document.querySelector(".nav");

  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggleBtn.classList.toggle("is-open", isOpen);
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggleBtn.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }
});
