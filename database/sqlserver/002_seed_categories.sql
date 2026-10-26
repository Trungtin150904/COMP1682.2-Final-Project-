-- Existing catalog IDs are retained as category IDs. No fabricated product records.
INSERT INTO product_categories(id,slug,name_vi,name_en,status,sort_order) VALUES
(N'tram-huong',N'tram-huong',N'Trầm Hương',N'Agarwood',N'published',1),
(N'tram-loai-4',N'tram-loai-4',N'Trầm Loại 4',N'Grade 4 agarwood',N'published',2),
(N'tram-loai-5',N'tram-loai-5',N'Trầm Loại 5',N'Grade 5 agarwood',N'published',3),
(N'tram-ruc',N'tram-ruc',N'Trầm Rục',N'Ruc agarwood',N'published',4),
(N'tram-toc',N'tram-toc',N'Trầm Tốc',N'Toc agarwood',N'published',5),
(N'bi-ky-nam',N'bi-ky-nam',N'Bì Kỳ Nam',N'Bi Ky Nam',N'published',6);
-- These are filter vocabulary, not assertions that every product suits each purpose.
INSERT INTO use_cases(id,slug,name_vi,name_en) VALUES
(N'personal',N'personal',N'Sử dụng cá nhân',N'Personal use'),
(N'gift',N'gift',N'Quà tặng',N'Gift'),
(N'incense',N'incense',N'Xông hương',N'Incense');
