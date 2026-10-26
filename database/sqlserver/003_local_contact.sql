-- Local FYP inbox. No email provider, Turnstile or hosting dependency.
CREATE TABLE dbo.contact_messages (
  id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
  category_id NVARCHAR(100) NULL REFERENCES dbo.product_categories(id),
  customer_name NVARCHAR(100) NOT NULL,
  email NVARCHAR(254) NOT NULL,
  phone NVARCHAR(40) NOT NULL DEFAULT N'',
  subject NVARCHAR(150) NOT NULL DEFAULT N'',
  message NVARCHAR(MAX) NOT NULL CHECK(LEN(message) <= 5000),
  payload_hash CHAR(64) NOT NULL,
  status NVARCHAR(20) NOT NULL DEFAULT 'new' CHECK(status IN ('new','read','resolved')),
  created_at DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME()
);
