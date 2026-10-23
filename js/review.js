document.addEventListener("DOMContentLoaded", async () => {
  const token = new URLSearchParams(window.location.search).get("token") || "";
  const context = document.querySelector("#reviewContext");
  const notice = document.querySelector("#reviewNotice");
  const form = document.querySelector("#reviewForm");
  const showError = (message) => {
    notice.textContent = message;
    notice.dataset.error = "true";
  };

  if (!/^[a-f0-9]{64}$/.test(token)) {
    context.textContent = "Link đánh giá không hợp lệ.";
    return;
  }

  try {
    const response = await fetch(`/api/reviews/invitations/${encodeURIComponent(token)}`);
    const invitation = await response.json();
    if (!response.ok) throw new Error(invitation.error || "Không thể xác minh link đánh giá.");
    context.textContent = `Đơn ${invitation.orderReference} đã mua sản phẩm ${invitation.productName}. Mỗi link chỉ dùng được một lần.`;
    form.hidden = false;
  } catch (error) {
    context.textContent = "";
    showError(error.message);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button[type='submit']");
    submit.disabled = true;
    try {
      const response = await fetch(`/api/reviews/invitations/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: Number(form.elements.rating.value),
          comment: form.elements.comment.value.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Không thể gửi đánh giá.");
      form.hidden = true;
      context.textContent = result.message;
      notice.textContent = "";
    } catch (error) {
      showError(error.message);
      submit.disabled = false;
    }
  });
});
