// Test script để kiểm tra upload API
const API_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🔍 Testing backend upload API...\n');

  // Test 1: Health check
  try {
    const health = await fetch(`${API_URL}/health`);
    const data = await health.json();
    console.log('✅ Backend is running:', data);
  } catch (error) {
    console.log('❌ Backend NOT running:', error.message);
    console.log('\n💡 Hãy chạy backend trước:');
    console.log('   cd backend');
    console.log('   npm run dev');
    return;
  }

  // Test 2: Check uploads endpoint (cần login)
  console.log('\n🔐 Testing upload endpoint...');
  console.log('   (Endpoint này cần admin login)');
  
  try {
    const response = await fetch(`${API_URL}/api/uploads/signed-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: 'test.jpg',
        contentType: 'image/jpeg'
      })
    });

    if (response.status === 401) {
      console.log('✅ Upload endpoint exists (401 = cần login, đúng rồi!)');
    } else {
      const data = await response.json();
      console.log('Response:', data);
    }
  } catch (error) {
    console.log('❌ Upload endpoint error:', error.message);
  }

  console.log('\n✅ Backend kiểm tra xong!');
  console.log('\n📝 Nếu thấy lỗi "Failed to fetch", có thể do:');
  console.log('   1. Backend chưa restart sau khi config GCS');
  console.log('   2. Console backend có error khi khởi động');
  console.log('   3. Kiểm tra backend terminal có lỗi GCS không');
  console.log('   4. Chưa login admin trong browser');
}

testAPI();

