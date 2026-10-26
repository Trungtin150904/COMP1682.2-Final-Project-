using System.Data;
using Microsoft.Data.SqlClient;

public static class CategoryEndpoints
{
  public static void MapCategoryEndpoints(this WebApplication app, string connectionString)
  {
app.MapGet("/api/categories", async () =>
{
    await using var db = new SqlConnection(connectionString); await db.OpenAsync();
    await using var cmd = new SqlCommand("SELECT id,slug,name_vi,name_en,description_vi,sort_order FROM dbo.product_categories WHERE status=@status ORDER BY sort_order,name_vi", db);
    cmd.Parameters.Add("@status", SqlDbType.NVarChar,30).Value="published";
    await using var reader = await cmd.ExecuteReaderAsync();
    var categories=new List<object>();
    while(await reader.ReadAsync()) categories.Add(new {
        id=reader.GetString(0), slug=reader.GetString(1), name_vi=reader.GetString(2),
        name_en=reader.IsDBNull(3)?null:reader.GetString(3), description_vi=reader.GetString(4),sort_order=reader.GetInt32(5)
    });
    return Results.Ok(new { ok=true, categories });
});

  }
}
