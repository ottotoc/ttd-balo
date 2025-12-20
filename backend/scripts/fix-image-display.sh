#!/bin/bash
# Script fix lỗi ảnh không hiển thị trên production
# Chạy: bash backend/scripts/fix-image-display.sh

set -e

echo "=========================================="
echo "🖼️  FIX IMAGE DISPLAY ISSUE"
echo "=========================================="
echo ""

# 1. Kiểm tra file ảnh có tồn tại không
echo "1️⃣ Checking uploaded images..."
cd /var/www/ttd-balo/ttd-balo/backend
if [ -d "uploads/blog" ]; then
    echo "✅ uploads/blog exists"
    echo "   Files in blog/:"
    ls -lh uploads/blog/ | head -10
else
    echo "❌ uploads/blog NOT found"
fi
echo ""

# 2. Kiểm tra permissions
echo "2️⃣ Checking permissions..."
UPLOADS_DIR="/var/www/ttd-balo/ttd-balo/backend/uploads"
if [ -d "$UPLOADS_DIR" ]; then
    CURRENT_PERMS=$(stat -c "%a" "$UPLOADS_DIR")
    CURRENT_OWNER=$(stat -c "%U:%G" "$UPLOADS_DIR")
    echo "   Current permissions: $CURRENT_PERMS"
    echo "   Current owner: $CURRENT_OWNER"
    
    # Set permissions cho nginx có thể đọc
    echo "   Setting permissions for nginx..."
    chmod -R 755 "$UPLOADS_DIR"
    # Nginx thường chạy với www-data
    chown -R www-data:www-data "$UPLOADS_DIR" 2>/dev/null || chown -R root:root "$UPLOADS_DIR"
    echo "✅ Permissions updated"
else
    echo "❌ Uploads directory not found!"
    exit 1
fi
echo ""

# 3. Kiểm tra nginx config
echo "3️⃣ Checking Nginx config..."
NGINX_CONFIG="/etc/nginx/sites-available/balotanthoidai.vn"
if [ -f "$NGINX_CONFIG" ]; then
    if grep -q "location /uploads/" "$NGINX_CONFIG"; then
        echo "✅ Nginx config has /uploads/ location"
        echo "   Config snippet:"
        grep -A 5 "location /uploads/" "$NGINX_CONFIG" | head -6
    else
        echo "❌ Nginx config MISSING /uploads/ location!"
        echo "   Adding it now..."
        
        # Backup config
        cp "$NGINX_CONFIG" "${NGINX_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
        
        # Add location block (before location /)
        sed -i '/location \/ {/i\  # Serve static files từ uploads (ảnh đã upload)\n  location /uploads/ {\n    alias /var/www/ttd-balo/ttd-balo/backend/uploads/;\n    expires 30d;\n    add_header Cache-Control "public, immutable";\n    access_log off;\n  }\n' "$NGINX_CONFIG"
        
        echo "✅ Added /uploads/ location to nginx config"
    fi
else
    echo "❌ Nginx config file not found!"
    exit 1
fi
echo ""

# 4. Test nginx config
echo "4️⃣ Testing Nginx config..."
if nginx -t; then
    echo "✅ Nginx config is valid"
else
    echo "❌ Nginx config has errors!"
    exit 1
fi
echo ""

# 5. Reload nginx
echo "5️⃣ Reloading Nginx..."
systemctl reload nginx
echo "✅ Nginx reloaded"
echo ""

# 6. Test image access
echo "6️⃣ Testing image access..."
if [ -d "uploads/blog" ] && [ "$(ls -A uploads/blog 2>/dev/null)" ]; then
    TEST_FILE=$(ls uploads/blog/*.webp 2>/dev/null | head -1)
    if [ ! -z "$TEST_FILE" ]; then
        FILENAME=$(basename "$TEST_FILE")
        echo "   Testing: https://balotanthoidai.vn/uploads/blog/$FILENAME"
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://balotanthoidai.vn/uploads/blog/$FILENAME" || echo "000")
        if [ "$HTTP_CODE" = "200" ]; then
            echo "✅ Image accessible via HTTPS"
        else
            echo "⚠️  HTTP Code: $HTTP_CODE (may need to check)"
        fi
    else
        echo "⚠️  No .webp files found in uploads/blog/"
    fi
else
    echo "⚠️  No files in uploads/blog/ to test"
fi
echo ""

# 7. Kiểm tra SELinux (nếu có)
if command -v getenforce &> /dev/null; then
    SELINUX_STATUS=$(getenforce 2>/dev/null || echo "Disabled")
    if [ "$SELINUX_STATUS" = "Enforcing" ]; then
        echo "⚠️  SELinux is Enforcing - may need to set context:"
        echo "   chcon -R -t httpd_sys_content_t $UPLOADS_DIR"
    fi
fi
echo ""

echo "=========================================="
echo "✅ FIX COMPLETE!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Check image URL in browser: https://balotanthoidai.vn/uploads/blog/[filename]"
echo "2. Check nginx error log: tail -f /var/log/nginx/error.log"
echo "3. Check file permissions: ls -la $UPLOADS_DIR/blog/"
echo ""

