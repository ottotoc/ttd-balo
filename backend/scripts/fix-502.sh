#!/bin/bash
# Script tự động fix lỗi 502 Bad Gateway
# Chạy: bash backend/scripts/fix-502.sh

set -e  # Exit on error

echo "=========================================="
echo "🔧 FIX 502 BAD GATEWAY"
echo "=========================================="
echo ""

cd /var/www/ttd-balo/ttd-balo/backend

# 1. Cài dependencies
echo "1️⃣ Installing dependencies..."
npm ci
echo "✅ Dependencies installed"
echo ""

# 2. Kiểm tra multer và sharp
echo "2️⃣ Checking required modules..."
if [ -d "node_modules/multer" ]; then
    echo "✅ multer installed"
else
    echo "❌ multer NOT found - installing..."
    npm install multer
fi

if [ -d "node_modules/sharp" ]; then
    echo "✅ sharp installed"
else
    echo "❌ sharp NOT found - installing..."
    npm install sharp
fi
echo ""

# 3. Tạo thư mục uploads nếu chưa có
echo "3️⃣ Checking uploads directory..."
mkdir -p uploads/projects uploads/blog uploads/general
chmod -R 755 uploads
echo "✅ Uploads directory ready"
echo ""

# 4. Xóa và tạo lại PM2 process
echo "4️⃣ Restarting PM2..."
pm2 delete ttd-balo-api 2>/dev/null || true
pm2 start src/app.js --name ttd-balo-api --update-env
pm2 save
echo "✅ PM2 restarted"
echo ""

# 5. Đợi backend khởi động
echo "5️⃣ Waiting for backend to start..."
sleep 3

# 6. Kiểm tra backend
echo "6️⃣ Testing backend..."
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Backend is running!"
    curl -s http://localhost:3000/health | head -3
else
    echo "❌ Backend still not responding"
    echo "   Checking logs..."
    pm2 logs ttd-balo-api --lines 30 --nostream
    exit 1
fi
echo ""

# 7. Reload nginx
echo "7️⃣ Reloading Nginx..."
systemctl reload nginx
echo "✅ Nginx reloaded"
echo ""

echo "=========================================="
echo "✅ FIX COMPLETE!"
echo "=========================================="
echo ""
echo "Backend status:"
pm2 status | grep ttd-balo-api
echo ""
echo "Test website: https://balotanthoidai.vn/admin"
echo ""

