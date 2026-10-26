using System.Data;
using Microsoft.Data.SqlClient;

public static class HealthEndpoints
{
  public static void MapHealthEndpoints(this WebApplication app, string connectionString)
  {
app.MapGet("/api/health", async () =>
{
    await using var db = new SqlConnection(connectionString); await db.OpenAsync();
    await using var cmd = new SqlCommand("SELECT COUNT(*) FROM dbo.product_categories", db);
    return Results.Ok(new { ok=true, database="SQL Server", categories=Convert.ToInt32(await cmd.ExecuteScalarAsync()) });
});

  }
}
