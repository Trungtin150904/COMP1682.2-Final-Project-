# Trầm Hương — Final Project local

Frontend HTML/CSS/JavaScript → Backend ASP.NET Core 10 → SQL Server, quản lý bằng SSMS.

## Cấu trúc

```text
frontend/
  index.html           Trang chủ
  pages/               HTML các trang
  css/                 CSS dùng chung, responsive và trang chủ
  js/                  Tương tác, catalog, ngôn ngữ và form liên hệ
  assets/images/       Ảnh
  assets/video/        Video
backend/
  Program.cs           Cấu hình ứng dụng, middleware, phục vụ frontend
  Endpoints/           API health, categories, contact
  Models/              Mô hình dữ liệu nhận từ request
  Data/                Khởi tạo database và áp dụng migration
  appsettings.json     Cấu hình SQL Server local (không chứa mật khẩu)
database/sqlserver/    Schema và seed T-SQL
tests/frontend/       Kiểm thử catalog, liên kết và form
tests/backend/        Kiểm thử API với SQL Server thật
docs/                 Thiết kế dữ liệu và hướng dẫn SSMS
```

## Chạy

Tại gốc dự án: `npm start` hoặc `dotnet run --project backend/TramHuong.Api.csproj`.
Mở http://127.0.0.1:5080. Database hiện tại: `.\SQLEXPRESS` → `TramHuongFyp`, Windows Authentication.
Nếu setup máy mới, làm theo [SQL-SERVER-SETUP](docs/SQL-SERVER-SETUP.md).

API: `GET /api/health`, `GET /api/categories`, `GET/POST /api/contact`.
Form liên hệ lưu trong SQL Server, không gửi email. Catalog giao diện vẫn tĩnh; quản trị và AI chưa triển khai.
Đường dẫn trình duyệt vẫn là `/pages/...`, `/css/...`, `/js/...`, `/assets/...`; không thêm `/frontend` vào URL.
Backend chỉ phục vụ file công khai trong frontend; không trả database, mã backend hoặc cấu hình.

## Kiểm thử

- `npm test`: frontend.
- `dotnet build backend/TramHuong.Api.csproj`: build backend.
- Khi backend chạy, mở Terminal khác chạy `npm run test:api`.

Chỉ frontend cần HTML/CSS/JavaScript. Backend dùng C#, JSON cấu hình và SQL qua driver; không có giao diện quản trị nên chưa tạo thư mục HTML/CSS rỗng ở backend.
