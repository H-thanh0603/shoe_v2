-- 009: server cart + waitlist + reviews + per-product fit note
CREATE TABLE IF NOT EXISTS cart_items (
  user_id    TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  slug       TEXT NOT NULL REFERENCES products (slug) ON DELETE CASCADE,
  size       TEXT NOT NULL,
  color      TEXT NOT NULL DEFAULT '',
  qty        INTEGER NOT NULL CHECK (qty BETWEEN 1 AND 10),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, slug, size)
);

CREATE TABLE IF NOT EXISTS waitlist (
  email      TEXT PRIMARY KEY,
  slug       TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One review per delivered order — the order's lookup token is the author.
CREATE TABLE IF NOT EXISTS reviews (
  id         BIGSERIAL PRIMARY KEY,
  order_id   TEXT NOT NULL UNIQUE REFERENCES orders (id) ON DELETE CASCADE,
  slug       TEXT NOT NULL,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body       TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reviews_slug_idx ON reviews (slug, created_at DESC);

ALTER TABLE products ADD COLUMN IF NOT EXISTS fit_note TEXT NOT NULL DEFAULT '';

UPDATE products SET fit_note = s.note FROM (VALUES
  ('k-09-stratos-chrono', 'Form ôm vừa — cổ chân cao, nên đi tất mỏng. Nếu giữa hai size, chọn size lớn hơn.'),
  ('k-07-solaris-glitch', 'Form rộng vừa, đệm lún nhanh — đa số khách giữ đúng size thường đi.'),
  ('k-01-phantom-shadow', 'Form hơi rộng về mũi chân; chân ngang nên thử nhỏ hơn nửa size.'),
  ('k-12-titan-runner', 'Form chạy tiêu chuẩn, dây buộc khóa gót chắc — giữ size thường dùng.'),
  ('k-04-aero-drift', 'Upper vải dệt giãn theo chân — đi ban đầu hơi chặt, sau vài lần thì mềm.'),
  ('k-x-lab-null', 'Prototype form hẹp. Chân bề ngang lớn cân nhắc tăng một size.')
) AS s(slug, note)
WHERE products.slug = s.slug AND products.fit_note = '';
