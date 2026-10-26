using System.Data;
using Microsoft.Data.SqlClient;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

public static class ContactEndpoints
{
  public static void MapContactEndpoints(this WebApplication app, string connectionString)
  {
app.MapGet("/api/contact", () => Results.Ok(new { ready=true, mode="local-database" }));
app.MapPost("/api/contact", async (HttpContext context) =>
{
    var origin=context.Request.Headers.Origin.ToString();
    if (!Uri.TryCreate(origin,UriKind.Absolute,out var uri) || uri.Authority!=context.Request.Host.Value || uri.Scheme!=context.Request.Scheme)
        return Results.Json(new {ok=false,code="origin"},statusCode:403);
    if (!context.Request.HasJsonContentType()) return Results.Json(new {ok=false,code="invalid"},statusCode:415);
    var input=await context.Request.ReadFromJsonAsync<ContactInput>();
    if(input is null || !string.IsNullOrEmpty(input.Website) || !Guid.TryParse(input.RequestId,out var requestId))
        return Results.BadRequest(new {ok=false,code="invalid"});
    var fields=new[]{(input.Name,100),(input.Email,254),(input.Phone,40),(input.Subject,150),(input.Message,5000),(input.Product,100)};
    if(fields.Any(f=>f.Item1 is null || f.Item1.Length>f.Item2) || string.IsNullOrWhiteSpace(input.Name) || string.IsNullOrWhiteSpace(input.Message)
        || !MailAddress.TryCreate(input.Email,out var address) || address.Address!=input.Email
        || (input.Name+input.Email+input.Phone+input.Subject).Contains('\n') || (input.Name+input.Email+input.Phone+input.Subject).Contains('\r'))
        return Results.BadRequest(new {ok=false,code="invalid"});
    var hash=Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new {input.Name,input.Email,input.Phone,input.Subject,input.Message,input.Product}))));
    await using var db=new SqlConnection(connectionString); await db.OpenAsync();
    if(!string.IsNullOrEmpty(input.Product)) {
        await using var category=new SqlCommand("SELECT COUNT(*) FROM dbo.product_categories WHERE id=@id AND status='published'",db);
        category.Parameters.Add("@id",SqlDbType.NVarChar,100).Value=input.Product;
        if(Convert.ToInt32(await category.ExecuteScalarAsync())==0) return Results.BadRequest(new {ok=false,code="invalid"});
    }
    try {
        await using var cmd=new SqlCommand("INSERT dbo.contact_messages(id,category_id,customer_name,email,phone,subject,message,payload_hash) VALUES (@id,@category,@name,@email,@phone,@subject,@message,@hash)",db);
        cmd.Parameters.Add("@id",SqlDbType.UniqueIdentifier).Value=requestId;
        cmd.Parameters.Add("@category",SqlDbType.NVarChar,100).Value=string.IsNullOrEmpty(input.Product)?DBNull.Value:input.Product;
        cmd.Parameters.Add("@name",SqlDbType.NVarChar,100).Value=input.Name;
        cmd.Parameters.Add("@email",SqlDbType.NVarChar,254).Value=input.Email;
        cmd.Parameters.Add("@phone",SqlDbType.NVarChar,40).Value=input.Phone;
        cmd.Parameters.Add("@subject",SqlDbType.NVarChar,150).Value=input.Subject;
        cmd.Parameters.Add("@message",SqlDbType.NVarChar,-1).Value=input.Message;
        cmd.Parameters.Add("@hash",SqlDbType.Char,64).Value=hash;
        await cmd.ExecuteNonQueryAsync();
    } catch(SqlException e) when(e.Number is 2601 or 2627) {
        await using var check=new SqlCommand("SELECT payload_hash FROM dbo.contact_messages WHERE id=@id",db);
        check.Parameters.Add("@id",SqlDbType.UniqueIdentifier).Value=requestId;
        if((await check.ExecuteScalarAsync()) as string !=hash) return Results.Conflict(new {ok=false,code="invalid"});
    }
    return Results.Ok(new {ok=true,reference=requestId,mode="local-database"});
});

  }
}
