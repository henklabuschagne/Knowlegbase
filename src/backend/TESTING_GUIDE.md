# Phase 1 Testing Guide - Authentication & Users

This guide provides step-by-step instructions to test all Phase 1 functionality.

---

## Prerequisites

- Backend API running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- Database seeded with test data
- Swagger UI accessible at `http://localhost:5000`

---

## Test 1: Health Check

### Using Browser
1. Navigate to: `http://localhost:5000/health`
2. ✅ **Expected**: JSON response `{"status":"healthy","timestamp":"..."}`

### Using Swagger
1. Open `http://localhost:5000`
2. Find `GET /health` endpoint
3. Click "Try it out" → "Execute"
4. ✅ **Expected**: 200 OK with health status

---

## Test 2: User Registration

### Using Swagger UI

1. Open Swagger UI: `http://localhost:5000`
2. Find `POST /api/auth/register`
3. Click "Try it out"
4. Enter request body:

```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123!",
  "firstName": "Test",
  "lastName": "User",
  "roleId": 1,
  "teamId": 1,
  "clientId": null
}
```

5. Click "Execute"
6. ✅ **Expected**: 200 OK with:
   - userId
   - email
   - firstName, lastName
   - roleName
   - accessToken
   - refreshToken

### Using cURL

```bash
curl -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User",
    "roleId": 1
  }'
```

### Test Cases

| Test Case | Email | Expected Result |
|-----------|-------|-----------------|
| Valid registration | newuser@test.com | 200 OK |
| Duplicate email | admin@knowledgebase.com | 400 Bad Request |
| Invalid email format | invalid-email | 400 Bad Request |
| Short password (<8 chars) | test | 400 Bad Request |
| Missing required fields | (empty) | 400 Bad Request |

---

## Test 3: User Login

### Using Swagger UI

1. Find `POST /api/auth/login`
2. Click "Try it out"
3. Enter request body:

```json
{
  "email": "admin@knowledgebase.com",
  "password": "Password123!"
}
```

4. Click "Execute"
5. ✅ **Expected**: 200 OK with user data and tokens
6. **SAVE** the `accessToken` for next tests

### Test Different Roles

**Admin User:**
```json
{
  "email": "admin@knowledgebase.com",
  "password": "Password123!"
}
```
✅ Expected: roleName = "Admin"

**Support User:**
```json
{
  "email": "support@knowledgebase.com",
  "password": "Password123!"
}
```
✅ Expected: roleName = "Support"

**Regular User:**
```json
{
  "email": "user@acme.com",
  "password": "Password123!"
}
```
✅ Expected: roleName = "User", clientName = "Acme Corp"

### Test Cases

| Test Case | Credentials | Expected Result |
|-----------|-------------|-----------------|
| Valid admin login | admin@knowledgebase.com / Password123! | 200 OK |
| Valid support login | support@knowledgebase.com / Password123! | 200 OK |
| Valid user login | user@acme.com / Password123! | 200 OK |
| Wrong password | admin@knowledgebase.com / WrongPass | 401 Unauthorized |
| Non-existent user | fake@example.com / Password123! | 401 Unauthorized |
| Empty credentials | (empty) | 400 Bad Request |

---

## Test 4: Get User Profile (Protected Endpoint)

### Using Swagger UI

1. **First, authorize:**
   - Click the "Authorize" button (🔒 icon) at top right
   - Enter: `Bearer YOUR_ACCESS_TOKEN`
   - Click "Authorize"
   - Click "Close"

2. Find `GET /api/user/profile`
3. Click "Try it out" → "Execute"
4. ✅ **Expected**: 200 OK with user profile data

### Test Authorization

**With Valid Token:**
✅ Expected: 200 OK with profile

**Without Token:**
1. Click "Authorize" → "Logout"
2. Try `GET /api/user/profile` again
3. ✅ Expected: 401 Unauthorized

**With Invalid Token:**
1. Authorize with: `Bearer invalid_token_here`
2. Try `GET /api/user/profile`
3. ✅ Expected: 401 Unauthorized

---

## Test 5: Update User Profile

### Using Swagger UI

