// Test file - à exécuter après que le serveur soit lancé
// Run with: npm test (si jest est configuré)

const API_URL = 'http://localhost:5001/api';

// Test Products
async function testProducts() {
  console.log('\n📦 Test Products...');
  try {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    console.log(`✅ Got ${data.length} products`);
    return data[0];
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// Test Auth
async function testAuth() {
  console.log('\n🔐 Test Auth...');
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'test123',
        phone: '+1234567890'
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log('✅ Register successful');
      console.log('Token:', data.token.substring(0, 10) + '...');
      return data.token;
    } else {
      console.error('❌ Register failed:', data.error);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// Test Orders
async function testOrders(token, product) {
  console.log('\n📋 Test Orders...');
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: [
          {
            productId: product.id,
            weight: '7g',
            quantity: 1,
            pricePerUnit: 22,
            subtotal: 22
          }
        ],
        total: 22,
        shippingAddress: {
          name: 'Test User',
          address: '123 Main St',
          city: 'Test City',
          zipcode: '12345'
        }
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log('✅ Order created:', data.orderNumber);
      return data;
    } else {
      console.error('❌ Order failed:', data.error);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// Test Admin
async function testAdmin() {
  console.log('\n👨‍💼 Test Admin...');
  try {
    // Note: Need valid admin credentials in DB first
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@gaspass.com',
        password: 'admin123'
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log('✅ Admin login successful');
      
      // Test dashboard
      const dashRes = await fetch(`${API_URL}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      const dashData = await dashRes.json();
      console.log('✅ Dashboard:', dashData.stats);
    } else {
      console.log('⚠️ Admin account not created yet (expected)');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Starting API Integration Tests...\n');
  console.log('Make sure server is running on port 5001!\n');
  
  const product = await testProducts();
  const token = await testAuth();
  
  if (token && product) {
    const order = await testOrders(token, product);
  }
  
  await testAdmin();
  
  console.log('\n✅ Tests completed!');
}

runTests();
