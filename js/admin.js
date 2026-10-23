document.addEventListener("DOMContentLoaded", () => {
  const loginPanel = document.querySelector("#adminLoginPanel");
  const dashboard = document.querySelector("#adminDashboard");
  const loginForm = document.querySelector("#adminLoginForm");
  const notice = document.querySelector("#adminNotice");
  const ordersEl = document.querySelector("#adminOrders");
  const reviewsEl = document.querySelector("#adminReviews");
  let csrfToken = "";
  const invitationLinks = new Map();
  const statuses = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipped: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  };

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);
  const formatPrice = (value) => `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
  const showNotice = (message, isError = false) => {
    notice.textContent = message;
    notice.dataset.error = String(isError);
  };
  const api = async (url, options = {}) => {
    const headers = new Headers(options.headers || {});
    if (options.body) headers.set("Content-Type", "application/json");
    if (csrfToken && options.method && options.method !== "GET") {
      headers.set("X-CSRF-Token", csrfToken);
    }
    const response = await fetch(url, { ...options, headers, credentials: "same-origin" });
    if (response.status === 204) return null;
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Không thể hoàn tất yêu cầu.");
    return payload;
  };
  const loadCsrf = async () => {
    const result = await api("/api/admin/csrf");
    csrfToken = result.csrfToken;
  };
  const inviteMarkup = (orderId) => (invitationLinks.get(orderId) || [])
    .map((invite) => {
      const url = new URL(invite.url, window.location.origin).href;
      return `<div class="admin-invite">
        <span><strong>${escapeHtml(invite.productName)}</strong><br /><code>${escapeHtml(url)}</code></span>
        <button class="btn btn--outline" type="button" data-copy="${escapeHtml(url)}">Sao chép link</button>
      </div>`;
    })
    .join("");
  const renderOrders = (orders) => {
    if (!orders.length) {
      ordersEl.innerHTML = '<p class="admin-empty">Chưa có đơn hàng.</p>';
      return;
    }
    ordersEl.innerHTML = orders.map((order) => {
      const itemRows = order.items.map((item) =>
        `<li>${escapeHtml(item.name)} × ${item.quantity} — ${formatPrice(item.unitPriceVnd * item.quantity)}</li>`
      ).join("");
      const nextStatuses = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["shipped", "cancelled"],
        shipped: ["delivered", "cancelled"],
        delivered: [],
        cancelled: [],
      }[order.status];
      const statusControls = nextStatuses.length
        ? `<select data-next-status="${escapeHtml(order.id)}">${nextStatuses.map((status) =>
          `<option value="${status}">${statuses[status]}</option>`).join("")}</select>
           <button class="btn btn--primary" type="button" data-update-status="${escapeHtml(order.id)}">Cập nhật đơn</button>`
        : "";
      const resendInviteButton = order.status === "delivered"
        ? `<button class="btn btn--outline" type="button" data-create-invites="${escapeHtml(order.id)}">Tạo link mời đánh giá</button>`
        : "";
      return `<article class="admin-order">
        <div class="admin-order__heading">
          <h3>${escapeHtml(order.reference)} · ${escapeHtml(order.customerName)}</h3>
          <strong>${statuses[order.status]}</strong>
        </div>
        <p class="admin-order__meta">Điện thoại: ${escapeHtml(order.customerPhone)} · ${new Date(order.createdAt).toLocaleString("vi-VN")}</p>
        <p class="admin-order__meta">Địa chỉ: ${escapeHtml(order.shippingAddress)}</p>
        ${order.note ? `<p class="admin-order__meta">Ghi chú: ${escapeHtml(order.note)}</p>` : ""}
        <ul class="admin-order__items">${itemRows}</ul>
        <p>Thanh toán: ${order.paymentMethod === "cod" ? "Khi nhận hàng (COD)" : "Không xác định"}</p>
        <p><strong>Tổng đơn: ${formatPrice(order.totalVnd)}</strong></p>
        <div class="admin-order__controls">${statusControls}${resendInviteButton}</div>
        <div class="admin-invites">${inviteMarkup(order.id)}</div>
      </article>`;
    }).join("");
  };
  const renderReviews = (reviews) => {
    if (!reviews.length) {
      reviewsEl.innerHTML = '<p class="admin-empty">Chưa có đánh giá.</p>';
      return;
    }
    reviewsEl.innerHTML = reviews.map((review) => {
      const actions = review.status === "pending"
        ? `<div class="admin-review__actions">
            <button class="btn btn--primary" type="button" data-review-status="approved" data-review-id="${escapeHtml(review.id)}">Duyệt và hiển thị</button>
            <button class="btn btn--outline" type="button" data-review-status="rejected" data-review-id="${escapeHtml(review.id)}">Từ chối</button>
          </div>`
        : `<strong>${review.status === "approved" ? "Đã công khai" : "Đã từ chối"}</strong>`;
      return `<article class="admin-review">
        <div class="admin-review__heading">
          <h3>${escapeHtml(review.productName)} · ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</h3>
          <span>${escapeHtml(review.status)}</span>
        </div>
        <p class="admin-review__meta">${escapeHtml(review.customerName)} · Đơn ${escapeHtml(review.orderReference)} · ${new Date(review.createdAt).toLocaleString("vi-VN")}</p>
        <blockquote>${escapeHtml(review.comment)}</blockquote>
        ${actions}
      </article>`;
    }).join("");
  };
  const loadDashboard = async () => {
    const [ordersResult, reviewsResult] = await Promise.all([
      api("/api/admin/orders"),
      api("/api/admin/reviews"),
    ]);
    renderOrders(ordersResult.orders);
    renderReviews(reviewsResult.reviews);
  };
  const showDashboard = async () => {
    loginPanel.hidden = true;
    dashboard.hidden = false;
    await loadDashboard();
  };

  const start = async () => {
    try {
      const sessionResponse = await fetch("/api/admin/session", { credentials: "same-origin" });
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        csrfToken = sessionData.csrfToken;
        await showDashboard();
        return;
      }
      await loadCsrf();
    } catch (error) {
      showNotice("Không kết nối được backend. Hãy mở website qua máy chủ Node.js.", true);
      return;
    }
    loginPanel.hidden = false;
  };

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    try {
      const result = await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
          csrfToken,
        }),
      });
      csrfToken = result.csrfToken;
      loginForm.reset();
      showNotice("");
      await showDashboard();
    } catch (error) {
      showNotice(error.message, true);
    }
  });

  document.querySelector("#adminLogout").addEventListener("click", async () => {
    try {
      await api("/api/admin/logout", { method: "POST" });
      csrfToken = "";
      dashboard.hidden = true;
      loginPanel.hidden = false;
      await loadCsrf();
      showNotice("Đã đăng xuất.");
    } catch (error) {
      showNotice(error.message, true);
    }
  });

  ordersEl.addEventListener("click", async (event) => {
    const statusButton = event.target.closest("[data-update-status]");
    const inviteButton = event.target.closest("[data-create-invites]");
    const copyButton = event.target.closest("[data-copy]");
    try {
      if (statusButton) {
        const orderId = statusButton.dataset.updateStatus;
        const status = ordersEl.querySelector(`[data-next-status="${CSS.escape(orderId)}"]`).value;
        const result = await api(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });
        if (result.invitations.length) invitationLinks.set(orderId, result.invitations);
        showNotice(result.invitations.length ? "Đã cập nhật đơn. Sao chép và gửi link đánh giá cho khách." : "Đã cập nhật trạng thái đơn.");
        await loadDashboard();
      } else if (inviteButton) {
        const orderId = inviteButton.dataset.createInvites;
        const result = await api(`/api/admin/orders/${encodeURIComponent(orderId)}/review-invitations`, {
          method: "POST",
          body: "{}",
        });
        invitationLinks.set(orderId, result.invitations);
        showNotice("Link đánh giá mới đã tạo; link cũ của đơn này không còn hiệu lực.");
        await loadDashboard();
      } else if (copyButton) {
        await navigator.clipboard.writeText(copyButton.dataset.copy);
        showNotice("Đã sao chép link đánh giá.");
      }
    } catch (error) {
      showNotice(error.message, true);
    }
  });

  reviewsEl.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-review-status]");
    if (!button) return;
    try {
      await api(`/api/admin/reviews/${encodeURIComponent(button.dataset.reviewId)}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: button.dataset.reviewStatus }),
      });
      showNotice(button.dataset.reviewStatus === "approved" ? "Đánh giá đã được duyệt và công khai." : "Đánh giá đã bị từ chối.");
      await loadDashboard();
    } catch (error) {
      showNotice(error.message, true);
    }
  });

  start();
});