1. Ensure you're authorized (see Test 4)
2. Find `PUT /api/user/profile`
3. Click "Try it out"
4. Enter request body:

```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "teamId": 2,
  "clientId": null
}
```

5. Click "Execute"
6. ✅ **Expected**: 200 OK with updated profile
7. Verify firstName = "Updated", lastName = "Name"

---

## Test 6: Change Password

### Using Swagger UI

1. Ensure you're authorized
2. Find `POST /api/user/change-password`
3. Click "Try it out"
4. Enter request body:

```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

5. Click "Execute"
6. ✅ **Expected**: 200 OK with success message

### Verify Password Change

1. Logout: `POST /api/auth/revoke`
2. Login with new password:
```json
{
  "email": "admin@knowledgebase.com",
  "password": "NewPassword123!"
}
```
3. ✅ **Expected**: 200 OK with tokens

4. Login with old password should fail:
```json
{
  "email": "admin@knowledgebase.com",
  "password": "Password123!"
}
```
✅ Expected: 401 Unauthorized

### Test Cases

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Valid password change | Correct current, valid new | 200 OK |
| Wrong current password | Incorrect current | 400 Bad Request |
| Passwords don't match | newPassword ≠ confirmPassword | 400 Bad Request |
| Password too short | newPassword < 8 chars | 400 Bad Request |

---

## Test 7: Token Refresh

### Using Swagger UI

1. Login first and get refreshToken
2. Wait 1 hour (or modify JWT expiry for testing)
3. Find `POST /api/auth/refresh`
4. Click "Try it out"
5. Enter request body:

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

6. Click "Execute"
7. ✅ **Expected**: 200 OK with new accessToken and refreshToken

### Test Cases

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Valid refresh token | Current valid token | 200 OK with new tokens |
| Invalid refresh token | fake_token | 401 Unauthorized |
| Revoked refresh token | Previously revoked token | 401 Unauthorized |
| Expired refresh token | Token older than 7 days | 401 Unauthorized |

---

## Test 8: Logout (Revoke Token)

### Using Swagger UI

1. Ensure you're authorized
2. Find `POST /api/auth/revoke`
3. Click "Try it out"
4. Enter request body:

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

5. Click "Execute"
6. ✅ **Expected**: 200 OK with success message

### Verify Token Revocation

1. Try to refresh with the revoked token
2. ✅ **Expected**: 401 Unauthorized

---

## Test 9: Get Lookup Data

### Get All Roles (Admin/Support Only)

**As Admin:**
1. Login as admin@knowledgebase.com
2. Authorize with admin token
3. `GET /api/user/roles`
4. ✅ **Expected**: 200 OK with 3 roles

**As Regular User:**
1. Login as user@acme.com
2. Authorize with user token
3. `GET /api/user/roles`
4. ✅ **Expected**: 403 Forbidden

### Get All Teams

1. `GET /api/user/teams`
2. ✅ **Expected**: 200 OK with 5 teams

### Get All Clients

1. `GET /api/user/clients`
2. ✅ **Expected**: 200 OK with 4 clients

---

## Test 10: Frontend Integration

### Login Page Test

1. Open `http://localhost:5173`
2. ✅ **Expected**: Login page displays
3. Click "Admin User" demo button
4. ✅ **Expected**: Redirects to `/dashboard`
5. Open browser DevTools → Application → Local Storage
6. ✅ **Expected**: See `accessToken`, `refreshToken`, and `user` keys

### Manual Login Test

1. Refresh page to logout
2. Enter email: `support@knowledgebase.com`
3. Enter password: `Password123!`
4. Click "Sign In"
5. ✅ **Expected**: Redirects to dashboard
6. Check localStorage has tokens

### Invalid Login Test

1. Logout and return to login page
2. Enter email: `admin@knowledgebase.com`
3. Enter password: `WrongPassword`
4. Click "Sign In"
5. ✅ **Expected**: Error message displays
6. Should NOT redirect

### Token Persistence Test

