export async function onRequest({ request, env }) {
  const headers = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };

  if (request.method !== "GET") {
    return Response.json(
      { ok: false, message: "Phương thức không được hỗ trợ." },
      {
        status: 405,
        headers: { ...headers, Allow: "GET" },
      }
    );
  }

  if (!env.DB) {
    return Response.json(
      { ok: false, message: "Database chưa được kết nối." },
      { status: 503, headers }
    );
  }

  try {
    const { results } = await env.DB.prepare(`
      SELECT
        id,
        slug,
        name_vi,
        name_en,
        description_vi,
        sort_order
      FROM product_categories
      WHERE status = ?
      ORDER BY sort_order, name_vi
    `)
      .bind("published")
      .all();

    return Response.json(
      { ok: true, categories: results },
      { headers }
    );
  } catch (error) {
    console.error("Categories query failed:", error.name);

    return Response.json(
      { ok: false, message: "Không thể tải danh mục lúc này." },
      { status: 500, headers }
    );
  }
}