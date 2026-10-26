using System.Data;
using System.Text.RegularExpressions;
using Microsoft.Data.SqlClient;

public static class DatabaseInitializer
{
  public static async Task InitializeAsync(string connectionString, string migrationsDirectory)
  {
    var cs = new SqlConnectionStringBuilder(connectionString);
    var databaseName = cs.InitialCatalog;
    if (databaseName != "TramHuongFyp") throw new InvalidOperationException("Initializer only targets TramHuongFyp.");
    cs.InitialCatalog = "master";
    await using (var master = new SqlConnection(cs.ConnectionString))
    {
        await master.OpenAsync();
        await using var create = new SqlCommand("IF DB_ID(N'TramHuongFyp') IS NULL CREATE DATABASE [TramHuongFyp];", master);
        await create.ExecuteNonQueryAsync();
    }
    await using var db = new SqlConnection(connectionString);
    await db.OpenAsync();
    await using (var history = new SqlCommand("IF OBJECT_ID('dbo.schema_migrations','U') IS NULL CREATE TABLE dbo.schema_migrations(name NVARCHAR(200) PRIMARY KEY, applied_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME());", db))
        await history.ExecuteNonQueryAsync();
    foreach (var file in Directory.GetFiles(migrationsDirectory, "*.sql").Order())
    {
        var name = Path.GetFileName(file);
        await using var check = new SqlCommand("SELECT COUNT(*) FROM dbo.schema_migrations WHERE name=@name", db);
        check.Parameters.Add("@name", SqlDbType.NVarChar, 200).Value = name;
        if (Convert.ToInt32(await check.ExecuteScalarAsync()) > 0) { Console.WriteLine($"Already applied: {name}"); continue; }
        using var transaction = db.BeginTransaction();
        try
        {
            foreach (var batch in Regex.Split(await File.ReadAllTextAsync(file), @"^\s*GO\s*$", RegexOptions.Multiline | RegexOptions.IgnoreCase))
            {
                if (string.IsNullOrWhiteSpace(batch)) continue;
                await using var command = new SqlCommand(batch, db, transaction) { CommandTimeout = 60 };
                await command.ExecuteNonQueryAsync();
            }
            await using var record = new SqlCommand("INSERT dbo.schema_migrations(name) VALUES(@name)", db, transaction);
            record.Parameters.Add("@name", SqlDbType.NVarChar, 200).Value = name;
            await record.ExecuteNonQueryAsync();
            transaction.Commit(); Console.WriteLine($"Applied: {name}");
        }
        catch { transaction.Rollback(); throw; }
    }
    Console.WriteLine("SQL Server initialization complete.");

  }
}
