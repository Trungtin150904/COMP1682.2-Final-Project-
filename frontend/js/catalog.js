(() => {
  'use strict';
  const products = [
  {
    "id": "nhang-tram-huong-nu-pho-thong",
    "filterGroup": "nu-tram-huong",
    "name": "Nhang Trầm Hương Nụ Phổ Thông",
    "image": "assets/images/tram-nu-pho-thong.jpg",
    "images": [
      "assets/images/tram-nu-pho-thong.jpg",
      "assets/images/tram-nu-pho-thong-2.jpg",
      "assets/images/tram-nu-pho-thong-3.jpg",
    ],
    "description": "Nhang trầm dạng nụ. Liên hệ cửa hàng để biết thêm thông tin.",
    "feature": "Dạng nụ",
    "category": "Thông Tin Chi Tiết",
    "priceVnd": 275000
  },
  {
    "id": "nhang-tram-huong-nu-cao-cap",
    "filterGroup": "nu-tram-huong",
    "name": "Nhang Trầm Hương Nụ Cao Cấp",
    "image": "assets/images/tram-nu-cao-cap.jpg",
    "images": [
      "assets/images/tram-nu-cao-cap.jpg",
      "assets/images/tram-nu-cao-cap-2.jpg",
      "assets/images/tram-nu-cao-cap-3.jpg",
    ],
    "description": "Nhang trầm dạng nụ. Liên hệ cửa hàng để biết thêm thông tin.",
    "feature": "Dạng nụ",
    "category": "Thông Tin Chi Tiết",
    "priceVnd": 600000
  },
  {
    "id": "nhang-tram-huong-nu-thuong-hang",
    "filterGroup": "nu-tram-huong",
    "name": "Nhang Trầm Hương Nụ Thượng Hạng",
    "image": "assets/images/tram-nu-thuong-hang.jpg",
    "images": [
      "assets/images/tram-nu-thuong-hang.jpg",
      "assets/images/tram-nu-thuong-hang-2.jpg",
      "assets/images/tram-nu-thuong-hang-3.jpg",
    ],
    "description": "Nhang trầm dạng nụ. Liên hệ cửa hàng để biết thêm thông tin.",
    "feature": "Dạng nụ",
    "category": "Thông Tin Chi Tiết",
    "priceVnd": 1100000
  },
  {
    "id": "lu-dot-tram-huong-bang-dong",
    "filterGroup": "dung-cu-dot-tram",
    "name": "Lư Đốt Trầm Hương Bằng Đồng",
    "image": "assets/images/lu-dot-tram-bang-dong.jpg",
    "images": [
      "assets/images/lu-dot-tram-bang-dong.jpg",
      "assets/images/lu-dot-tram-bang-dong-2.jpg",
      "assets/images/lu-dot-tram-bang-dong-3.jpg",
      "assets/images/lu-dot-tram-bang-dong-4.jpg",
    ],
    "description": "Trầm Rục là loại trầm hương tự nhiên được hình thành từ cây Dó bầu đã chết, ngã đổ và vùi lấp trong đất hoặc bùn ẩm lâu năm. Trải qua quá trình phân hủy tự nhiên, phần gỗ không nhiễm dầu bị mục nát hoàn toàn, chỉ giữ lại phần lõi chứa hàm lượng tinh dầu trầm hương rất cao.",
    "feature": "Hình thành từ cây Dó bầu chết, ngã đổ lâu năm, phần gỗ không nhiễm dầu phân hủy, để lại phần gỗ tích trầm.",
    "category": "Thông Tin Chi Tiết",
    "priceVnd": 399000
  },
  {
    "id": "bo-dung-cu-dot-tram-huong-bang-dong",
    "filterGroup": "dung-cu-dot-tram",
    "name": "Bộ Dụng Cụ Đốt Trầm Hương Bằng Đồng",
    "image": "assets/images/dung-cu-dot-tram-bang-dong.jpg",
    "images": [
      "assets/images/dung-cu-dot-tram-bang-dong.jpg",
      "assets/images/dung-cu-dot-tram-bang-dong-2.jpg",
      "assets/images/dung-cu-dot-tram-bang-dong-3.jpg",
      "assets/images/dung-cu-dot-tram-bang-dong-4.jpg",
    ],
    "description": "Trầm Tốc là loại trầm phổ biến, có lượng dầu nhiễm nhẹ trong các thớ gỗ và giá thành vừa phải và thường dùng để làm vòng tay, chuỗi hạt hoặc nhang trầm.",
    "feature": "Lượng dầu nhiễm nhẹ trong thớ gỗ, giá thành vừa phải, thường dùng làm vòng tay, chuỗi hạt hoặc nhang trầm.",
    "category": "Thông Tin Chi Tiết",
    "priceVnd": 1225000
  },
  {
    "id": "bo-dung-cu-dot-tram-huong-cao-cap",
    "filterGroup": "dung-cu-dot-tram",
    "name": "Bộ Dụng Cụ Đốt Trầm Hương Cao Cấp",
    "image": "assets/images/bo-dung-cu-dot-tram-huong-cao-cap.jpg",
    "images": [
      "assets/images/bo-dung-cu-dot-tram-huong-cao-cap.jpg",
      "assets/images/bo-dung-cu-dot-tram-huong-cao-cap-2.jpg",
      "assets/images/bo-dung-cu-dot-tram-huong-cao-cap-3.jpg",
      "assets/images/bo-dung-cu-dot-tram-huong-cao-cap-4.jpg",
    ],
    "description": "Bì Kỳ Nam (Kỳ nam) được cửa hàng giới thiệu là sản phẩm gỗ quý hiếm hình thành từ lõi cây Dó bầu (Aquilaria) khi cây bị tổn thương hoặc tác động sinh học. Đây là dạng tích tụ trầm hương ở mức độ cao nhất, sở hữu lượng tinh dầu khổng lồ khiến chất gỗ mềm dẻo như sáp và hoàn toàn chìm nước. Do tỉ lệ xuất hiện trong tự nhiên cực kỳ thấp (chỉ khoảng 1/10.000 đến 1/20.000 cây Dó có trầm mới có Kỳ nam), loại gỗ này được ví như 'biệt dược đắt nhất hành tinh'",
    "feature": "Gỗ Dó bầu quý hiếm, được giới thiệu có mức tích nhựa cao, chất gỗ mềm dẻo như sáp.",
    "category": "Thông Tin Chi Tiết",
    "priceVnd": 3800000
  },
  {
    "id": "chuoi-tram-huong-8mm-108-hat-trung-cap",
    "name": "Chuỗi trầm hương 8mm 108 hạt trung cấp",
    "priceVnd": 6000000,
    "filterGroup": "vong-chuoi",
    "categoryId": "tram-huong",
    "image": "assets/images/chuoi-tram-huong-8mm-108-hat-trung-cap.jpg",
    "images": [
      "assets/images/chuoi-tram-huong-8mm-108-hat-trung-cap.jpg",
      "assets/images/chuoi-tram-huong-8mm-108-hat-trung-cap-2.jpg",
      "assets/images/chuoi-tram-huong-8mm-108-hat-trung-cap-3.jpg",
      "assets/images/chuoi-tram-huong-8mm-108-hat-trung-cap-4.jpg",
    ],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "chuoi-tram-huong-8mm-108-hat-cao-cap",
    "name": "Chuỗi trầm hương 8mm 108 hạt cao cấp",
    "priceVnd": 20000000,
    "filterGroup": "vong-chuoi",
    "categoryId": "tram-huong",
    "image": "assets/images/chuoi-tram-huong-8mm-108-hat-cao-cap.jpg",
    "images": [
      "assets/images/chuoi-tram-huong-8mm-108-hat-cao-cap.jpg",
      "assets/images/chuoi-tram-huong-8mm-108-hat-cao-cap-2.jpg",
      "assets/images/chuoi-tram-huong-8mm-108-hat-cao-cap-3.jpg",
      "assets/images/chuoi-tram-huong-8mm-108-hat-cao-cap-4.jpg"
    ],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "vong-tay-tram-huong-10mm-hat-tron-pho-thong",
    "name": "Vòng tay trầm hương 10mm hạt tròn phổ thông",
    "priceVnd": 2490000,
    "filterGroup": "vong-chuoi",
    "categoryId": "tram-huong",
    "image": "assets/images/vong-tay-tram-huong-10mm-hat-tron-pho-thong.jpg",
    "images": [
      "assets/images/vong-tay-tram-huong-10mm-hat-tron-pho-thong.jpg",
      "assets/images/vong-tay-tram-huong-10mm-hat-tron-pho-thong-2.jpg",
      "assets/images/vong-tay-tram-huong-10mm-hat-tron-pho-thong-3.jpg",
      "assets/images/vong-tay-tram-huong-10mm-hat-tron-pho-thong-4.jpg"
    ],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "thac-khoi-tram-huong-la-sen",
    "name": "Thác Khói Trầm Hương Lá Sen",
    "priceVnd": 68000,
    "filterGroup": "thac-khoi",
    "categoryId": "tram-huong",
    "image": "assets/images/thac-khoi-xong-tram-huong.jpg",
    "images": [
      "assets/images/thac-khoi-xong-tram-huong.jpg",
      "assets/images/thac-khoi-xong-tram-huong-2.jpg",
      "assets/images/thac-khoi-xong-tram-huong-3.jpg",
    ],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "thac-khoi-tram-huong-phat-di-lac",
    "name": "Thác Khói Trầm Hương Phật Di Lặc",
    "priceVnd": 990000,
    "filterGroup": "thac-khoi",
    "categoryId": "tram-huong",
    "image": "assets/images/thac-khoi-xong-tram-tuong-phat-di-lac.jpg",
    "images": [
      "assets/images/thac-khoi-xong-tram-tuong-phat-di-lac.jpg",
      "assets/images/thac-khoi-xong-tram-tuong-phat-di-lac-2.jpg",
      "assets/images/thac-khoi-xong-tram-tuong-phat-di-lac-3.jpg",
    ],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "thac-khoi-tram-huong-phat-quan-am",
    "name": "Thác Khói Trầm Hương Phật Quan Âm",
    "priceVnd": 468000,
    "filterGroup": "thac-khoi",
    "categoryId": "tram-huong",
    "image": "assets/images/thac-khoi-xong-tram-hinh-phat-quang-am.jpg",
    "images": [
      "assets/images/thac-khoi-xong-tram-hinh-phat-quang-am.jpg",
      "assets/images/thac-khoi-xong-tram-hinh-phat-quang-am-2.jpg",
      "assets/images/thac-khoi-xong-tram-hinh-phat-quang-am-3.jpg"
    ],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "thac-khoi-xong-tram-phong-canh",
    "name": "Thác Khói Xông Trầm Phong Cảnh",
    "priceVnd": 468000,
    "filterGroup": "thac-khoi",
    "categoryId": "tram-huong",
    "image": "assets/images/thac-khoi-xong-tram-phong-canh.jpg",
    "images": [
      "assets/images/thac-khoi-xong-tram-phong-canh.jpg",
      "assets/images/thac-khoi-xong-tram-phong-canh-2.jpg",
      "assets/images/thac-khoi-xong-tram-phong-canh-3.jpg"
    ],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "thac-khoi-tram-huong-duc-chua-jesus",
    "name": "Thác Khói Trầm Hương Chúa Giê-su",
    "priceVnd": 468000,
    "filterGroup": "thac-khoi",
    "categoryId": "tram-huong",
    "image": "assets/images/thac-khoi-tram-huong-cong-giao-chua-gie-su.jpg",
    "images": [
      "assets/images/thac-khoi-tram-huong-cong-giao-chua-gie-su.jpg",
      "assets/images/thac-khoi-tram-huong-cong-giao-chua-gie-su-2.jpg",
      "assets/images/thac-khoi-tram-huong-cong-giao-chua-gie-su-3.jpg",
      "assets/images/thac-khoi-tram-huong-cong-giao-chua-gie-su-4.jpg"
    ],
    "description": "Thông tin sản phẩm đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.",
    "feature": "Thông tin đang cập nhật.",
    "category": "Thông Tin Chi Tiết"
  },
  {
    "id": "vong-tay-tram-huong-8mm-hat-tron-trung-cap",
    "name": "Vòng Tay Trầm Hương 8mm Hạt Tròn Trung Cấp",
    "priceVnd": 1800000,
    "filterGroup": "vong-chuoi",
    "categoryId": "tram-huong",
    "image": "assets/images/vong-tay-tram-huong-8mm-hat-tron-trung-cap.png",
    "images": [
      "assets/images/vong-tay-tram-huong-8mm-hat-tron-trung-cap.png",
      "assets/images/vong-tay-tram-huong-8mm-hat-tron-trung-cap-2.jpg",
      "assets/images/vong-tay-tram-huong-8mm-hat-tron-trung-cap-3.jpg",
      "assets/images/vong-tay-tram-huong-8mm-hat-tron-trung-cap-4.jpg",
    ],
    "description": "Liên hệ cửa hàng để biết thêm thông tin về sản phẩm.",
    "feature": "8mm Hạt Tròn Trung Cấp",
    "category": "Vòng và chuỗi"
  },
  {
    "id": "vong-tay-tram-huong-8mm-hat-tron-cao-cap",
    "name": "Vòng Tay Trầm Hương 8mm Hạt Tròn Cao Cấp",
    "priceVnd": 3890000,
    "filterGroup": "vong-chuoi",
    "categoryId": "tram-huong",
    "image": "assets/images/vong-tay-tram-huong-8mm-hat-tron-cao-cap.jpg",
    "images": [
      "assets/images/vong-tay-tram-huong-8mm-hat-tron-cao-cap.jpg", 
      "assets/images/vong-tay-tram-huong-8mm-hat-tron-cao-cap-2.jpg", 
      "assets/images/vong-tay-tram-huong-8mm-hat-tron-cao-cap-3.jpg", 
      "assets/images/vong-tay-tram-huong-8mm-hat-tron-cao-cap-4.jpg"
    ],
    "description": "Liên hệ cửa hàng để biết thêm thông tin về sản phẩm.",
    "feature": "8mm Hạt Tròn Cao Cấp",
    "category": "Vòng và chuỗi"
  },
  {
    "id": "chuoi-tram-huong-6mm-108-hat-pho-thong",
    "name": "Chuỗi Trầm Hương 6mm 108 Hạt Phổ Thông",
    "priceVnd": 2300000,
    "filterGroup": "vong-chuoi",
    "categoryId": "tram-huong",
    "image": "assets/images/chuoi-tram-huong-6mm-108-hat-pho-thong.jpg",
    "images": [
      "assets/images/chuoi-tram-huong-6mm-108-hat-pho-thong.jpg",
      "assets/images/chuoi-tram-huong-6mm-108-hat-pho-thong-2.jpg",
      "assets/images/chuoi-tram-huong-6mm-108-hat-pho-thong-3.jpg",
      "assets/images/chuoi-tram-huong-6mm-108-hat-pho-thong-4.jpg",
    ],
    "description": "Liên hệ cửa hàng để biết thêm thông tin về sản phẩm.",
    "feature": "6mm 108 Hạt Phổ Thông",
    "category": "Vòng và chuỗi"
  },
  {
    "id": "chuoi-tram-huong-6mm-108-hat-trung-cap",
    "name": "Chuỗi Trầm Hương 6mm 108 Hạt Trung Cấp",
    "priceVnd": 3900000,
    "filterGroup": "vong-chuoi",
    "categoryId": "tram-huong",
    "image": "assets/images/chuoi-tram-huong-6mm-108-hat-trung-cap.jpg",
    "images": [
      "assets/images/chuoi-tram-huong-6mm-108-hat-trung-cap.jpg",
      "assets/images/chuoi-tram-huong-6mm-108-hat-trung-cap-2.jpg",
      "assets/images/chuoi-tram-huong-6mm-108-hat-trung-cap-3.jpg",
      "assets/images/chuoi-tram-huong-6mm-108-hat-trung-cap-4.jpg",
    ],
    "description": "Liên hệ cửa hàng để biết thêm thông tin về sản phẩm.",
    "feature": "6mm 108 Hạt Trung Cấp",
    "category": "Vòng và chuỗi"
  },
  {
    "id": "nhang-tram-huong-co-tam-pho-thong",
    "name": "Nhang Trầm Hương Phổ Thông 30cm Hộp 825 Que",
    "priceVnd": 480000,
    "filterGroup": "nhang-tram",
    "categoryId": "tram-huong",
    "image": "assets/images/nhang-tram-huong-co-tam-pho-thong.jpg",
    "images": [
      "assets/images/nhang-tram-huong-co-tam-pho-thong.jpg",
      "assets/images/nhang-tram-huong-co-tam-pho-thong-2.jpg",
      "assets/images/nhang-tram-huong-co-tam-pho-thong-3.jpg",
    ],
    "description": "Liên hệ cửa hàng để biết thêm thông tin về sản phẩm.",
    "feature": "30cm Hộp 825 Que",
    "category": "Nhang trầm"
  },
  {
    "id": "nhang-tram-huong-co-tam-cao-cap",
    "name": "Nhang Trầm Hương Cao Cấp 30cm Hộp 100 Que",
    "priceVnd": 150000,
    "filterGroup": "nhang-tram",
    "categoryId": "tram-huong",
    "image": "assets/images/nhang-tram-huong-co-tam-cao-cap.jpg",
    "images": [
      "assets/images/nhang-tram-huong-co-tam-cao-cap.jpg",
      "assets/images/nhang-tram-huong-co-tam-cao-cap-2.jpg",
      "assets/images/nhang-tram-huong-co-tam-cao-cap-3.jpg"
    ],
    "description": "Liên hệ cửa hàng để biết thêm thông tin về sản phẩm.",
    "feature": "30cm Hộp 100 Que",
    "category": "Nhang trầm"
  },
  {
    "id": "nhang-tram-huong-co-tam-trung-cap",
    "name": "Nhang Trầm Hương Trung Cấp 20cm Hộp 150 Que",
    "priceVnd": 105000,
    "filterGroup": "nhang-tram",
    "categoryId": "tram-huong",
    "image": "assets/images/nhang-tram-huong-co-tam-trung-cap.jpg",
    "images": [
      "assets/images/nhang-tram-huong-co-tam-trung-cap.jpg",
      "assets/images/nhang-tram-huong-co-tam-trung-cap-2.jpg",
      "assets/images/nhang-tram-huong-co-tam-trung-cap-3.jpg",
    ],
    "description": "Liên hệ cửa hàng để biết thêm thông tin về sản phẩm.",
    "feature": "20cm Hộp 150 Que",
    "category": "Nhang trầm"
  },
  {
    "id": "nhang-tram-huong-co-tam-thuong-hang",
    "name": "Nhang Trầm Hương Thượng Hạng 20cm Hộp 100 Que",
    "priceVnd": 250000,
    "filterGroup": "nhang-tram",
    "categoryId": "tram-huong",
    "image": "assets/images/nhang-tram-huong-co-tam-thuong-hang.jpg",
    "images": [
      "assets/images/nhang-tram-huong-co-tam-thuong-hang.jpg",
      "assets/images/nhang-tram-huong-co-tam-thuong-hang-2.jpg",
      "assets/images/nhang-tram-huong-co-tam-thuong-hang-3.jpg",
    ],
    "description": "Liên hệ cửa hàng để biết thêm thông tin về sản phẩm.",
    "feature": "20cm Hộp 100 Que",
    "category": "Nhang trầm"
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
