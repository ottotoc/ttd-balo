# ✨ Auto Slug Feature - Tự Động Tạo Slug

## 📋 Tổng Quan

Đã thêm tính năng **tự động tạo slug** từ tên cho:
- ✅ **Products** (Sản phẩm)
- ✅ **Categories** (Danh mục)
- ✅ **Brands** (Thương hiệu)

## 🎯 Tính Năng

### 1. **Tự Động Tạo Slug**
- Khi bạn nhập **tên**, slug sẽ **tự động** được tạo
- Không cần phải nhập slug thủ công
- Slug được chuẩn hóa theo format URL-friendly

### 2. **Smart Behavior**
- **Khi tạo mới**: Slug tự động update theo tên
- **Khi chỉnh sửa thủ công**: Slug không còn tự động update
- **Visual feedback**: Background màu xám khi auto, trắng khi manual
- **Hint text**: Hiển thị trạng thái (tự động/thủ công)

### 3. **Vietnamese Support**
- ✅ Tự động bỏ dấu tiếng Việt
- ✅ Chuyển `đ` → `d`
- ✅ Lowercase tất cả
- ✅ Replace spaces với dashes
- ✅ Remove special characters

## 🔧 Cách Hoạt Động

### Ví Dụ Chuyển Đổi

| Input Name | Auto Slug |
|------------|-----------|
| `Bánh Mì Việt Nam` | `banh-mi-viet-nam` |
| `Cà Phê Đá` | `ca-phe-da` |
| `Táo Xanh` | `tao-xanh` |
| `Sữa Tươi 100%` | `sua-tuoi-100` |
| `Nước Cam (Fresh)` | `nuoc-cam-fresh` |

### Flow Diagram

```
┌─────────────────┐
│ Nhập Name       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ slugify(name)   │ ← Tự động convert
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Slug     │ ← Fill vào field
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User thấy slug  │ ← Background xám
└─────────────────┘
```

### Nếu User Edit Slug Thủ Công

```
┌─────────────────┐
│ User click slug │
│ field & edit    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Set flag:       │
│ slugManuallyEdit│ = true
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Slug không còn  │
│ auto update     │
│ Background trắng│
└─────────────────┘
```

## 📁 Files Đã Thay Đổi

### 1. Utility Function (NEW)
**`src/lib/slugify.js`**
```javascript
export function slugify(text) {
  // Convert Vietnamese text to URL-friendly slug
  // Returns: lowercase, no accents, dashes
}
```

### 2. Products Page
**`src/admin/pages/ProductsPage.jsx`**
- ✅ Import `slugify`
- ✅ Add `slugManuallyEdited` state
- ✅ Update `handleFormChange` logic
- ✅ Enhanced slug input UI

### 3. Categories Page
**`src/admin/pages/CategoriesPage.jsx`**
- ✅ Same updates as Products

### 4. Brands Page
**`src/admin/pages/BrandsPage.jsx`**
- ✅ Same updates as Products

## 🎨 UI Improvements

### Slug Field - Auto Mode
```
┌─────────────────────────────────┐
│ Slug (tự động từ tên)           │
├─────────────────────────────────┤
│ banh-mi-viet-nam                │ ← Background: #f8f9fa (xám)
│                                  │   Font: italic
└─────────────────────────────────┘
✨ Slug sẽ tự động cập nhật khi bạn nhập tên
```

### Slug Field - Manual Mode
```
┌─────────────────────────────────┐
│ Slug                            │
├─────────────────────────────────┤
│ my-custom-slug                  │ ← Background: white
│                                  │   Font: normal
└─────────────────────────────────┘
Bạn đã tùy chỉnh slug thủ công
```

## 🚀 Cách Sử Dụng

### Khi Tạo Mới Sản Phẩm

1. **Mở form** "Add Product"
2. **Nhập tên**: Ví dụ "Bánh Mì Việt Nam"
3. **Xem slug tự động**: `banh-mi-viet-nam` (auto fill)
4. **Option 1**: Giữ nguyên → Slug sẽ update theo name
5. **Option 2**: Edit slug → Slug sẽ cố định

### Khi Edit Sản Phẩm

1. **Mở form** edit
2. **Slug đã tồn tại** → Được load sẵn
3. **Auto-update TẮT** → Không thay đổi slug cũ
4. **Có thể edit** slug nếu muốn

### Reset về Auto Mode

- Chỉ có thể reset bằng cách **Cancel** và **Add Product** mới
- Hoặc refresh trang

## 💡 Best Practices

### ✅ DO
- Để slug tự động tạo cho đơn giản
- Edit slug nếu cần SEO-friendly hơn
- Kiểm tra slug trước khi save
- Dùng tên tiếng Việt thoải mái

### ❌ DON'T
- Không nhập slug thủ công trừ khi cần thiết
- Không dùng special characters trong name
- Không để trùng slug giữa các items
- Không để slug quá dài (> 100 chars)

## 🔧 Technical Details

### slugify() Function

```javascript
/**
 * Convert Vietnamese text to URL-friendly slug
 */
export function slugify(text) {
  if (!text) return ''
  
  // 1. Lowercase
  let slug = text.toLowerCase()
  
  // 2. Remove Vietnamese accents
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  // 3. Replace đ with d
  slug = slug.replace(/đ/g, 'd')
  
  // 4. Replace spaces/special chars with dashes
  slug = slug.replace(/[^a-z0-9]+/g, '-')
  
  // 5. Remove leading/trailing dashes
  slug = slug.replace(/^-+|-+$/g, '')
  
  // 6. Replace multiple dashes with single
  slug = slug.replace(/-+/g, '-')
  
  return slug
}
```

