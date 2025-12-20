#!/bin/bash
# Script fix lỗi 413 Request Entity Too Large khi upload ảnh
# Chạy: bash backend/scripts/fix-413-upload.sh

set -e

echo "=========================================="
echo "📤 FIX 413 REQUEST ENTITY TOO LARGE"
echo "=========================================="
echo ""

NGINX_CONFIG="/etc/nginx/sites-available/balotanthoidai.vn"

# 1. Backup config
echo "1️⃣ Backing up Nginx config..."
cp "$NGINX_CONFIG" "${NGINX_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
echo "✅ Backup created"
echo ""

# 2. Kiểm tra client_max_body_size
echo "2️⃣ Checking client_max_body_size..."
if grep -q "client_max_body_size" "$NGINX_CONFIG"; then
    CURRENT_SIZE=$(grep "client_max_body_size" "$NGINX_CONFIG" | head -1 | awk '{print $2}')
    echo "   Current size: $CURRENT_SIZE"
    if [[ "$CURRENT_SIZE" =~ ^[0-9]+[Mm]$ ]] && [[ "${CURRENT_SIZE%?}" -lt 30 ]]; then
        echo "   ⚠️  Size too small, updating to 50M..."
        sed -i 's/client_max_body_size.*/client_max_body_size 50M;/' "$NGINX_CONFIG"
        echo "✅ Updated to 50M"
    else
        echo "✅ Size is sufficient"
    fi
else
    echo "   ❌ client_max_body_size not found, adding..."
    # Thêm sau ssl_certificate_key
    sed -i '/ssl_certificate_key/a\  \n  # Tăng limit upload file size\n  client_max_body_size 50M;' "$NGINX_CONFIG"
    echo "✅ Added client_max_body_size 50M"
fi
echo ""

# 3. Kiểm tra proxy timeouts trong location /api/
echo "3️⃣ Checking proxy timeouts..."
if grep -A 10 "location.*api" "$NGINX_CONFIG" | grep -q "proxy_read_timeout"; then
    echo "✅ Proxy timeouts already configured"
else
    echo "   Adding proxy timeouts..."
    # Thêm sau proxy_set_header X-Forwarded-Proto
    sed -i '/proxy_set_header X-Forwarded-Proto \$scheme;/a\    \n    # Tăng timeout cho upload file lớn\n    proxy_read_timeout 300s;\n    proxy_connect_timeout 300s;\n    proxy_send_timeout 300s;' "$NGINX_CONFIG"
    echo "✅ Added proxy timeouts"
fi
echo ""

# 4. Test nginx config
echo "4️⃣ Testing Nginx config..."
if nginx -t; then
    echo "✅ Nginx config is valid"
else
    echo "❌ Nginx config has errors!"
    echo "   Restoring backup..."
    cp "${NGINX_CONFIG}.backup."* "$NGINX_CONFIG" 2>/dev/null || true
    exit 1
fi
echo ""

# 5. Reload nginx
echo "5️⃣ Reloading Nginx..."
systemctl reload nginx
echo "✅ Nginx reloaded"
echo ""

# 6. Verify
echo "6️⃣ Verifying configuration..."
echo "   client_max_body_size:"
grep "client_max_body_size" "$NGINX_CONFIG" | head -1
echo ""
echo "   proxy timeouts in /api/ location:"
grep -A 15 "location.*api" "$NGINX_CONFIG" | grep "proxy.*timeout" || echo "   (not found, but that's OK)"
echo ""

echo "=========================================="
echo "✅ FIX COMPLETE!"
echo "=========================================="
echo ""
echo "Now you can upload files up to 50MB."
echo "Backend limit is 30MB, so files will be accepted and then resized."
echo ""
echo "Test by uploading an image in the admin panel."
echo ""

