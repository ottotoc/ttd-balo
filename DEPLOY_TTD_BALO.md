# DEPLOY TTD-BALO (balotanthoidai.vn)

Tài liệu này mô tả **toàn bộ quy trình deploy production** cho website balotanthoidai.vn

bao gồm: Frontend (Vite + React), Backend (Node.js + Express + Prisma),

MySQL, PM2, Nginx và SSL (Certbot).

---

## 0. Thông tin tổng quan

- Server: Ubuntu 22.04 / 24.04

- Domain:
  - https://balotanthoidai.vn
  - https://www.balotanthoidai.vn

- Thư mục project:
  - Root: /var/www/ttd-balo/ttd-balo
  - Backend: /var/www/ttd-balo/ttd-balo/backend
  - Frontend build: /var/www/ttd-balo/ttd-balo/dist
  - Uploads: /var/www/ttd-balo/ttd-balo/backend/uploads

- Backend port nội bộ: 3000

- Process manager: PM2

- Reverse proxy: Nginx

---

## 1. Cài đặt hệ thống cơ bản

```bash
apt update && apt upgrade -y
apt install -y git curl unzip nginx certbot python3-certbot-nginx
```

---

## 2. Cài Node.js 20.x

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v
```

---

## 3. Cài PM2

```bash
npm install -g pm2
pm2 -v
```

---

## 4. Cài MySQL và tạo database

```bash
apt install -y mysql-server
systemctl enable --now mysql
```

### Tạo database + user

```sql
CREATE DATABASE ttd_balo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ttd'@'localhost' IDENTIFIED BY 'bAlOThOiDaI!';
GRANT ALL PRIVILEGES ON ttd_balo.* TO 'ttd'@'localhost';
FLUSH PRIVILEGES;
```

---

## 5. Clone source code

```bash
mkdir -p /var/www/ttd-balo
cd /var/www/ttd-balo
git clone <REPO_URL>
cd ttd-balo
```

---

## 6. Backend setup (Express + Prisma)

### 6.1 Tạo file .env

```bash
cd /var/www/ttd-balo/ttd-balo/backend
nano .env
```

Nội dung:

```env
PORT=3000
NODE_ENV=production
DATABASE_URL="mysql://ttd:bAlOThOiDaI%21@localhost:3306/ttd_balo"
JWT_SECRET="CHANGE_ME_LONG_RANDOM_SECRET"
REFRESH_SECRET="CHANGE_ME_LONG_RANDOM_SECRET_2"
CORS_ORIGIN="https://balotanthoidai.vn,https://www.balotanthoidai.vn"
```

> Lưu ý: dấu `!` trong password phải encode thành `%21`.

### 6.2 Tạo thư mục uploads với subfolders

```bash
cd /var/www/ttd-balo/ttd-balo/backend
mkdir -p uploads/projects uploads/blog uploads/general
chmod -R 755 uploads
# Lấy user chạy Node.js (thường là user hiện tại hoặc www-data)
# Nếu dùng PM2 với user hiện tại:
chown -R $USER:$USER uploads
# Hoặc nếu chạy với www-data:
# chown -R www-data:www-data uploads
```

**⚠️ QUAN TRỌNG:** Thư mục uploads phải có quyền ghi để upload ảnh hoạt động.

### 6.3 Cài dependency + migrate

```bash
cd /var/www/ttd-balo/ttd-balo/backend
npm ci
npx prisma generate
npx prisma migrate deploy
node prisma/seed.js
```

### 6.4 Chạy backend bằng PM2

```bash
cd /var/www/ttd-balo/ttd-balo/backend
pm2 start src/app.js --name ttd-balo-api
pm2 save
pm2 startup  # Tạo startup script (chạy lần đầu)
pm2 status
```

---

## 7. Frontend (Vite)

### 7.1 Tạo file .env cho frontend

```bash
cd /var/www/ttd-balo/ttd-balo
nano .env
```

Nội dung:

```env
VITE_API_URL=https://balotanthoidai.vn
```

> **Lưu ý:** Nếu backend và frontend cùng domain (dùng nginx reverse proxy), dùng domain chính.
> Nếu backend ở domain/port khác, điều chỉnh cho phù hợp.

### 7.2 Build production

```bash
cd /var/www/ttd-balo/ttd-balo
npm ci
npm run build
```

Sau build phải có:
- `dist/index.html`
- `dist/admin.html`

---

## 8. Cấu hình Nginx

Tạo file:

```bash
nano /etc/nginx/sites-available/balotanthoidai.vn
```

Nội dung:

```nginx
server {
  listen 80;
  server_name balotanthoidai.vn www.balotanthoidai.vn;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name balotanthoidai.vn www.balotanthoidai.vn;

  root /var/www/ttd-balo/ttd-balo/dist;
  index index.html;

  ssl_certificate /etc/letsencrypt/live/balotanthoidai.vn/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/balotanthoidai.vn/privkey.pem;

  # Serve static files từ uploads (ảnh đã upload)
  location /uploads/ {
    alias /var/www/ttd-balo/ttd-balo/backend/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
    access_log off;
  }

  # Frontend routes
  location / {
    try_files $uri $uri/ /index.html;
  }

  location = /admin {
    try_files /admin.html =404;
  }

  # Backend API
  location ^~ /api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Socket.IO
  location /socket.io/ {
    proxy_pass http://127.0.0.1:3000/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Enable site:

```bash
ln -sf /etc/nginx/sites-available/balotanthoidai.vn /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 9. SSL bằng Certbot

```bash
certbot --nginx -d balotanthoidai.vn -d www.balotanthoidai.vn
```

---

## 10. Kiểm tra

```bash
# Kiểm tra backend
curl -I https://balotanthoidai.vn/api/health

# Kiểm tra frontend
curl -I https://balotanthoidai.vn

# Kiểm tra uploads (sau khi có ảnh)
curl -I https://balotanthoidai.vn/uploads/projects/test.webp
```

Admin:
- https://balotanthoidai.vn/admin

---

## 11. Update / redeploy

```bash
# 1. Pull code mới
cd /var/www/ttd-balo/ttd-balo
git pull

# 2. Backend: Install dependencies + migrate
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
pm2 restart ttd-balo-api --update-env

# 3. Đảm bảo thư mục uploads có đủ subfolders (nếu chưa có)
mkdir -p uploads/projects uploads/blog uploads/general
chmod -R 755 uploads

# 4. Frontend: Build lại
cd ..
# Đảm bảo .env có VITE_API_URL
npm ci
npm run build

# 5. Reload nginx
systemctl reload nginx

# 6. Kiểm tra
pm2 status
pm2 logs ttd-balo-api --lines 50
```

---

## 12. Cấu trúc thư mục uploads

Sau khi deploy, thư mục uploads sẽ có cấu trúc:

```
backend/uploads/
├── projects/     # Ảnh sản phẩm
│   ├── {timestamp}-{name}.webp
│   ├── {timestamp}-{name}_dashboard.webp
│   └── {timestamp}-{name}_thumb.jpg
├── blog/         # Ảnh blog
│   ├── {timestamp}-{name}.webp
│   ├── {timestamp}-{name}_dashboard.webp
│   └── {timestamp}-{name}_thumb.jpg
└── general/      # Ảnh khác (mặc định)
    ├── {timestamp}-{name}.webp
    ├── {timestamp}-{name}_dashboard.webp
    └── {timestamp}-{name}_thumb.jpg
```

Mỗi ảnh upload sẽ tự động tạo 3 version:
- **Web version** (`.webp`): Max 1920px - cho frontend
- **Dashboard version** (`_dashboard.webp`): Max 800px - cho admin panel
- **Thumbnail** (`_thumb.jpg`): 300x300px - cho danh sách

---

## 13. Ghi chú quan trọng

### 13.1 Environment Variables

**Backend** (`backend/.env`):
- ✅ `DATABASE_URL`: Đã encode `!` thành `%21`
- ✅ `CORS_ORIGIN`: Đã có cả 2 domain (với và không có www)
- ⚠️ `JWT_SECRET` và `REFRESH_SECRET`: Nên thay bằng random string dài và phức tạp hơn

**Frontend** (`.env` ở root):
- ✅ `VITE_API_URL`: Phải trỏ đến domain production
- ⚠️ File này phải có trước khi build, nếu không sẽ dùng default `http://localhost:3000`

### 13.2 Permissions

- Thư mục `uploads/` phải có quyền ghi (755 hoặc 775)
- User chạy Node.js (PM2) phải có quyền ghi vào `uploads/`
- Nginx phải có quyền đọc `uploads/` để serve static files

### 13.3 Troubleshooting

**Lỗi upload ảnh:**
```bash
# Kiểm tra permissions
ls -la backend/uploads/
# Nếu thiếu quyền:
chmod -R 755 backend/uploads/
chown -R $USER:$USER backend/uploads/  # hoặc user chạy PM2
```

**Lỗi ảnh không hiển thị:**
```bash
# Kiểm tra nginx config
nginx -t
# Kiểm tra đường dẫn trong nginx config
ls -la /var/www/ttd-balo/ttd-balo/backend/uploads/
```

**PM2 không nhận env:**
```bash
pm2 restart ttd-balo-api --update-env
# Hoặc xóa và tạo lại:
pm2 delete ttd-balo-api
cd backend
pm2 start src/app.js --name ttd-balo-api
pm2 save
```

**Frontend gọi nhầm localhost:**
- Kiểm tra file `.env` có `VITE_API_URL` chưa
- Build lại: `npm run build`
- Clear cache browser

---

## 14. Backup

### Backup database

```bash
mysqldump -u ttd -p ttd_balo > backup_$(date +%Y%m%d).sql
```

### Backup uploads

```bash
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/uploads/
```

---

## 15. Monitoring

```bash
# Xem logs PM2
pm2 logs ttd-balo-api

# Xem status
pm2 status

# Xem nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

**✅ Hoàn tất!** Website đã sẵn sàng cho production.

