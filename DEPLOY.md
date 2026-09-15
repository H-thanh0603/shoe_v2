# Vận hành thực tế — checklist deploy

## 1. Database (Neon — free tier đủ cho start)

1. Tạo project tại https://neon.tech → copy `DATABASE_URL` (branch `main`).
   Bật **pooled connection** (PgBouncer) nếu traffic tăng — pool app chỉ 5 conn/instance.
2. Chạy migrations theo thứ tự (mới chỉ chạy file chưa chạy):
   ```bash
   for f in 001_agent 002_commerce 003_seed 004_checkpoint_hardening 005_orders_idempotency_promo; do
     psql "$DATABASE_URL" -f kinesis-frontend/db/migrations/$f.sql
   done
   DATABASE_URL="$DATABASE_URL" node kinesis-frontend/db/seed-images.mjs
   ```
   Neon hỗ trợ psql qua SSO connector, hoặc chạy local với connection string.

## 2. Google OAuth

1. https://console.cloud.google.com/apis/credentials → Create OAuth client (Web).
2. Authorized redirect URI: `https://your-domain/api/auth/callback/google`
   (dev: `http://localhost:3000/api/auth/callback/google`)
3. Copy `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` vào env.

## 3. VNPay

**Sandbox trước** (test end-to-end không cần hợp đồng):
1. Đăng ký devreg: https://sandbox.vnpayment.vn/devreg/ → nhận `VNPAY_TMN_CODE` + `VNPAY_HASH_SECRET`.
2. Sandbox URL: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`
3. `VNPAY_RETURN_URL` = `https://your-domain/api/payment/vnpay/return` (phải public).
4. Test card: https://sandbox.vnpayment.vn/apis/docs/thong-tin-co-ban/Thong-tin-tai-khoan-ngan-hang/

**Production**: ký hợp đồng VNPay merchant → thay TmnCode/HashSecret/PayURL production.

## 4. Deploy Vercel

```bash
cd kinesis-frontend
vercel link
vercel env add DATABASE_URL          # Neon URL
vercel env add AUTH_SECRET           # openssl rand -hex 32
vercel env add AUTH_TRUST_HOST       # true
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add ADMIN_EMAILS          # email của bạn (admin panel)
vercel env add VNPAY_TMN_CODE
vercel env add VNPAY_HASH_SECRET
vercel env add VNPAY_RETURN_URL      # https://<domain>/api/payment/vnpay/return
vercel env add KINESIS_CHECKPOINT_SECRET  # openssl rand -hex 32 (BẮT BUỘC prod)
vercel env add CRON_SECRET               # openssl rand -hex 32 (cho cron sweep)
vercel env add RESEND_API_KEY
vercel env add ORDER_FROM_EMAIL
vercel --prod
```

Lưu ý cron: Vercel Cron gọi `GET /api/admin/sweep` với
`Authorization: Bearer $CRON_SECRET` (tự động). Kiểm tra sau deploy:
`GET https://<domain>/api/health` → `{"ok":true,"db":"up"}`.
Nếu VNPay sandbox đổi secret → verify fail toàn bộ, check IPN log ngay.

Sau deploy: cập nhật Google OAuth redirect URI + VNPay return URL với domain thật.

## 5. Admin

Truy cập `/admin` — chỉ email trong `ADMIN_EMAILS` (đã login Google) xem được.
Chức năng: danh sách đơn, chuyển trạng thái (pending → confirmed → shipped → delivered, hủy hoàn stock).

## 6. Vận hành sau deploy

- Cron sweep chạy daily 03:00 (`vercel.json`) — hết đơn pending quá 24h tự hoàn kho.
  Nếu cron không chạy: check `CRON_SECRET` + Vercel Cron logs.
- Health: `GET /api/health` cho uptime monitor (UptimeRobot/BetterStack).
- Email xác nhận đơn (Resend) đã wire: COD + VNPay paid. Không có key → bỏ qua im lặng.
- DB backup: Neon PITR (check plan). Audit log giữ 90 ngày (cron tự prune).
- 2h sáng sập: xem Vercel function logs → `/api/health` → Neon dashboard
  (connections/locks) → VNPay merchant portal đối soát `payment_ref`.

## 7. Chưa có — thêm khi cần

- User management / roles ngoài ADMIN_EMAILS.
- Refund/VNPay queryDR (truy vấn giao dịch).
- Đơn vị vận chuyển (GHTK/Shippo) — hiện nhập tay.
- Rate limit cứng dùng KV (hiện in-memory, per-instance).
- CI chạy trên mọi push (`/.github/workflows/ci.yml`): tsc + lint + test
  (Postgres service) + build.
