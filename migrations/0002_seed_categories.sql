-- Existing catalog IDs are retained as category IDs. No fabricated product records.
INSERT INTO product_categories(id,slug,name_vi,name_en,status,sort_order) VALUES
('tram-huong','tram-huong','Trầm Hương','Agarwood','published',1),
('tram-loai-4','tram-loai-4','Trầm Loại 4','Grade 4 agarwood','published',2),
('tram-loai-5','tram-loai-5','Trầm Loại 5','Grade 5 agarwood','published',3),
('tram-ruc','tram-ruc','Trầm Rục','Ruc agarwood','published',4),
('tram-toc','tram-toc','Trầm Tốc','Toc agarwood','published',5),
('bi-ky-nam','bi-ky-nam','Bì Kỳ Nam','Bi Ky Nam','published',6);
-- These are filter vocabulary, not assertions that every product suits each purpose.
INSERT INTO use_cases(id,slug,name_vi,name_en) VALUES
('personal','personal','Sử dụng cá nhân','Personal use'),
('gift','gift','Quà tặng','Gift'),
('incense','incense','Xông hương','Incense');
