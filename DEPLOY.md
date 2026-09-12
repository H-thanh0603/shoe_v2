# Vận hành thực tế — checklist deploy

## 1. Database (Neon — free tier đủ cho start)

1. Tạo project tại https://neon.tech → copy `DATABASE_URL` (branch `main`).
2. Chạy migrations theo thứ tự:
   ```bash
   psql "$DATABASE_URL" -f kinesis-frontend/db/migrations/001_agent.sql
   psql "$DATABASE_URL" -f kinesis-frontend/db/migrations/002_commerce.sql
   psql "$DATABASE_URL" -f kinesis-frontend/db/migrations/003_seed.sql
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
vercel --prod
```

Sau deploy: cập nhật Google OAuth redirect URI + VNPay return URL với domain thật.

## 5. Admin

Truy cập `/admin` — chỉ email trong `ADMIN_EMAILS` (đã login Google) xem được.
Chức năng: danh sách đơn, chuyển trạng thái (pending → confirmed → shipped → delivered, hủy hoàn stock).

## 6. Chưa có — thêm khi cần

- Email xác nhận đơn (Resend) — stub env sẵn, chưa wire.
- User management / roles ngoài ADMIN_EMAILS.
- Refund/VNPay queryDR (truy vấn giao dịch).
- Đơn vị vận chuyển (GHTK/Shippo) — hiện nhập tay.
- Tests tự động — e2e đã verify tay qua API (xem git log).
