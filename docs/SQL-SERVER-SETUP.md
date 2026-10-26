# Chuyển Final Project sang SQL Server / SSMS

## 1. Chọn instance

Máy phát hiện `SQLEXPRESS` và `TIN` đang chạy. Trong SSMS ghi lại Server name và Authentication bạn đang dùng. Đã kiểm tra kết nối Windows Authentication thành công với `.\SQLEXPRESS` và tạo database riêng `TramHuongFyp` ngày 26/10/2026. Cấu hình hiện dùng instance này; chỉ đổi nếu bạn chủ động chuyển instance.

Mở `backend/appsettings.json`, sửa phần Server nếu bạn dùng instance khác, ví dụ `Server=.\\TIN` trong JSON. Các dấu `\\` trong file JSON thể hiện một dấu `\` trong tên server. Giữ database `TramHuongFyp`. Cấu hình mẫu dùng Windows Authentication (`Integrated Security=True`). Không cần nhập mật khẩu nếu Windows account của bạn có quyền.

Nếu dùng SQL Authentication, không commit mật khẩu vào appsettings. Dùng .NET User Secrets trên máy: `dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<connection string riêng của bạn>" --project backend/TramHuong.Api.csproj`. Thay giá trị giữ chỗ bằng thông tin thật trên máy, không gửi mật khẩu qua chat. Connection string SQL Authentication cần `User ID`, `Password`, bỏ `Integrated Security=True`. User Secrets chỉ dành cho dev local.

`TrustServerCertificate=True` dành cho SQL Server local với chứng chỉ tự ký. Không mở SQL Server ra internet, không tự bật `sa`, Mixed Mode, SQL Browser hay đổi cổng chỉ để chạy bản này. Ưu tiên cách đăng nhập SSMS đã hoạt động.

## 2. Tạo database và bảng bằng công cụ dự án (cách khuyên dùng)

Tại gốc dự án:

```powershell
dotnet restore backend/TramHuong.Api.csproj
dotnet run --project backend/TramHuong.Api.csproj -- --init-db
```

Initializer chỉ tạo database tên `TramHuongFyp` nếu chưa có, không xóa database. Nó ghi lịch sử vào `schema_migrations`, mỗi migration chạy trong transaction, bỏ qua migration đã áp dụng. User phải có quyền tạo database; nếu không có thì nhờ người quản trị tạo database riêng và cấp quyền phù hợp. Không chạy trên database học tập cũ có bảng trùng tên.

Sau đó vào SSMS → Databases → Refresh → TramHuongFyp → Tables. Schema có 13 bảng mô hình + `contact_messages` + `schema_migrations`.

Nếu muốn tự thực hiện bằng SSMS: tạo **database mới, trống** tên `TramHuongFyp`; chọn nó ở dropdown; mở/chạy lần lượt `database/sqlserver/001_schema.sql`, `002_seed_categories.sql`, `003_local_contact.sql`. Đây là đường thay thế, **không chạy tiếp initializer lên database đã tạo bảng bằng tay** vì chưa có lịch sử migration. Script không xóa bảng và không được thiết kế để chạy lặp. `GO` là ký hiệu phân batch của SSMS; initializer cũng tách các batch đó.

## 3. Khởi động

```powershell
dotnet run --project backend/TramHuong.Api.csproj
```

Hoặc `npm start`. Giữ Terminal mở. Truy cập:

- `http://127.0.0.1:5080/`: giao diện.
- `http://127.0.0.1:5080/api/health`: kết nối thật tới SQL Server; mong đợi `ok:true`, `database:"SQL Server"`, `categories:6`.
- `http://127.0.0.1:5080/api/categories`: sáu nhóm từ SQL Server, chỉ trạng thái published.

Nếu API báo 503: kiểm tra dịch vụ instance, tên server, database và quyền đăng nhập. Nếu lỗi SSPI, thử kết nối Windows Authentication trong SSMS bằng cùng tài khoản; không dùng cách bỏ mật khẩu hoặc cấp quyền `sa` để né lỗi.

## 4. Smoke test form và dữ liệu

Mở `/pages/contact.html`, gửi một yêu cầu thử có đánh dấu TEST. Form chỉ báo thành công sau khi lưu SQL Server; không còn gửi email. Trong SSMS chạy:

```sql
USE TramHuongFyp;
SELECT id, name_vi, status FROM dbo.product_categories ORDER BY sort_order;
SELECT COUNT(*) AS product_count FROM dbo.products;
SELECT TOP (10) id, customer_name, subject, status, created_at
FROM dbo.contact_messages ORDER BY created_at DESC;
```

Ban đầu `product_count=0`. Dùng dữ liệu TEST, không nhập thông tin cá nhân nhạy cảm vào demo. Không đưa database backup chứa dữ liệu khách lên GitHub.

## 5. Cấu trúc dữ liệu hiện tại

Schema dùng NVARCHAR cho tiếng Việt, BIGINT cho VND, DATETIME2 UTC và trigger T-SQL. Backend dùng SQL có tham số. Chưa có API quản trị hoặc AI. Giao diện nằm trong `frontend/`, API trong `backend/Endpoints/`, khởi tạo schema trong `backend/Data/`.

## 6. Kiểm thử API tự động
Khi backend đang chạy, mở Terminal khác và chạy `npm run test:api`. Bộ test này đọc SQL Server thật và kiểm tra bảo vệ file nội bộ, không chèn dữ liệu. Đã thử lưu/retry/xung đột nội dung với một yêu cầu mang tên TEST SQL migration khi chuyển đổi; bản ghi TEST được giữ để bạn xem trong SSMS.
