#!/bin/bash
# Script apply nginx config đầy đủ
# Chạy: bash backend/scripts/apply-nginx-config.sh

set -e

NGINX_CONFIG="/etc/nginx/sites-available/balotanthoidai.vn"
CONFIG_SOURCE="nginx-balotanthoidai.vn.conf"

echo "=========================================="
echo "🔧 APPLY NGINX CONFIG"
echo "=========================================="
echo ""

# 1. Kiểm tra file config source
if [ ! -f "$CONFIG_SOURCE" ]; then
    echo "❌ Config file not found: $CONFIG_SOURCE"
    echo "   Please run this script from project root where nginx-balotanthoidai.vn.conf exists"
    exit 1
fi

# 2. Backup config hiện tại
echo "1️⃣ Backing up current Nginx config..."
if [ -f "$NGINX_CONFIG" ]; then
    cp "$NGINX_CONFIG" "${NGINX_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
    echo "✅ Backup created"
else
    echo "⚠️  Current config not found, will create new"
fi
echo ""

# 3. Copy config mới
echo "2️⃣ Applying new Nginx config..."
sudo cp "$CONFIG_SOURCE" "$NGINX_CONFIG"
echo "✅ Config file copied"
echo ""

# 4. Test nginx config
echo "3️⃣ Testing Nginx config..."
if sudo nginx -t; then
    echo "✅ Nginx config is valid"
else
    echo "❌ Nginx config has errors!"
    echo "   Restoring backup..."
    sudo cp "${NGINX_CONFIG}.backup."* "$NGINX_CONFIG" 2>/dev/null || true
    exit 1
fi
echo ""

# 5. Reload nginx
echo "4️⃣ Reloading Nginx..."
sudo systemctl reload nginx
echo "✅ Nginx reloaded"
echo ""

# 6. Verify
echo "5️⃣ Verifying configuration..."
echo "   client_max_body_size:"
sudo grep "client_max_body_size" "$NGINX_CONFIG" | head -1
echo ""
echo "   Location blocks:"
sudo grep "^  location" "$NGINX_CONFIG" | head -10
echo ""

echo "=========================================="
echo "✅ CONFIG APPLIED SUCCESSFULLY!"
echo "=========================================="
echo ""
echo "Features enabled:"
echo "  ✅ client_max_body_size 50M (fix 413 error)"
echo "  ✅ Proxy timeouts for large uploads"
echo "  ✅ /uploads/ static file serving"
echo "  ✅ /admin SPA routing"
echo "  ✅ /api/ backend proxy"
echo "  ✅ /socket.io/ WebSocket support"
echo "  ✅ Security headers"
echo ""
echo "Test by:"
echo "  1. Upload an image in admin panel"
echo "  2. Check: curl -I https://balotanthoidai.vn/api/health"
echo ""

