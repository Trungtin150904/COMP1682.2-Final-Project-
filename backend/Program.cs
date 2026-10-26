using System.Net;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddUserSecrets<Program>(optional: true);
builder.WebHost.ConfigureKestrel(options => options.Limits.MaxRequestBodySize = 16384);
builder.WebHost.UseUrls("http://127.0.0.1:5080");
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Missing SQL Server connection string.");
var root = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, ".."));
var frontendRoot = Path.Combine(root, "frontend");

// Explicit initialization only. Normal startup never changes the database.
if (args.Contains("--init-db"))
{
    await DatabaseInitializer.InitializeAsync(connectionString, Path.Combine(root, "database", "sqlserver"));
    return;
}

var app = builder.Build();
app.Use(async (context, next) =>
{
    if (context.Connection.RemoteIpAddress is { } ip && !IPAddress.IsLoopback(ip))
    { context.Response.StatusCode=403; return; }
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    if (context.Request.Path.StartsWithSegments("/api")) context.Response.Headers.CacheControl = "no-store";
    try { await next(); }
    catch (JsonException) { context.Response.StatusCode=400; await context.Response.WriteAsJsonAsync(new { ok=false, code="invalid" }); }
    catch (BadHttpRequestException) { context.Response.StatusCode=400; await context.Response.WriteAsJsonAsync(new { ok=false, code="invalid" }); }
    catch (SqlException error)
    {
        app.Logger.LogWarning("SQL Server request failed, error number {Number}", error.Number);
        context.Response.StatusCode=503;
        await context.Response.WriteAsJsonAsync(new { ok=false, code="unavailable", message="Không kết nối được SQL Server hoặc database chưa được khởi tạo." });
    }
});
app.MapHealthEndpoints(connectionString);
app.MapCategoryEndpoints(connectionString);
app.MapContactEndpoints(connectionString);
app.Map("/api/{**path}", () => Results.NotFound(new {ok=false,message="API chưa được triển khai."}));

// Serve only public frontend directories. Never expose the project root, SQL or config files.
foreach(var folder in new[]{"assets","css","js","pages"}) {
    var directory=Path.Combine(frontendRoot,folder);
    if(Directory.Exists(directory)) app.UseStaticFiles(new StaticFileOptions {FileProvider=new PhysicalFileProvider(directory),RequestPath="/"+folder});
}
app.MapGet("/", () => Results.File(Path.Combine(frontendRoot,"index.html"),"text/html; charset=utf-8"));
app.MapGet("/index.html", () => Results.File(Path.Combine(frontendRoot,"index.html"),"text/html; charset=utf-8"));
app.Run();

