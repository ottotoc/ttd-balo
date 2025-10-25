/**
 * Test script to verify Cart API returns images from Google Cloud Storage
 * 
 * Usage:
 *   node test-cart-images.js
 * 
 * Requirements:
 *   - Backend running on http://localhost:3000
 *   - At least 1 product in cart with images
 */

const API_URL = 'http://localhost:3000';

async function testCartImages() {
  console.log('🧪 Testing Cart API - Images from Google Cloud Storage\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Get Cart
    console.log('\n📦 Test 1: GET /api/cart');
    console.log('-'.repeat(60));
    
    const response = await fetch(`${API_URL}/api/cart`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Response received');
    console.log(`Status: ${data.status}`);
    console.log(`Items in cart: ${data.data?.items?.length || 0}`);

    // Test 2: Check Images
    console.log('\n🖼️  Test 2: Checking Product Images');
    console.log('-'.repeat(60));

    if (!data.data?.items || data.data.items.length === 0) {
      console.log('⚠️  Cart is empty. Please add products to cart first.');
      console.log('\nTo add products:');
      console.log('1. Go to http://localhost:5173');
      console.log('2. Click on any product');
      console.log('3. Click "Thêm vào giỏ hàng"');
      console.log('4. Run this test again');
      return;
    }

    let hasImages = false;
    let hasGCSImages = false;

    data.data.items.forEach((item, index) => {
      console.log(`\nItem ${index + 1}:`);
      console.log(`  Product: ${item.product?.name || 'N/A'}`);
      console.log(`  SKU: ${item.product?.sku || 'N/A'}`);
      console.log(`  Quantity: ${item.quantity}`);
      
      if (item.product?.images) {
        hasImages = true;
        console.log(`  Images: ${item.product.images.length} image(s)`);
        
        item.product.images.forEach((img, imgIndex) => {
          const isGCS = img.url && img.url.includes('googleapis.com');
          if (isGCS) hasGCSImages = true;
          
          console.log(`    [${imgIndex + 1}] ${img.isPrimary ? '⭐ PRIMARY' : '  '} ${img.url}`);
          console.log(`        Source: ${isGCS ? '✅ Google Cloud Storage' : '❌ Local/Other'}`);
        });
      } else {
        console.log(`  Images: ❌ None`);
      }

      if (item.product?.category) {
        console.log(`  Category: ${item.product.category.name} (${item.product.category.slug})`);
      }

      if (item.product?.brand) {
        console.log(`  Brand: ${item.product.brand.name} (${item.product.brand.slug})`);
      }
    });

    // Test 3: Summary
    console.log('\n📊 Test 3: Summary');
    console.log('-'.repeat(60));
    
    if (hasImages) {
      console.log('✅ Images field is present in API response');
    } else {
      console.log('❌ Images field is missing - FIX NEEDED!');
    }

    if (hasGCSImages) {
      console.log('✅ Google Cloud Storage images detected');
    } else {
      console.log('⚠️  No GCS images found (products may not have GCS images uploaded)');
    }

    // Test 4: Frontend Logic Simulation
    console.log('\n🎨 Test 4: Frontend Image Selection Logic');
    console.log('-'.repeat(60));

    data.data.items.forEach((item, index) => {
      const imageUrl = item.product?.images?.find(img => img.isPrimary)?.url || 
                     item.product?.images?.[0]?.url || 
                     '/images/product-thumb-1.png';
      
      const source = imageUrl.includes('googleapis.com') ? 'GCS' : 
                    imageUrl.startsWith('/images/') ? 'Placeholder' : 'Other';
      
      console.log(`Item ${index + 1}: ${item.product?.name}`);
      console.log(`  Selected: ${imageUrl}`);
      console.log(`  Source: ${source}`);
    });

    // Final Result
    console.log('\n' + '='.repeat(60));
    console.log('🎉 TEST RESULTS');
    console.log('='.repeat(60));

    if (hasImages && hasGCSImages) {
      console.log('✅ ALL TESTS PASSED!');
      console.log('✅ Cart API returns images from Google Cloud Storage');
      console.log('✅ Frontend will display real product images');
    } else if (hasImages && !hasGCSImages) {
      console.log('⚠️  PARTIAL SUCCESS');
      console.log('✅ Cart API returns images');
      console.log('⚠️  But no GCS images found (upload images to GCS)');
    } else {
      console.log('❌ TEST FAILED!');
      console.log('❌ Cart API does not return images');
      console.log('❌ Check backend/src/utils/cart.js');
      console.log('\nExpected include:');
      console.log('  product: { include: { images: true, category: true, brand: true } }');
    }

    console.log('\n✨ Done!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPossible causes:');
    console.error('1. Backend not running (start with: cd backend && npm start)');
    console.error('2. Wrong API URL (current: ' + API_URL + ')');
    console.error('3. Network error');
    console.error('4. CORS issue');
  }
}

// Run test
testCartImages();

