const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/auth';
const testUser = {
  name: 'Test User',
  email: 'testuser123@example.com',
  password: 'Test123!',
  role: 'user',
};

async function testRegisterAndLogin() {
  try {
    // Try to register
    const regRes = await axios.post(`${BASE_URL}/register`, testUser);
    console.log('Registration response:', regRes.data);
  } catch (err) {
    if (err.response) {
      console.log('Registration error:', err.response.data);
    } else {
      console.log('Registration error:', err.message);
    }
  }

  try {
    // Try to login
    const loginRes = await axios.post(`${BASE_URL}/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    console.log('Login response:', loginRes.data);
  } catch (err) {
    if (err.response) {
      console.log('Login error:', err.response.data);
    } else {
      console.log('Login error:', err.message);
    }
  }
}

testRegisterAndLogin(); 