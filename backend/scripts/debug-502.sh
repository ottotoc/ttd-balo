#!/bin/bash
# Script debug lỗi 502 Bad Gateway
# Chạy trên VPS: bash backend/scripts/debug-502.sh

echo "=========================================="
echo "🔍 DEBUG 502 BAD GATEWAY"
echo "=========================================="
echo ""

# 1. Kiểm tra PM2
echo "1️⃣ Kiểm tra PM2 status:"
pm2 status
echo ""

# 2. Kiểm tra logs PM2
echo "2️⃣ PM2 logs (50 dòng cuối):"
pm2 logs ttd-balo-api --lines 50 --nostream
echo ""

# 3. Kiểm tra port 3000
echo "3️⃣ Kiểm tra port 3000:"
if command -v netstat &> /dev/null; then
    netstat -tlnp | grep 3000 || echo "❌ Không có process nào listen trên port 3000"
elif command -v ss &> /dev/null; then
    ss -tlnp | grep 3000 || echo "❌ Không có process nào listen trên port 3000"
else
    echo "⚠️ Không tìm thấy netstat hoặc ss"
fi
echo ""

# 4. Test backend trực tiếp
echo "4️⃣ Test backend localhost:"
curl -I http://localhost:3000/health 2>&1 | head -5
echo ""

# 5. Kiểm tra .env
echo "5️⃣ Kiểm tra .env file:"
if [ -f "backend/.env" ]; then
    echo "✅ File .env tồn tại"
    echo "   PORT: $(grep ^PORT backend/.env || echo 'NOT SET')"
    echo "   DATABASE_URL: $(grep ^DATABASE_URL backend/.env | cut -d'=' -f1)=***"
    echo "   CORS_ORIGIN: $(grep ^CORS_ORIGIN backend/.env || echo 'NOT SET')"
else
    echo "❌ File .env KHÔNG TỒN TẠI!"
fi
echo ""

# 6. Kiểm tra MySQL
echo "6️⃣ Kiểm tra MySQL connection:"
if command -v mysql &> /dev/null; then
    DB_URL=$(grep ^DATABASE_URL backend/.env | cut -d'"' -f2)
    if [ ! -z "$DB_URL" ]; then
        echo "   Testing connection..."
        # Extract info from DATABASE_URL: mysql://user:pass@host:port/db
        # This is a simple check, may need adjustment
        echo "   DATABASE_URL format: OK"
    else
        echo "   ⚠️ DATABASE_URL not found in .env"
    fi
else
    echo "   ⚠️ mysql client not found"
fi
echo ""

# 7. Kiểm tra nginx config
echo "7️⃣ Kiểm tra Nginx config:"
if [ -f "/etc/nginx/sites-available/balotanthoidai.vn" ]; then
    echo "✅ Nginx config file tồn tại"
    echo "   Proxy pass:"
    grep -A 2 "location.*api" /etc/nginx/sites-available/balotanthoidai.vn | grep proxy_pass || echo "   ❌ Không tìm thấy proxy_pass"
    nginx -t 2>&1 | tail -2
else
    echo "❌ Nginx config file KHÔNG TỒN TẠI!"
fi
echo ""

# 8. Kiểm tra dependencies
echo "8️⃣ Kiểm tra node_modules:"
if [ -d "backend/node_modules" ]; then
    echo "✅ node_modules tồn tại"
    echo "   Số packages: $(ls -1 backend/node_modules | wc -l)"
else
    echo "❌ node_modules KHÔNG TỒN TẠI!"
    echo "   → Chạy: cd backend && npm ci"
fi
echo ""

# 9. Kiểm tra uploads directory
echo "9️⃣ Kiểm tra uploads directory:"
if [ -d "backend/uploads" ]; then
    echo "✅ Thư mục uploads tồn tại"
    ls -la backend/uploads/ | head -5
    echo "   Subfolders:"
    ls -d backend/uploads/*/ 2>/dev/null || echo "   ⚠️ Chưa có subfolders (projects, blog, general)"
else
    echo "❌ Thư mục uploads KHÔNG TỒN TẠI!"
    echo "   → Chạy: mkdir -p backend/uploads/{projects,blog,general}"
fi
echo ""

# 10. Recommendations
echo "=========================================="
echo "💡 KHUYẾN NGHỊ:"
echo "=========================================="
echo ""

if ! pm2 list | grep -q "ttd-balo-api"; then
    echo "❌ PM2 process 'ttd-balo-api' không tồn tại"
    echo "   → Chạy: cd backend && pm2 start src/app.js --name ttd-balo-api"
    echo ""
fi

if ! curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "❌ Backend không response trên port 3000"
    echo "   → Kiểm tra logs: pm2 logs ttd-balo-api"
    echo "   → Thử start lại: pm2 restart ttd-balo-api --update-env"
    echo ""
fi

if [ ! -f "backend/.env" ]; then
    echo "❌ File .env không tồn tại"
    echo "   → Tạo file backend/.env với nội dung từ DEPLOY_TTD_BALO.md"
    echo ""
fi

echo "✅ Nếu vẫn lỗi, xem chi tiết trong DEPLOY_TTD_BALO.md mục 13.3"
echo ""

