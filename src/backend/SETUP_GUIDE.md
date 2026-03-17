# Knowledge Base Application - Setup Guide

## Prerequisites

### Required Software
1. **.NET 8.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
2. **SQL Server 2019+** or **SQL Server Express** - [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
3. **Node.js 18+** and **npm** - [Download](https://nodejs.org/)
4. **Visual Studio 2022** or **VS Code** (recommended)

### Optional Tools
- **SQL Server Management Studio (SSMS)** - For database management
- **Postman** or **Thunder Client** - For API testing
- **Git** - For version control

---

## Part 1: Database Setup

### Step 1: Create Database

Open SQL Server Management Studio (SSMS) or Azure Data Studio and run:

```sql
CREATE DATABASE KnowledgeBase;
GO
```

### Step 2: Run Migration Scripts

Execute the scripts in this exact order:

```sql
-- 1. Create tables
USE KnowledgeBase;
GO
-- Run the entire content of: /backend/Database/Phase1_Tables.sql

-- 2. Create stored procedures
-- Run the entire content of: /backend/Database/Phase1_StoredProcedures.sql

-- 3. Seed initial data
-- Run the entire content of: /backend/Database/Phase1_SeedData.sql
```

### Step 3: Verify Installation

```sql
-- Check tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Check stored procedures
SELECT ROUTINE_NAME 
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_TYPE = 'PROCEDURE'
ORDER BY ROUTINE_NAME;

-- Check seed data
SELECT * FROM Roles;
SELECT * FROM Teams;
SELECT * FROM Clients;
SELECT * FROM Users;
```

You should see:
- 3 Roles (User, Support, Admin)
- 5 Teams
- 4 Clients
- 4 Users

---

## Part 2: Backend Setup (.NET API)

### Step 1: Navigate to Backend Directory

```bash
cd backend/KnowledgeBase.API
```

### Step 2: Update Connection String

Edit `appsettings.json` and update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=KnowledgeBase;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

**Common Server Names:**
- Local SQL Server: `localhost` or `.` or `(local)`
- SQL Server Express: `localhost\\SQLEXPRESS` or `.\\SQLEXPRESS`
- Named Instance: `localhost\\INSTANCENAME`

**Alternative (SQL Authentication):**
```json
"DefaultConnection": "Server=localhost;Database=KnowledgeBase;User Id=sa;Password=YourPassword;TrustServerCertificate=True;MultipleActiveResultSets=true"
```

### Step 3: Restore NuGet Packages

```bash
dotnet restore
```

### Step 4: Build the Project

```bash
dotnet build
```

### Step 5: Run the API

```bash
dotnet run
```

The API should start on:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:5001`
- **Swagger UI**: `http://localhost:5000` (opens in browser)

### Step 6: Test the API

Using Swagger UI (http://localhost:5000):

1. **Test Health Check**
   - GET `/health`
   - Should return `{ "status": "healthy" }`

2. **Test Login**
   - POST `/api/auth/login`
   - Body:
     ```json
     {
       "email": "admin@knowledgebase.com",
       "password": "Password123!"
     }
     ```
   - Should return access token and user info

3. **Test Protected Endpoint**
   - Click "Authorize" button in Swagger
   - Enter: `Bearer YOUR_ACCESS_TOKEN`
   - GET `/api/user/profile`
   - Should return user profile

---

## Part 3: Frontend Setup (React)

### Step 1: Navigate to Project Root

```bash
cd ../..  # Back to project root
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Install Additional Packages

```bash
npm install axios
```

### Step 4: Configure Environment

The `.env` file should already exist with:

```env
VITE_API_URL=http://localhost:5000/api
NODE_ENV=development
```

If using a different port for your API, update `VITE_API_URL` accordingly.

### Step 5: Run the Frontend

```bash
npm run dev
```

The React app should start on:
- **URL**: `http://localhost:5173`

### Step 6: Test the Application

1. Open browser to `http://localhost:5173`
2. You should see the login page
3. Click one of the demo account buttons:
   - **Admin**: admin@knowledgebase.com
   - **Support**: support@knowledgebase.com
   - **User (Acme)**: user@acme.com
   - **User (TechStart)**: user@techstart.com
   - **Password**: Password123! (for all accounts)

4. After login, you should be redirected to the dashboard

---

## Part 4: Verification Checklist

### Backend ✅
- [ ] SQL Server is running
- [ ] Database "KnowledgeBase" created
- [ ] All tables created (Users, Roles, Teams, Clients, RefreshTokens)
- [ ] All stored procedures created (11 total)
- [ ] Seed data inserted (3 roles, 5 teams, 4 clients, 4 users)
- [ ] .NET API builds without errors
- [ ] API runs on http://localhost:5000
- [ ] Swagger UI accessible
- [ ] Health check returns "healthy"
- [ ] Login endpoint works

### Frontend ✅
- [ ] Node modules installed
- [ ] .env file configured
- [ ] React app runs on http://localhost:5173
- [ ] Login page loads
- [ ] Can login with demo accounts
- [ ] Redirects to dashboard after login
- [ ] Access token stored in localStorage
- [ ] API calls include Bearer token

---

## Common Issues & Solutions

### Issue: Cannot connect to SQL Server

**Solution:**
1. Check SQL Server service is running:
   - Open "Services" (Windows + R → `services.msc`)
   - Look for "SQL Server (MSSQLSERVER)" or "SQL Server (SQLEXPRESS)"
   - Start if stopped

2. Enable TCP/IP:
   - Open "SQL Server Configuration Manager"
   - SQL Server Network Configuration → Protocols
   - Enable "TCP/IP"
   - Restart SQL Server service

3. Check firewall allows SQL Server (port 1433)

### Issue: Login returns 401 Unauthorized

**Solution:**
1. Check database seed data ran successfully
2. Verify password hashing is correct
3. Check JWT configuration in appsettings.json
4. Ensure CORS is configured for frontend URL

### Issue: CORS errors in browser console

**Solution:**
1. Verify backend Program.cs has CORS configured
2. Check frontend URL is in allowed origins
3. Ensure `withCredentials: true` in axios config
4. Restart both backend and frontend

### Issue: "Module not found" errors in React

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: .NET build errors

**Solution:**
```bash
dotnet clean
dotnet restore
dotnet build
```

---

## Default Test Accounts

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| admin@knowledgebase.com | Password123! | Admin | Full system access |
| support@knowledgebase.com | Password123! | Support | Review and approve |
| user@acme.com | Password123! | User | Client: Acme Corp |
| user@techstart.com | Password123! | User | Client: TechStart Inc |

---

## Next Steps

Once Phase 1 is working:

1. ✅ Test all authentication endpoints
2. ✅ Test role-based authorization
3. ✅ Verify token refresh works
4. ✅ Test logout functionality
5. 🔄 Proceed to **Phase 2**: Tags & Article Base Structure

---

## Development Workflow

### Running Both Backend and Frontend

**Terminal 1 (Backend):**
```bash
cd backend/KnowledgeBase.API
dotnet run
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### Stopping Services

- Backend: `Ctrl + C` in terminal
- Frontend: `Ctrl + C` in terminal
- SQL Server: Keep running (or stop via Services)

---

## Support

For issues or questions:
1. Check this guide
2. Review error messages in console/terminal
3. Check browser console (F12) for frontend errors
4. Check API logs in backend terminal
5. Verify database connectivity and data

---

**Phase 1 Complete! 🎉**

You now have a working authentication system with:
- User registration and login
- JWT token authentication
- Role-based authorization (User, Support, Admin)
- Token refresh mechanism
- Protected API endpoints
- React frontend integration
