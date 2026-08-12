import http from "http";
import app from "../../../app.js";
import mongoConnection from "../../../../config/mongo-connection.js";


const PORT = 5055;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function main() {
  console.log("\n=======================================================");
  console.log("   AUTH MODULE E2E & VALIDATION TEST SUITE");
  console.log("=======================================================\n");

  await mongoConnection();

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(PORT, "127.0.0.1", resolve));
  console.log(`Test server running at ${BASE_URL}\n`);

  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      testsPassed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}${detail ? `: ${detail}` : ""}`);
      testsFailed++;
    }
  }

  const timestamp = Date.now();
  const dummyUserName = `dummy_user_${timestamp}`;
  const dummyEmail = `dummy_${timestamp}@example.com`;
  const dummyPassword = `DummyPass123!`;

  let storedAccessToken = "";
  let storedRefreshToken = "";

  try {
    // ----------------------------------------------------
    // TEST SUITE 1: INPUT VALIDATION FAILURES
    // ----------------------------------------------------
    console.log("--- 1. Testing Input Validation Rules ---");

    // 1a. Missing fields
    let res = await fetch(`${BASE_URL}/api/auth/register-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    let data = await res.json();
    assert(res.status === 400 && data.success === false, "Register: Missing required fields yields 400");

    // 1b. Invalid email format
    res = await fetch(`${BASE_URL}/api/auth/register-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: "validuser", email: "invalid-email-format", password: "Password123!" }),
    });
    data = await res.json();
    assert(res.status === 400 && data.message === "Invalid email format", "Register: Invalid email format yields 400");

    // 1c. Password too short (< 6 chars)
    res = await fetch(`${BASE_URL}/api/auth/register-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: "validuser", email: "valid@example.com", password: "123" }),
    });
    data = await res.json();
    assert(res.status === 400 && data.message.includes("Password must be at least"), "Register: Short password (<6 chars) yields 400");

    // 1d. Username too short (< 3 chars)
    res = await fetch(`${BASE_URL}/api/auth/register-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: "ab", email: "valid@example.com", password: "Password123!" }),
    });
    data = await res.json();
    assert(res.status === 400 && data.message.includes("Username must be between"), "Register: Short username (<3 chars) yields 400");

    // ----------------------------------------------------
    // TEST SUITE 2: SUCCESSFUL REGISTRATION WITH DUMMY DATA
    // ----------------------------------------------------
    console.log("\n--- 2. Testing Dummy Data Registration ---");

    res = await fetch(`${BASE_URL}/api/auth/register-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: dummyUserName,
        email: dummyEmail,
        password: dummyPassword,
      }),
    });
    data = await res.json();
    assert(res.status === 201 && data.success === true, "Register: Dummy user created successfully (HTTP 201)");
    assert(typeof data.data?.accessToken === "string" && typeof data.data?.refreshToken === "string", "Register: Returns access and refresh tokens");
    assert(data.data?.user?.password === undefined, "Register: Sensitive password hash is excluded from response data");

    storedAccessToken = data.data?.accessToken;
    storedRefreshToken = data.data?.refreshToken;

    // ----------------------------------------------------
    // TEST SUITE 3: DUPLICATE USER REGISTRATION
    // ----------------------------------------------------
    console.log("\n--- 3. Testing Duplicate User Handling ---");

    res = await fetch(`${BASE_URL}/api/auth/register-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: dummyUserName,
        email: dummyEmail,
        password: dummyPassword,
      }),
    });
    data = await res.json();
    assert(res.status === 400 && data.message === "User exists", "Register: Reject duplicate email/username (HTTP 400)");

    // ----------------------------------------------------
    // TEST SUITE 4: LOGIN VALIDATION & CREDENTIAL CHECK
    // ----------------------------------------------------
    console.log("\n--- 4. Testing Login Endpoint ---");

    // 4a. Wrong password
    res = await fetch(`${BASE_URL}/api/auth/login-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: dummyEmail, password: "WrongPassword!" }),
    });
    data = await res.json();
    assert(res.status === 401 && data.message === "Invalid credentials", "Login: Wrong password yields HTTP 401");

    // 4b. Non-existent user
    res = await fetch(`${BASE_URL}/api/auth/login-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: `nonexistent_${timestamp}@example.com`, password: "Password123!" }),
    });
    data = await res.json();
    assert(res.status === 401 && data.message === "Invalid credentials", "Login: Non-existent user yields HTTP 401");

    // 4c. Valid login with email
    res = await fetch(`${BASE_URL}/api/auth/login-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: dummyEmail.toUpperCase(), password: dummyPassword }), // Test case-insensitivity
    });
    data = await res.json();
    assert(res.status === 200 && data.success === true, "Login: Valid credentials (case-insensitive email) succeeds (HTTP 200)");
    assert(data.data?.user?.email === dummyEmail, "Login: Returns correct dummy user email");
    assert(data.data?.user?.password === undefined, "Login: Excludes password hash from response");

    // ----------------------------------------------------
    // TEST SUITE 5: PROTECTED ROUTE AUTHENTICATION
    // ----------------------------------------------------
    console.log("\n--- 5. Testing Protected Route Middleware ---");

    // 5a. No Authorization Header
    res = await fetch(`${BASE_URL}/api/auth/me`, { method: "GET" });
    data = await res.json();
    assert(res.status === 401 && data.message.includes("Authorization header"), "Protected Route: No auth header yields HTTP 401");

    // 5b. Invalid Token
    res = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: { Authorization: "Bearer invalid.jwt.token" },
    });
    data = await res.json();
    assert(res.status === 401 && data.message.includes("Invalid or expired access token"), "Protected Route: Invalid token yields HTTP 401");

    // 5c. Valid Token
    res = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${storedAccessToken}` },
    });
    data = await res.json();
    assert(res.status === 200 && data.data?.user?.email === dummyEmail, "Protected Route: Valid Bearer token grants access (HTTP 200)");

    // ----------------------------------------------------
    // TEST SUITE 6: REFRESH TOKEN FLOW
    // ----------------------------------------------------
    console.log("\n--- 6. Testing Refresh Token Flow ---");

    // 6a. Invalid refresh token
    res = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: "invalid.refresh.token" }),
    });
    data = await res.json();
    assert(res.status === 401 && data.message.includes("Invalid or expired refresh token"), "Refresh Token: Invalid token yields HTTP 401");

    // 6b. Valid refresh token
    res = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
    });
    data = await res.json();
    assert(res.status === 200 && typeof data.data?.accessToken === "string", "Refresh Token: Valid refresh token issues new access token (HTTP 200)");

    const newAccessToken = data.data?.accessToken;
    // Verify access with new token
    res = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${newAccessToken}` },
    });
    data = await res.json();
    assert(res.status === 200 && data.data?.user?.email === dummyEmail, "Refresh Token: New access token operates successfully on protected routes");

    // ----------------------------------------------------
    // TEST SUITE 7: LOGOUT ENDPOINT
    // ----------------------------------------------------
    console.log("\n--- 7. Testing Logout Endpoint ---");

    res = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    data = await res.json();
    assert(res.status === 200 && data.message === "User logged out successfully", "Logout: Returns HTTP 200 success");

  } catch (err) {
    console.error("Uncaught exception during test run:", err);
    testsFailed++;
  } finally {
    server.close();
    console.log("\n=======================================================");
    console.log(`   TEST RESULT SUMMARY:`);
    console.log(`   Passed: ${testsPassed}`);
    console.log(`   Failed: ${testsFailed}`);
    console.log("=======================================================\n");

    if (testsFailed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

main();
