/* Shared browser catalog. Content is migrated as-is; factual review remains separate. */
(() => {
  'use strict';
  const products = [
  {
    "id": "tram-huong",
    "filterGroup": "phoi-tram",
    "name": "Trầm Hương",
    "image": "assets/images/tramhuong-tach-nen.png",
    "images": [
      "assets/images/tramhuong-tach-nen.png",
      "assets/images/tramhuong(1)-tach-nen.png",
      "assets/images/tramhuong(2)-tach-nen.png"
    ],
    "description": "Trầm hương là phần gỗ chứa nhiều chất nhựa thơm được sinh ra từ thân cây Dó bầu (Aquilaria) khi cây bị thương tổn do tác động của tự nhiên hoặc con người. Để tự bảo vệ, cây tiết ra một loại kháng thể đặc biệt, qua hàng chục, hàng trăm năm tích tụ và biến tính tạo thành khối trầm hương quý hiếm có mùi thơm đặc trưng đặc biệt sâu lắng.",
    "feature": "Gỗ Dó bầu tích tụ nhựa thơm, mang hương thơm đặc trưng, sâu lắng.",
    "category": "Thông Tin Chi Tiết",
    "priceVnd": 1000000
  },
  {
    "id": "tram-loai-4",
    "filterGroup": "phoi-tram",
    "name": "Trầm Loại 4",
    "image": "assets/images/tram_loai4-tach-nen.png",
    "images": [
      "assets/images/tram_loai4-tach-nen.png",
      "assets/images/tram_loai4(1)-tach-nen.png"
    ],
    "description": "Trầm loại 4 là phân cấp trầm hương có lượng tinh dầu thấm vào thớ gỗ không nhiều, mùi thơm nhẹ hoặc ít đậm, gỗ thường sáng màu hơn và không chìm nước.",
    "feature": "Lượng tinh dầu không nhiều, hương nhẹ hoặc ít đậm, gỗ thường sáng màu và không chìm nước.",
    "category": "Thông Tin Chi Tiết",
    "priceVnd": 700000
  },
  {
    "id": "tram-loai-5",
    "filterGroup": "phoi-tram",
    "name": "Trầm Loại 5",
    "image": "assets/images/tram_loai5-tach-nen.png",
    "images": [
      "assets/images/tram_loai5-tach-nen.png",
      "assets/images/tram_loai5(1)-tach-nen.png",
      "assets/images/tram_loai5(2)-tach-nen.png"
    ],
    "description": "Trầm loại 5 là phân cấp trầm hương có lượng tinh dầu thấm vào thớ gỗ rất ít và mùi thơm nhẹ, gỗ thường sáng màu hơn Trầm loại 4 và không chìm nước.",
    "feature": "Lượng tinh dầu rất ít, hương nhẹ, gỗ thường sáng màu hơn Trầm loại 4 và không chìm nước.",
    "category": "Thông Tin Chi Tiết",
    "priceVnd": 500000
  },
  {
    "id": "tram-ruc",
    "filterGroup": "phoi-tram",
    "name": "Trầm Rục",
    "image": "assets/images/tramruc.jpg",
    "images": [
      "assets/images/tramruc.jpg",
      "assets/images/tramruc(1).jpg",
      "assets/images/tramruc(2).jpg"
    ],
    "description": "Trầm Rục là loại trầm hương tự nhiên được hình thành từ cây Dó bầu đã chết, ngã đổ và vùi lấp trong đất hoặc bùn ẩm lâu năm. Trải qua quá trình phân hủy tự nhiên, phần gỗ không nhiễm dầu bị mục nát hoàn toàn, chỉ giữ lại phần lõi chứa hàm lượng tinh dầu trầm hương rất cao.",
    "feature": "Hình thành từ cây Dó bầu chết, ngã đổ lâu năm, phần gỗ không nhiễm dầu phân hủy, để lại phần gỗ tích trầm.",
    "category": "Thông Tin Chi Tiết",
    "priceVnd": 1500000
  },
  {
    "id": "tram-toc",
    "filterGroup": "phoi-tram",
    "name": "Trầm Tốc",
    "image": "assets/images/tramtoc-tach-nen.png",
    "images": [
      "assets/images/tramtoc-tach-nen.png",
      "assets/images/tramtoc(1)-tach-nen.png"
    ],
    "description": "Trầm Tốc là loại trầm phổ biến, có lượng dầu nhiễm nhẹ trong các thớ gỗ và giá thành vừa phải và thường dùng để làm vòng tay, chuỗi hạt hoặc nhang trầm.",
    "feature": "Lượng dầu nhiễm nhẹ trong thớ gỗ, giá thành vừa phải, thường dùng làm vòng tay, chuỗi hạt hoặc nhang trầm.",
    "category": "Thông Tin Chi Tiết",
    "priceVnd": 800000
  },
  {
    "id": "bi-ky-nam",
    "name": "Bì Kỳ Nam",
    "image": "assets/images/bi-ky-nam-3-tach-nen.png",
    "images": [
      "assets/images/bi-ky-nam-3-tach-nen.png",
      "assets/images/bi-ky-nam-1-tach-nen.png",
      "assets/images/bi-ky-nam-2-tach-nen.png",
      "assets/images/bi-ky-nam-4-tach-nen.png"
    ],
    "description": "Bì Kỳ Nam (Kỳ nam) được cửa hàng giới thiệu là sản phẩm gỗ quý hiếm hình thành từ lõi cây Dó bầu (Aquilaria) khi cây bị tổn thương hoặc tác động sinh học. Đây là dạng tích tụ trầm hương ở mức độ cao nhất, sở hữu lượng tinh dầu khổng lồ khiến chất gỗ mềm dẻo như sáp và hoàn toàn chìm nước. Do tỉ lệ xuất hiện trong tự nhiên cực kỳ thấp (chỉ khoảng 1/10.000 đến 1/20.000 cây Dó có trầm mới có Kỳ nam), loại gỗ này được ví như 'biệt dược đắt nhất hành tinh'",
    "feature": "Gỗ Dó bầu quý hiếm, được giới thiệu có mức tích nhựa cao, chất gỗ mềm dẻo như sáp.",
    "category": "Thông Tin Chi Tiết",
    "priceVnd": 5000000
  },
  {
    "id": "chuoi-tram-may-man",
    "name": "Chuỗi Trầm Hương May Mắn (04mm - 108 hạt)",
    "priceVnd": 990000,
    "filterGroup": "vong-chuoi",
    "categoryId": "tram-huong",
    "image": "assets/images/chuoitramhuong108.jpg",
    "images": [],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "vong-tram-may-man",
    "name": "Vòng Trầm Hương May Mắn (10mm - 18 hạt)",
    "priceVnd": 990000,
    "filterGroup": "vong-chuoi",
    "categoryId": "tram-huong",
    "image": "assets/images/vong_tram_huong_mm.jpg",
    "images": [],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "atc-tram-may-man",
    "name": "ATC - Trầm Hương May Mắn (12mm - 16 hạt)",
    "priceVnd": 990000,
    "filterGroup": "vong-chuoi",
    "categoryId": "tram-huong",
    "image": "",
    "images": [],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "vong-tram-thinh-vuong",
    "name": "Vòng Trầm Thịnh Vượng",
    "priceVnd": 1290000,
    "filterGroup": "vong-chuoi",
    "categoryId": "tram-huong",
    "image": "",
    "images": [],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "thanh-tram-tai-loc",
    "name": "Thanh Trầm Hương Tài Lộc",
    "priceVnd": 1150000,
    "filterGroup": "thanh-tram",
    "categoryId": "tram-huong",
    "image": "",
    "images": [],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "thanh-tram-phat-loc",
    "name": "Thanh Trầm Hương Phát Lộc",
    "priceVnd": 1980000,
    "filterGroup": "thanh-tram",
    "categoryId": "tram-huong",
    "image": "",
    "images": [],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "thanh-tram-tai-loc-30",
    "name": "Thanh Trầm Hương Tài Lộc (30 thanh)",
    "priceVnd": 2000000,
    "filterGroup": "thanh-tram",
    "categoryId": "tram-huong",
    "image": "",
    "images": [],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "thanh-ky-nam-tai-loc",
    "name": "Thanh Kỳ Nam Tài Lộc",
    "priceVnd": 3000000,
    "filterGroup": "thanh-tram",
    "categoryId": "bi-ky-nam",
    "image": "",
    "images": [],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "thanh-ky-nam-tai-loc-30",
    "name": "Thanh Kỳ Nam Tài Lộc (30 thanh)",
    "priceVnd": 3000000,
    "filterGroup": "thanh-tram",
    "categoryId": "bi-ky-nam",
    "image": "",
    "images": [],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "thanh-ky-nam-tai-loc-3300",
    "name": "Thanh Kỳ Nam Tài Lộc",
    "priceVnd": 3300000,
    "filterGroup": "thanh-tram",
    "categoryId": "bi-ky-nam",
    "image": "",
    "images": [],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "thanh-tram-tai-loc-60",
    "name": "Thanh Trầm Hương Tài Lộc (60 thanh)",
    "priceVnd": 5000000,
    "filterGroup": "thanh-tram",
    "categoryId": "tram-huong",
    "image": "",
    "images": [],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  }
];

  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim();
  products.forEach(product => { Object.freeze(product.images); Object.freeze(product); });
  const byId = Object.freeze(Object.fromEntries(products.map(product => [product.id, product])));
  const catalog = Object.freeze({
    products: Object.freeze(products), byId,
    search(query, translate = value => value) {
      const words = normalize(query).split(/\s+/).filter(Boolean);
      return products.filter(product => {
        const text = normalize([product.name, translate(product.name), product.id].join(' '));
        return words.every(word => text.includes(word));
      });
    }
  });
  globalThis.siteCatalog = catalog;
  if (typeof module !== 'undefined' && module.exports) module.exports = catalog;
})();
