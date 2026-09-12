-- Seed products + stock from static data (idempotent).
-- Run AFTER 001_agent.sql + 002_commerce.sql.
-- Prices: USD in data.ts × 25,000 → VND, rounded to nearest 1000.

INSERT INTO products (slug, sku, name, series, price_vnd, category, status, edition, description, materials, image, colors, sizes) VALUES
('k-09-stratos-chrono','KNS-K09-004-VOLT','K-09 STRATOS CHRONO','SERIES 09 // PROTO SPEC',17000000,'LAB EXPERIMENTAL','LIVE','142/500 REMAINING','Silhouette thí nghiệm No.09 — khung sợi carbon nguyên khối, khóa đệm Titanium Grade 5 và dây shock-cord volt phát quang. Giới hạn 500 đôi toàn cầu.','{"Carbon nguyên khối","Titanium Grade 5","Ripstop Polymer","Nitrogen Foam"}','','{"VOLT","CHROME","NOIR"}','{"39","40","41","42","43","44","45"}'),
('k-07-solaris-glitch','KNS-K07-007-CHROME','K-07 SOLARIS GLITCH','SERIES 07 // LIQUID CHROME',18500000,'AVANT-GARDE','LIVE','18 PAIRS REMAINING','Bề mặt phủ thủy ngân lỏng quang học biến sắc cùng túi đệm khí điều áp kỹ thuật số. Đỉnh cao kỹ thuật tạo hình điêu khắc.','{"Liquid Mercury TPU","Air Chamber"}','','{"CHROME","VOLT"}','{"39","40","41","42","43","44","45"}'),
('k-01-phantom-shadow','KNS-K01-001-BLK','K-01 PHANTOM SHADOW','SERIES 01 // PROTO SPEC',14750000,'HYPER-RUNNING','SOLD OUT','SOLD OUT // WAITLIST','Sợi dệt chống đạn Ballistic 1000D kết hợp khoá hít nam châm đa hướng. Thiết kế tĩnh lặng hoàn toàn trong bóng đêm.','{"Cordura Ballistic","Magnetic Lock"}','','{"NOIR"}','{"39","40","41","42","43","44","45"}'),
('k-12-titan-runner','KNS-K12-012-TITAN','K-12 TITAN RUNNER','SERIES 12 // BIOMECHANICAL',15500000,'HYPER-RUNNING','UPCOMING','PRE-ORDER // LÔ 02','Khuyên xỏ dây gia công Titanium thô nguyên khối cùng hệ đế phản lực Volt năng động.','{"Titanium","Mesh"}','','{"VOLT","NOIR"}','{"39","40","41","42","43","44","45"}'),
('k-04-aero-drift','KNS-K04-004-AERO','K-04 AERO DRIFT','SERIES 04 // RUNWAY',18000000,'AVANT-GARDE','UPCOMING','DROP 05 // SẮP PHÁT HÀNH','Dáng avant-garde lifestyle cho sàn runway — thân giày điêu khắc bất đối xứng, đế lattice carbon in 3D tham số.','{"Parametric Lattice","Chrome Film"}','','{"CHROME","VOLT"}','{"39","40","41","42","43","44","45"}'),
('k-x-lab-null','KNS-KX-000-NULL','K-X LAB NULL','PROTOTYPE // NOT FOR SALE',30000000,'LAB EXPERIMENTAL','SOLD OUT','ARCHIVE // NOT FOR SALE','Prototype nội bộ — không bán.','{"Prototype"}','','{"NULL"}','{"39","40","41","42","43","44","45"}')
ON CONFLICT (slug) DO UPDATE SET
  sku=EXCLUDED.sku, name=EXCLUDED.name, series=EXCLUDED.series, price_vnd=EXCLUDED.price_vnd,
  category=EXCLUDED.category, status=EXCLUDED.status, edition=EXCLUDED.edition,
  description=EXCLUDED.description, materials=EXCLUDED.materials, colors=EXCLUDED.colors, sizes=EXCLUDED.sizes;

-- Image URLs: run db/seed-images.mjs to fill the image column from src/lib/data.ts.

-- Stock mirrors the demo STOCK_TABLE: IN STOCK=4, HOT=2, SOLD OUT/ARCHIVE=0, PRE-ORDER=8.
INSERT INTO product_stock (slug, size, qty) VALUES
('k-09-stratos-chrono','39',4),('k-09-stratos-chrono','40',4),('k-09-stratos-chrono','41',4),('k-09-stratos-chrono','42',2),('k-09-stratos-chrono','43',4),('k-09-stratos-chrono','44',4),('k-09-stratos-chrono','45',0),
('k-07-solaris-glitch','39',0),('k-07-solaris-glitch','40',2),('k-07-solaris-glitch','41',4),('k-07-solaris-glitch','42',4),('k-07-solaris-glitch','43',4),('k-07-solaris-glitch','44',2),('k-07-solaris-glitch','45',0),
('k-01-phantom-shadow','39',0),('k-01-phantom-shadow','40',0),('k-01-phantom-shadow','41',0),('k-01-phantom-shadow','42',0),('k-01-phantom-shadow','43',0),('k-01-phantom-shadow','44',0),('k-01-phantom-shadow','45',0),
('k-12-titan-runner','39',8),('k-12-titan-runner','40',8),('k-12-titan-runner','41',8),('k-12-titan-runner','42',8),('k-12-titan-runner','43',8),('k-12-titan-runner','44',8),('k-12-titan-runner','45',8),
('k-04-aero-drift','39',8),('k-04-aero-drift','40',8),('k-04-aero-drift','41',8),('k-04-aero-drift','42',8),('k-04-aero-drift','43',8),('k-04-aero-drift','44',8),('k-04-aero-drift','45',8),
('k-x-lab-null','39',0),('k-x-lab-null','40',0),('k-x-lab-null','41',0),('k-x-lab-null','42',0),('k-x-lab-null','43',0),('k-x-lab-null','44',0),('k-x-lab-null','45',0)
ON CONFLICT (slug, size) DO UPDATE SET qty=EXCLUDED.qty;
