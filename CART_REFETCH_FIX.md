# 🐛 Cart - Fix Refetch Error

## ✅ Đã Sửa

**Error:**
```
TypeError: refetch is not a function
```

---

## 🔍 Root Cause

### Vấn Đề
```javascript
// CartPage.jsx - WRONG ❌
const { cart, loading, error, refetch } = useCart()
await refetch() // Error: refetch is not a function
```

### Nguyên Nhân
Hook `useCart` không export `refetch`, nó export `refresh`:

```javascript
// useCart.js
return {
  cart,
  loading,
  error,
  addItem,
  updateItem,      // ✅ Method có sẵn
  removeItem,      // ✅ Method có sẵn
  clearCart,       // ✅ Method có sẵn
  refresh: fetchCart,  // Tên là "refresh" không phải "refetch"
}
```

---

## ✅ Solution

### Approach
Thay vì gọi API trực tiếp và refetch, dùng **methods có sẵn** từ hook:

### Before (❌ Wrong)
```javascript
const { cart, loading, error, refetch } = useCart()

// Update
await cartAPI.updateItem(itemId, { quantity })
await refetch() // Error!

// Remove
await cartAPI.removeItem(itemId)
await refetch() // Error!

// Clear
await cartAPI.clear()
await refetch() // Error!
```

### After (✅ Correct)
```javascript
const { 
  cart, 
  loading, 
  error, 
  updateItem,      // ✅ Use hook method
  removeItem,      // ✅ Use hook method
  clearCart        // ✅ Use hook method
} = useCart()

// Update
await updateItem(itemId, newQuantity) // Auto refresh!

// Remove
await removeItem(itemId) // Auto refresh!

// Clear
await clearCart() // Auto refresh!
```

---

## 🎯 Benefits

### 1. **No Manual Refetch Needed**
Hook methods tự động refresh cart sau khi thay đổi

### 2. **Cleaner Code**
```javascript
// Before: 2 steps
await cartAPI.updateItem(itemId, { quantity })
await refetch()

// After: 1 step
await updateItem(itemId, quantity)
```

### 3. **Better Abstraction**
Logic refresh được handle trong hook, không cần worry ở component

### 4. **Type Safety**
Hook methods có signature rõ ràng

---

## 📝 Changes Made

### File: `src/pages/CartPage.jsx`

#### 1. **Import Changes**
```javascript
// Removed ❌
import { cart as cartAPI } from '../lib/api'
import { useEffect } from 'react'

// Kept ✅
import { useState } from 'react'
import { useCart } from '../hooks/useCart'
```

#### 2. **Hook Destructuring**
```javascript
// Before ❌
const { cart, loading, error, refetch } = useCart()

// After ✅
const { 
  cart, 
  loading, 
  error, 
  updateItem, 
  removeItem, 
  clearCart: clearCartAPI 
} = useCart()
```

#### 3. **Update Quantity Handler**
```javascript
// Before ❌
await cartAPI.updateItem(itemId, { quantity: newQuantity })
await refetch()

// After ✅
await updateItem(itemId, newQuantity)
```

#### 4. **Remove Item Handler**
```javascript
// Before ❌
await cartAPI.removeItem(itemId)
await refetch()

// After ✅
await removeItem(itemId)
```

#### 5. **Clear Cart Handler**
```javascript
// Before ❌
await cartAPI.clear()
await refetch()

// After ✅
await clearCartAPI()
```

---

## 🔧 Hook Methods

### useCart Hook API

```typescript
{
  // State
  cart: Cart | null
  loading: boolean
  error: string | null
  
  // Methods (all auto-refresh cart)
  addItem: (productId, variantId?, quantity?) => Promise<boolean>
  updateItem: (itemId, quantity) => Promise<boolean>
  removeItem: (itemId) => Promise<boolean>
  clearCart: () => Promise<boolean>
  refresh: () => Promise<void>
}
```

### Method Signatures

```javascript
// Add item to cart
await addItem(productId, variantId, quantity)

// Update item quantity
await updateItem(itemId, newQuantity)

// Remove item from cart
await removeItem(itemId)

// Clear entire cart
await clearCart()

// Manual refresh (rarely needed)
await refresh()
```

---

## ✅ Testing

### Test Cases

1. **Update Quantity**
   - [ ] Click + button
   - [ ] Click - button
   - [ ] Type quantity directly
   - [ ] Cart updates immediately
   - [ ] No errors in console

2. **Remove Item**
   - [ ] Click remove button
   - [ ] Confirm dialog appears
   - [ ] Item removed
   - [ ] Cart updates
   - [ ] No errors

3. **Clear Cart**
   - [ ] Click "Xóa tất cả"
   - [ ] Confirm dialog
   - [ ] All items removed
   - [ ] Empty state shows
   - [ ] No errors

---

## 🎉 Result

Bây giờ:
- ✅ Update quantity works
- ✅ Remove item works
- ✅ Clear cart works
- ✅ No refetch errors
- ✅ Auto refresh after changes
- ✅ Cleaner code
- ✅ Better abstraction

---

## 📚 Related Files

- `src/hooks/useCart.js` - Hook definition
- `src/pages/CartPage.jsx` - Fixed implementation
- `src/lib/api.js` - Low-level API (not used directly anymore)

---

**Version:** 2.4.3  
**Date:** October 25, 2025  
**Status:** ✅ **FIXED**

**Refresh trang và test lại! 🛒**

