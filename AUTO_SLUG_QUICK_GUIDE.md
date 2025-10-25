# ⚡ Auto Slug - Hướng Dẫn Nhanh

## 🎯 Tính Năng Mới

**Slug tự động tạo từ tên** - Không cần nhập thủ công! ✨

## 🚀 Cách Dùng (30 giây)

### 1. Tạo Sản Phẩm Mới

```
1. Click "Add Product"
2. Nhập tên: "Bánh Mì Việt Nam"
3. Xem slug tự động: "banh-mi-viet-nam" ✅
4. Click Save!
```

**Đơn giản vậy thôi!** 🎉

---

### 2. Tùy Chỉnh Slug (Nếu Muốn)

```
1. Nhập tên: "Bánh Mì Việt Nam"
2. Slug auto: "banh-mi-viet-nam"
3. Click vào slug field
4. Edit thành: "banh-mi-vn"
5. Slug giờ cố định, không auto nữa
```

---

## 📊 Ví Dụ Chuyển Đổi

| Tên Sản Phẩm | Slug Tự Động |
|---------------|--------------|
| Cà Phê Đá | `ca-phe-da` |
| Táo Xanh | `tao-xanh` |
| Sữa Tươi 100% | `sua-tuoi-100` |
| Nước Cam (Fresh) | `nuoc-cam-fresh` |

---

## 💡 Tips

### ✅ Làm
- Để slug tự động để tiết kiệm thời gian
- Dùng tên tiếng Việt thoải mái
- Edit slug nếu cần SEO-friendly hơn

### ❌ Không Làm
- Không nhập slug thủ công trừ khi cần
- Không dùng ký tự đặc biệt lạ trong tên

---

## 🎨 Visual Feedback

### Slug Tự Động (Auto)
```
┌─────────────────────────────┐
│ Slug (tự động từ tên)       │
├─────────────────────────────┤
│ banh-mi-viet-nam            │ ← Nền xám, chữ nghiêng
└─────────────────────────────┘
✨ Slug sẽ tự động cập nhật khi bạn nhập tên
```

### Slug Thủ Công (Manual)
```
┌─────────────────────────────┐
│ Slug                        │
├─────────────────────────────┤
│ my-custom-slug              │ ← Nền trắng, chữ thẳng
└─────────────────────────────┘
Bạn đã tùy chỉnh slug thủ công
```

---

## 📍 Áp Dụng Cho

- ✅ **Products** (Sản phẩm)
- ✅ **Categories** (Danh mục)
- ✅ **Brands** (Thương hiệu)

---

## 🔧 Chi Tiết Kỹ Thuật

Slug được tạo bởi hàm `slugify()`:
- Bỏ dấu tiếng Việt: `á→a`, `ê→e`, `ô→o`
- Chuyển `đ→d`
- Lowercase tất cả
- Replace khoảng trắng → dấu gạch ngang
- Loại bỏ ký tự đặc biệt

---

## 📚 Đọc Thêm

- **Full guide**: `AUTO_SLUG_FEATURE.md`
- **Changelog**: `CHANGELOG.md` (Version 2.1.0)

---

## 🎉 Lợi Ích

- ⚡ **Nhanh hơn**: Không cần nhập slug
- 🎯 **Chuẩn hơn**: Format luôn đúng
- 🇻🇳 **Tiếng Việt**: Hỗ trợ đầy đủ
- 🔧 **Linh hoạt**: Có thể tùy chỉnh

---

**Thử ngay! Mở admin panel và tạo product mới! 🚀**

---

**Version:** 2.1.0  
**Created:** October 25, 2025  
**Status:** ✅ Ready to Use

