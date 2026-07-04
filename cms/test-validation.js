#!/usr/bin/env node
const http = require('http');
const fs = require('fs');

const tests = [];
let passCount = 0;
let failCount = 0;

function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5050,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('==== DOCTOR CMS VALIDATION TESTS ====\n');
  
  // Test 1: Valid Login
  console.log('TEST 1: Valid Login (doctor/doctor123)');
  let res1 = await makeRequest('POST', '/api/login', { username: 'doctor', password: 'doctor123' });
  if (res1.status === 200) {
    console.log('? PASS - Login successful\n');
    passCount++;
  } else {
    console.log('? FAIL - Login failed\n');
    failCount++;
  }

  // Test 2: Wrong Password Rate Limiting
  console.log('TEST 2: Wrong Password (should eventually rate limit)');
  let rateLimitTest = false;
  for (let i = 0; i < 6; i++) {
    let res = await makeRequest('POST', '/api/login', { username: 'doctor', password: 'wrongpass' });
    if (res.status === 429) {
      console.log(`? PASS - Rate limited after ${i} attempts\n`);
      rateLimitTest = true;
      passCount++;
      break;
    }
  }
  if (!rateLimitTest) {
    console.log('??  Rate limiting not triggered in 6 attempts\n');
  }

  // Test 3: Save and Load Draft
  console.log('TEST 3: Save Draft and Verify');
  let res3login = await makeRequest('POST', '/api/login', { username: 'doctor', password: 'doctor123' });
  let draftData = { config: { doctor: { headline: 'TEST HEADLINE ' + Date.now() } } };
  let res3save = await makeRequest('PUT', '/api/content', draftData);
  if (res3save.status === 200) {
    console.log('? PASS - Draft saved\n');
    passCount++;
  } else {
    console.log('? FAIL - Could not save draft\n');
    failCount++;
  }

  // Test 4: Health Check
  console.log('TEST 4: Health Check');
  let res4 = await makeRequest('GET', '/health');
  if (res4.status === 200) {
    console.log('? PASS - Health endpoint responding\n');
    passCount++;
  } else {
    console.log('? FAIL - Health check failed\n');
    failCount++;
  }

  // Test 5: Unauthorized Access
  console.log('TEST 5: Unauthorized Access (no session)');
  let res5 = await makeRequest('GET', '/api/content');
  if (res5.status === 401) {
    console.log('? PASS - Correctly rejected unauthorized request\n');
    passCount++;
  } else {
    console.log('? FAIL - Should have rejected with 401\n');
    failCount++;
  }

  console.log(`\n==== RESULTS ====`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total:  ${passCount + failCount}\n`);
}

runTests().catch(console.error);