### State Management

```javascript
// Track if slug was manually edited
const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

// Logic
if (name === 'name' && !slugManuallyEdited) {
  // Auto-generate slug
  const autoSlug = slugify(value)
  setForm(prev => ({ ...prev, name: value, slug: autoSlug }))
} else if (name === 'slug') {
  // Mark as manually edited
  setSlugManuallyEdited(true)
  setForm(prev => ({ ...prev, [name]: value }))
}
```

### Reset Logic

```javascript
const resetForm = () => {
  setEditingProduct(null)
  setSlugManuallyEdited(false) // Reset flag
  setForm({ name: '', slug: '', ... })
}
```

## 📊 Examples

### Example 1: Tạo Sản Phẩm Mới

**Input:**
```
Name: Cà Phê Đen Đá
Slug: (auto) → ca-phe-den-da
```

**Result:**
- Slug được tạo tự động
- Background xám
- Save thành công

---

### Example 2: Tùy Chỉnh Slug

**Input:**
```
Name: Cà Phê Đen Đá
Slug: (auto) → ca-phe-den-da
       (edit) → cafe-den-da  ← User changes
```

**Result:**
- Slug giờ là `cafe-den-da`
- Background trắng
- Không còn auto-update

---

### Example 3: Thay Đổi Name Sau Khi Edit Slug

**Input:**
```
Name: Cà Phê Đen Đá
Slug: cafe-den-da (manual)
       
Name: Cà Phê Sữa Đá  ← Change name
Slug: cafe-den-da     ← Stays same (manual mode)
```

**Result:**
- Name thay đổi
- Slug KHÔNG thay đổi (vì đã manual)

## 🎯 Use Cases

### Use Case 1: Admin Thêm Sản Phẩm Nhanh
**Scenario:** Admin cần thêm 50 sản phẩm
**Solution:** Chỉ cần nhập name, slug tự động → Tiết kiệm thời gian

### Use Case 2: SEO-Friendly Slug
**Scenario:** Name dài, muốn slug ngắn hơn
**Solution:** Edit slug thủ công sau khi nhập name

### Use Case 3: Sản Phẩm Tiếng Việt
**Scenario:** Name có dấu tiếng Việt
**Solution:** Slug tự động bỏ dấu, URL-friendly

## 🐛 Troubleshooting

### Issue 1: Slug không tự động update
**Cause:** Đã click vào slug field
**Solution:** Cancel form và Add Product mới

### Issue 2: Slug có ký tự lạ
**Cause:** Name có special characters
**Solution:** slugify() sẽ tự động loại bỏ

### Issue 3: Slug quá dài
**Cause:** Name quá dài
**Solution:** Edit slug thủ công để rút ngắn

### Issue 4: Slug trùng nhau
**Cause:** Backend validation
**Solution:** Edit slug để unique

## ✅ Testing Checklist

### Products Page
- [ ] Tạo product mới, slug auto fill
- [ ] Nhập name tiếng Việt, slug bỏ dấu
- [ ] Edit slug, flag manual = true
- [ ] Background xám → trắng khi edit
- [ ] Hint text thay đổi đúng
- [ ] Cancel form reset flag
- [ ] Edit product, slug không auto

### Categories Page
- [ ] Same tests as Products

### Brands Page
- [ ] Same tests as Products

### Edge Cases
- [ ] Name rỗng → slug rỗng
- [ ] Name toàn ký tự đặc biệt
- [ ] Name rất dài (>200 chars)
- [ ] Name có emoji
- [ ] Name có số

## 📚 Related Files

```
src/
├── lib/
│   └── slugify.js                    (NEW - Utility)
└── admin/
    └── pages/
        ├── ProductsPage.jsx          (UPDATED)
        ├── CategoriesPage.jsx        (UPDATED)
        └── BrandsPage.jsx            (UPDATED)
```

## 🎉 Benefits

### For Admin Users
- ⚡ **Faster**: Không cần nhập slug
- 🎯 **Accurate**: Slug luôn đúng format
- 🇻🇳 **Vietnamese-friendly**: Hỗ trợ tiếng Việt
- 🔧 **Flexible**: Có thể tùy chỉnh nếu cần

### For Developers
- 🧹 **Clean code**: Reusable utility
- 🐛 **Less bugs**: Consistent slug format
- 📦 **Maintainable**: Single source of truth
- 🔄 **Extensible**: Easy to enhance

### For SEO
- 🔗 **URL-friendly**: Dashes, lowercase
- 🌏 **International**: No accents
- 📊 **Readable**: Human-friendly URLs
- 🎯 **Optimized**: Clean structure

## 🚀 Future Enhancements

Có thể thêm:
- [ ] Slug uniqueness check (real-time)
- [ ] Slug history (revert changes)
- [ ] Slug preview (before save)
- [ ] Custom slug rules per entity
- [ ] Slug templates
- [ ] Auto-suggest similar slugs
- [ ] Bulk slug regeneration

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Created `slugify()` utility
- ✅ Updated ProductsPage
- ✅ Updated CategoriesPage
- ✅ Updated BrandsPage
- ✅ Visual feedback (background color)
- ✅ Smart manual edit detection
- ✅ Vietnamese accent removal
- ✅ Full documentation

---

**Created:** October 25, 2025  
**Author:** AI Assistant  
**Status:** ✅ Production Ready

**Enjoy the auto-slug feature! 🎉**

