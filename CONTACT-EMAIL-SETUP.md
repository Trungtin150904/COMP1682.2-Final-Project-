# Bật form liên hệ gửi về email Mắt Bão

Địa chỉ nhận cố định: **cskh@tramhuongkhanhhoa.net.vn**.

Website dùng Cloudflare Pages. Form gọi `/api/contact`; Pages Function xác minh Turnstile rồi gửi qua Resend. Khách không cần mở ứng dụng email. Nhấn Trả lời trong thư thông báo sẽ trả lời địa chỉ khách nhập. Hộp thư nhận vẫn ở Mắt Bão. Không cần đưa mật khẩu hộp thư Mắt Bão vào mã nguồn.

## 1. Khôi phục DNS nhận thư Mắt Bão

Lần kiểm tra ngày 22/10/2026, DNS authoritative Cloudflare chưa trả về bản ghi MX cho tên miền. Đăng nhập được webmail không đồng nghĩa thư bên ngoài sẽ đến được hộp thư.

- Trong trang quản trị dịch vụ **Email** Mắt Bão, lấy bộ DNS dành riêng cho gói email đang dùng: MX, SPF, DKIM, và DMARC nếu có.
- Chép đúng tên, giá trị và độ ưu tiên MX vào **Cloudflare → tramhuongkhanhhoa.net.vn → DNS → Records**. Không đoán máy chủ MX theo nhà cung cấp vì mỗi gói có thể khác nhau.
- Các hostname dùng cho mail để **DNS only** nếu giao diện có lựa chọn proxy. Không đổi nameserver về Mắt Bão.
- SPF chỉ có một bản ghi cho mỗi hostname; hợp nhất theo hướng dẫn nhà cung cấp khi đã có SPF.
- Gửi một email từ Gmail/Outlook vào địa chỉ CSKH và xác nhận nhận được trước khi thử form.

Đối chiếu trực tiếp ngày 22/10/2026: `ns1.matbao.vn` còn trả về các bản ghi bên dưới, trong khi `dale.ns.cloudflare.com` chưa có MX. Đây là dấu hiệu dịch vụ email mua tại Mắt Bão đang dùng hệ thống Zoho. Đối chiếu với trang quản trị gói email của bạn rồi thêm vào Cloudflare:

| Loại | Name | Giá trị | Priority |
| --- | --- | --- | --- |
| MX | `@` | `mx.zoho.com` | 10 |
| MX | `@` | `mx2.zoho.com` | 20 |
| MX | `@` | `mx3.zoho.com` | 50 |
| TXT | `@` | `v=spf1 include:zoho.com ~all` | — |
| TXT | `@` | `zoho-verification=zb85488535.zmverify.zoho.com` | — |

Lấy DKIM từ trang quản trị email vì selector/khóa không thể đoán. Chưa tìm thấy DMARC trên DNS Mắt Bão khi kiểm tra. Không tự thêm SPF thứ hai nếu Cloudflare đã có SPF ở `@`.

## 2. Tạo thông tin gửi thư Resend

- Mở https://resend.com/domains và thêm **notify.tramhuongkhanhhoa.net.vn** làm miền gửi riêng.
- Thêm các bản ghi xác thực Resend cung cấp vào Cloudflare và đợi trạng thái **Verified**. Không thay/xóa MX của tên miền gốc đang phục vụ Mắt Bão. Bản ghi của miền gửi riêng ở hostname khác.
- Tạo API key chỉ có quyền gửi email, giới hạn vào miền vừa xác thực nếu có lựa chọn này.
- Địa chỉ gửi dùng trong cấu hình: `Website Tram Huong Khanh Hoa <website@notify.tramhuongkhanhhoa.net.vn>`.
- Không dùng `onboarding@resend.dev` cho vận hành chính thức vì địa chỉ thử nghiệm có giới hạn người nhận.

## 3. Tạo Turnstile trên Cloudflare

Cloudflare → **Turnstile → Add widget**. Chọn Managed và thêm ba hostname:

- `tramhuongkhanhhoa.net.vn`
- `www.tramhuongkhanhhoa.net.vn`
- `tramhuongkhanhhoa.pages.dev`

Sao chép Site key và Secret key. Không dùng test key trên website thật.

## 4. Cấu hình Production trên Pages

Cloudflare → **Workers & Pages → tramhuongkhanhhoa → Settings → Variables and Secrets**, chọn **Production**. Thêm:

| Tên | Loại | Giá trị |
| --- | --- | --- |
| `RESEND_API_KEY` | Secret | Khóa gửi thư của Resend |
| `CONTACT_FROM` | Text | `Website Tram Huong Khanh Hoa <website@notify.tramhuongkhanhhoa.net.vn>` |
| `TURNSTILE_SITE_KEY` | Text | Site key của widget |
| `TURNSTILE_SECRET_KEY` | Secret | Secret key của widget |

Không gửi khóa bí mật qua chat, không đặt chúng trong HTML/JavaScript phía trình duyệt hoặc commit lên GitHub. Giữ các khóa triển khai GitHub Actions hiện có như cũ; đây là các biến runtime trong Pages.

## 5. Triển khai và kiểm tra thực tế

- Commit và Push các file đã sửa, đặc biệt **functions/api/contact.js**, **js/contact.js**, bản dịch, giao diện và workflow. Wrangler deploy từ gốc repo sẽ build thư mục `functions` bên cạnh `dist`.
- Sau khi thêm/thay đổi biến Production, chạy lại workflow **Deploy website → Run workflow**. Kiểm tra Actions và Pages đều báo triển khai thành công.
- Mở `https://tramhuongkhanhhoa.net.vn/api/contact`: phải thấy `"ready":true` và Site key công khai. API không trả secret.
- Mở trang Liên hệ bằng tab mới, thử cả Việt/Anh. Điền tên, email cá nhân, điện thoại, sản phẩm, chủ đề và nội dung; hoàn tất xác minh rồi gửi.
- Chỉ khi provider xác nhận đã nhận yêu cầu, form mới hiện thành công. Điều này chưa đảm bảo thư vào Inbox: đối chiếu hộp thư, Spam và trang Logs của Resend để kiểm tra **Delivered** hoặc lỗi giao thư.
- Kiểm tra thư có đủ thông tin và nhấn Trả lời trỏ về khách. Không triển khai xong rồi mặc định coi email đã hoạt động.
- Nếu lỗi, form giữ dữ liệu và gợi ý gửi email trực tiếp. Nếu `ready:false`, kiểm tra đủ bốn biến và triển khai lại.

Thư không được lưu trong cơ sở dữ liệu website. API không in nội dung/địa chỉ email khách vào log. Resend xử lý dữ liệu để gửi thư; Mắt Bão lưu thư nhận trong hộp thư của bạn.

## Tài liệu

- https://developers.cloudflare.com/pages/functions/get-started/
- https://developers.cloudflare.com/pages/functions/bindings/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://resend.com/docs/send-with-cloudflare-workers
- https://resend.com/docs/api-reference/emails/send-email