1. Login successfully
2. Refresh the page
3. ✅ **Expected**: Still logged in (doesn't redirect to login)

### Logout Test

1. When logged in, logout
2. ✅ **Expected**: 
   - Redirected to login page
   - localStorage cleared
   - Cannot access protected routes

---

## Test 11: Database Verification

### Check User Creation

```sql
USE KnowledgeBase;

-- View all users
SELECT 
    u.UserId,
    u.Email,
    u.FirstName,
    u.LastName,
    r.RoleName,
    t.TeamName,
    c.ClientName,
    u.IsActive,
    u.CreatedAt,
    u.LastLoginAt
FROM Users u
INNER JOIN Roles r ON u.RoleId = r.RoleId
LEFT JOIN Teams t ON u.TeamId = t.TeamId
LEFT JOIN Clients c ON u.ClientId = c.ClientId
ORDER BY u.CreatedAt DESC;
```

✅ **Expected**: See newly registered users

### Check Refresh Tokens

```sql
-- View active refresh tokens
SELECT 
    rt.RefreshTokenId,
    rt.UserId,
    u.Email,
    rt.ExpiresAt,
    rt.IsRevoked,
    rt.CreatedAt
FROM RefreshTokens rt
INNER JOIN Users u ON rt.UserId = u.UserId
WHERE rt.IsRevoked = 0
ORDER BY rt.CreatedAt DESC;
```

✅ **Expected**: See active refresh tokens for logged-in users

### Check Last Login Times

```sql
-- Users with recent logins
SELECT 
    Email,
    FirstName,
    LastName,
    LastLoginAt
FROM Users
WHERE LastLoginAt IS NOT NULL
ORDER BY LastLoginAt DESC;
```

✅ **Expected**: See updated LastLoginAt for users who logged in

---

## Test 12: Error Handling

### Test API Error Responses

**400 Bad Request:**
```json
POST /api/auth/login
{
  "email": "invalid-email",
  "password": "short"
}
```
✅ Expected: 400 with validation errors

**401 Unauthorized:**
```
GET /api/user/profile
(No Authorization header)
```
✅ Expected: 401 Unauthorized

**500 Internal Server Error:**
- Stop SQL Server service
- Try any endpoint
✅ Expected: 500 with error message

---

## Test Summary Checklist

### Authentication
- [ ] User registration works
- [ ] User login works for all roles
- [ ] Invalid credentials are rejected
- [ ] JWT tokens are generated
- [ ] Refresh token works
- [ ] Logout revokes tokens

### Authorization
- [ ] Protected endpoints require authentication
- [ ] Role-based access control works
- [ ] Admin-only endpoints block regular users

### User Management
- [ ] Get profile works
- [ ] Update profile works
- [ ] Change password works
- [ ] Password validation enforced

### Lookup Data
- [ ] Get roles (admin/support only)
- [ ] Get teams (all users)
- [ ] Get clients (all users)

### Frontend Integration
- [ ] Login page works
- [ ] Tokens stored in localStorage
- [ ] Protected routes redirect to login
- [ ] Logout clears authentication

### Database
- [ ] User creation persisted
- [ ] Refresh tokens stored
- [ ] Last login time updated
- [ ] Password changes saved

### Error Handling
- [ ] Validation errors returned
- [ ] Authentication errors clear
- [ ] Server errors handled gracefully

---

## Performance Tests

### Token Generation Speed
- Login should complete in < 500ms
- Token refresh should complete in < 200ms

### Database Query Performance
- User lookup by email: < 50ms
- Profile retrieval: < 100ms

---

## Security Tests

### Password Security
- [ ] Passwords are hashed (never stored plain text)
- [ ] Salt is unique per user
- [ ] Hash algorithm is PBKDF2 with SHA256

### Token Security
- [ ] Tokens expire appropriately (access: 1h, refresh: 7d)
- [ ] Revoked tokens cannot be used
- [ ] Invalid tokens are rejected

### SQL Injection Prevention
```sql
-- Try SQL injection in login
{
  "email": "admin@knowledgebase.com' OR '1'='1",
  "password": "anything"
}
```
✅ Expected: Login fails (injection prevented)

---

## All Tests Passed? ✅

If all tests pass, **Phase 1 is complete!**

Ready to proceed to **Phase 2: Tags & Article Base Structure**
