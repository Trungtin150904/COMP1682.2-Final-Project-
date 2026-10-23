const siteRoot = new URL("../", document.currentScript.src);

document.addEventListener("DOMContentLoaded", () => {
  const featuredProducts = {
    "tram-huong": {
      name: "Trầm Hương Cao Cấp",
      image: "assets/images/tramhuong-tach-nen.png",
      images: [
        "assets/images/tramhuong-tach-nen.png",
        "assets/images/tramhuong-tach-nen.png",
        "assets/images/tramhuong(1)-tach-nen.png",
        "assets/images/tramhuong(2)-tach-nen.png",
      ],
      description: "Trầm hương là phần gỗ chứa nhiều chất nhựa thơm được sinh ra từ thân cây Dó bầu (Aquilaria) khi cây bị thương tổn do tác động của tự nhiên hoặc con người.",
      feature: "Gỗ Dó bầu tích tụ nhựa thơm, mang hương thơm đặc trưng, sâu lắng.",
    },
    "tram-loai-4": {
      name: "Trầm Loại 4",
      image: "assets/images/tram_loai4-tach-nen.png",
      images: [
        "assets/images/tram_loai4-tach-nen.png",
        "assets/images/tram_loai4-tach-nen.png",
        "assets/images/tram_loai4(1)-tach-nen.png",
      ],
      description: "Trầm loại 4 là phân cấp trầm hương có lượng tinh dầu thấm vào thớ gỗ không nhiều, mùi thơm nhẹ hoặc ít đậm.",
      feature: "Lượng tinh dầu không nhiều, hương nhẹ hoặc ít đậm, gỗ thường sáng màu và không chìm nước.",
    },
    "tram-loai-5": {
      name: "Trầm loại 5",
      image: "assets/images/tram_loai5-tach-nen.png",
      images: [
        "assets/images/tram_loai5-tach-nen.png",
        "assets/images/tram_loai5-tach-nen.png",
        "assets/images/tram_loai5(1)-tach-nen.png",
        "assets/images/tram_loai5(2)-tach-nen.png",
      ],
      description: "Trầm loại 5 là phân cấp trầm hương có lượng tinh dầu thấm vào thớ gỗ rất ít và mùi thơm nhẹ.",
      feature: "Lượng tinh dầu rất ít, hương nhẹ; gỗ thường sáng màu hơn Trầm loại 4 và không chìm nước.",
    },
    "tram-ruc": {
      name: "Trầm Rục",
      image: "assets/images/tramruc.jpg",
      images: [
        "assets/images/tramruc.jpg",
        "assets/images/tramruc(1).jpg",
        "assets/images/tramruc(2).jpg",
      ],
      description: "Trầm Rục là loại trầm hương tự nhiên được hình thành từ cây Dó bầu đã chết, ngã đổ và vùi lấp trong đất hoặc bùn ẩm lâu năm.",
      feature: "Hình thành từ cây Dó bầu chết, ngã đổ lâu năm; phần gỗ không nhiễm dầu phân hủy, để lại phần gỗ tích trầm.",
    },
    "tram-toc": {
      name: "Trầm Tốc",
      image: "assets/images/tramtoc-tach-nen.png",
      images: [
        "assets/images/tramtoc-tach-nen.png",
        "assets/images/tramtoc-tach-nen.png",
        "assets/images/tramtoc(1)-tach-nen.png",
      ],
      description: "Trầm Tốc là loại trầm phổ biến, có lượng dầu nhiễm nhẹ trong các thớ gỗ và giá thành vừa phải.",
      feature: "Lượng dầu nhiễm nhẹ trong thớ gỗ, giá thành vừa phải; thường dùng làm vòng tay, chuỗi hạt hoặc nhang trầm.",
    },
    "bi-ky-nam": {
      name: "Bì Kỳ Nam",
      image: "assets/images/bi-ky-nam-3-tach-nen.png",
      images: [
        "assets/images/bi-ky-nam-1-tach-nen.png",
        "assets/images/bi-ky-nam-2-tach-nen.png",
        "assets/images/bi-ky-nam-3-tach-nen.png",
        "assets/images/bi-ky-nam-4-tach-nen.png",
      ],
      description: "Bì Kỳ Nam (Kỳ nam) được cửa hàng giới thiệu là sản phẩm gỗ quý hiếm hình thành từ lõi cây Dó bầu (Aquilaria) khi cây bị tổn thương hoặc tác động sinh học.",
      feature: "Gỗ Dó bầu quý hiếm, được giới thiệu có mức tích nhựa cao, chất gỗ mềm dẻo như sáp.",
    },
  };

  // Product copy is kept together so each family can be updated independently.
  const productCopy = {
    "tram-huong":  {
                       "name":  "Trầm Hương",
                       "category":  "Thông Tin Chi Tiết",
                       "description":  "Trầm hương là phần gỗ chứa nhiều chất nhựa thơm được sinh ra từ thân cây Dó bầu (Aquilaria) khi cây bị thương tổn do tác động của tự nhiên hoặc con người. Để tự bảo vệ, cây tiết ra một loại kháng thể đặc biệt, qua hàng chục, hàng trăm năm tích tụ và biến tính tạo thành khối trầm hương quý hiếm có mùi thơm đặc trưng đặc biệt sâu lắng.",
                       "feature":  "Gỗ Dó bầu tích tụ nhựa thơm, mang hương thơm đặc trưng, sâu lắng.",
                   },
    "tram-toc":  {
                     "name":  "Trầm Tốc",
                     "category":  "Thông Tin Chi Tiết",
                     "description":  "Trầm Tốc là loại trầm phổ biến, có lượng dầu nhiễm nhẹ trong các thớ gỗ và giá thành vừa phải và thường dùng để làm vòng tay, chuỗi hạt hoặc nhang trầm.",
                     "feature":  "Lượng dầu nhiễm nhẹ trong thớ gỗ, giá thành vừa phải, thường dùng làm vòng tay, chuỗi hạt hoặc nhang trầm.",
                 },
    "tram-ruc":  {
                     "name":  "Trầm Rục",
                     "category":  "Thông Tin Chi Tiết",
                     "description":  "Trầm Rục là loại trầm hương tự nhiên được hình thành từ cây Dó bầu đã chết, ngã đổ và vùi lấp trong đất hoặc bùn ẩm lâu năm. Trải qua quá trình phân hủy tự nhiên, phần gỗ không nhiễm dầu bị mục nát hoàn toàn, chỉ giữ lại phần lõi chứa hàm lượng tinh dầu trầm hương rất cao.",
                     "feature":  "Hình thành từ cây Dó bầu chết, ngã đổ lâu năm, phần gỗ không nhiễm dầu phân hủy, để lại phần gỗ tích trầm.",
                 },
    "tram-loai-4":  {
                        "name":  "Trầm Loại 4",
                        "category":  "Thông Tin Chi Tiết",
                        "description":  "Trầm loại 4 là phân cấp trầm hương có lượng tinh dầu thấm vào thớ gỗ không nhiều, mùi thơm nhẹ hoặc ít đậm, gỗ thường sáng màu hơn và không chìm nước.",
                        "feature":  "Lượng tinh dầu không nhiều, hương nhẹ hoặc ít đậm, gỗ thường sáng màu và không chìm nước.",
                    },
    "tram-loai-5":  {
                        "name":  "Trầm Loại 5",
                        "category":  "Thông Tin Chi Tiết",
                        "description":  "Trầm loại 5 là phân cấp trầm hương có lượng tinh dầu thấm vào thớ gỗ rất ít và mùi thơm nhẹ, gỗ thường sáng màu hơn Trầm loại 4 và không chìm nước.",
                        "feature":  "Lượng tinh dầu rất ít, hương nhẹ, gỗ thường sáng màu hơn Trầm loại 4 và không chìm nước.",
                    },
    "bi-ky-nam":  {
                      "name":  "Bì Kỳ Nam",
                      "category":  "Thông Tin Chi Tiết",
                      "description":  "Bì Kỳ Nam (Kỳ nam) được cửa hàng giới thiệu là sản phẩm gỗ quý hiếm hình thành từ lõi cây Dó bầu (Aquilaria) khi cây bị tổn thương hoặc tác động sinh học. Đây là dạng tích tụ trầm hương ở mức độ cao nhất, sở hữu lượng tinh dầu khổng lồ khiến chất gỗ mềm dẻo như sáp và hoàn toàn chìm nước. Do tỉ lệ xuất hiện trong tự nhiên cực kỳ thấp (chỉ khoảng 1/10.000 đến 1/20.000 cây Dó có trầm mới có Kỳ nam), loại gỗ này được ví như 'biệt dược đắt nhất hành tinh'",
                      "feature":  "Gỗ Dó bầu quý hiếm, được giới thiệu có mức tích nhựa cao, chất gỗ mềm dẻo như sáp.",
                  }
};
  Object.entries(productCopy).forEach(([id, copy]) => Object.assign(featuredProducts[id], copy));
  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);
  const apiUrl = (path) => new URL(path, siteRoot).href;
  const assetUrl = (path) =>
    new URL(String(path || "").replace(/^(?:\.\.\/)+/, ""), siteRoot).href;
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
      const productImages = [...new Set([product.image, ...(product.images || [])])];
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
      const contactHref = `contact.html?product=${encodeURIComponent(requestedProductId)}`;
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

    const getCatalogItems = () =>
      [...document.querySelectorAll(".product-card")]
        .map((card) => {
          const name = card.querySelector(".product-card__title")?.textContent?.trim();
          const image = card.querySelector("img")?.getAttribute("src") || "assets/images/Trầm_01.jpg";
          const link = card.querySelector("a[href]")?.getAttribute("href") || "products.html";
          return { name, image, link };
        })
        .filter((item) => item.name);

    const renderSearchResults = (query) => {
      if (!results) return;
      const normalized = query.trim().toLowerCase();
      const items = getCatalogItems();
      const filtered = !normalized
        ? items
        : items.filter((item) => item.name.toLowerCase().includes(normalized));

      if (!filtered.length) {
        results.innerHTML = '<div class="search-empty">Không tìm thấy sản phẩm phù hợp.</div>';
        return;
      }

      results.innerHTML = filtered
        .slice(0, 6)
        .map(
          (item) => `
            <a href="${item.link}" class="search-result">
              <img src="${escapeHtml(assetUrl(item.image))}" alt="${escapeHtml(item.name)}" loading="lazy" />
              <div>
                <strong>${item.name}</strong>
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
