# Troubleshooting Guide

## Common Issues and Solutions

### ❌ Error: "Cannot read properties of undefined (reading 'VITE_API_URL')"

**Cause:** Vite environment variables not loading properly.

**Solution:**
1. Ensure `.env` file exists in project root:
   ```bash
   # Check if file exists
   ls -la .env
   ```

2. Verify `.env` content:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **IMPORTANT**: Restart Vite dev server after creating/modifying `.env`:
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

4. Ensure environment variable has `VITE_` prefix (required by Vite)

5. Verify `vite.config.ts` exists with proper configuration

**Files to check:**
- ✅ `.env` - Environment variables
- ✅ `vite.config.ts` - Vite configuration
- ✅ `vite-env.d.ts` - TypeScript declarations
- ✅ `services/api.config.ts` - Has fallback value

---

### ❌ Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause:** Backend not allowing requests from frontend origin.

**Solution:**
1. Verify backend is running on `http://localhost:5000`
2. Check `backend/KnowledgeBase.API/Program.cs` has CORS configuration:
   ```csharp
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowReactApp", policy =>
       {
           policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
                 .AllowAnyHeader()
                 .AllowAnyMethod()
                 .AllowCredentials();
       });
   });
   ```
3. Ensure CORS middleware is added before routing:
   ```csharp
   app.UseCors("AllowReactApp");
   ```
4. Restart backend server

---

### ❌ Error: "Cannot connect to SQL Server"

**Solution:**
1. Check SQL Server service is running:
   ```bash
   # Windows: Services.msc
   # Look for "SQL Server (MSSQLSERVER)" or "SQL Server (SQLEXPRESS)"
   ```

2. Update connection string in `appsettings.json`:
   ```json
   // For default instance:
   "Server=localhost;Database=KnowledgeBase;..."
   
   // For SQL Express:
   "Server=localhost\\SQLEXPRESS;Database=KnowledgeBase;..."
   ```

3. Test connection in SSMS first

---

### ❌ Error: "401 Unauthorized" when calling API

**Cause:** Missing or invalid authentication token.

**Solution:**
1. Check if logged in (localStorage should have `accessToken`)
2. Verify token is being sent in request headers:
   ```javascript
   Authorization: Bearer <token>
   ```
3. Check token hasn't expired (1 hour expiry)
4. Try logging out and logging back in
5. Check browser console for token refresh errors

---

### ❌ Error: "Module not found" or import errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Restart dev server
npm run dev
```

---

### ❌ Backend won't start - "Port already in use"

**Solution:**
```bash
# Windows - Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID [process_id] /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

Or change port in `backend/KnowledgeBase.API/Properties/launchSettings.json`

---

### ❌ Frontend won't start - "Port 5173 already in use"

**Solution:**
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID [process_id] /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

Or specify different port:
```bash
npm run dev -- --port 3000
```

---

### ❌ Database seed data not inserted

**Solution:**
1. Check if tables exist:
   ```sql
   SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;
   ```

2. Run scripts in correct order:
   - First: `Phase1_Tables.sql`
   - Second: `Phase1_StoredProcedures.sql`
   - Third: `Phase1_SeedData.sql`

3. Check for errors in SQL output window

4. Manually verify:
   ```sql
   SELECT * FROM Roles;
   SELECT * FROM Users;
   ```

---

### ❌ Login fails with correct credentials

**Solution:**
1. Verify user exists in database:
   ```sql
   SELECT Email, FirstName, LastName, r.RoleName
   FROM Users u
   INNER JOIN Roles r ON u.RoleId = r.RoleId
   WHERE Email = 'admin@knowledgebase.com';
   ```

2. Check backend console for errors

3. Verify password is `Password123!` (case-sensitive)

4. Check JWT configuration in `appsettings.json`

5. Ensure backend can access database

---

### ❌ TypeScript errors

**Solution:**
1. Ensure all type definition files exist:
   - `vite-env.d.ts`
   - `tsconfig.json`
   - `tsconfig.node.json`

2. Restart TypeScript server in VS Code:
   - Ctrl/Cmd + Shift + P
   - "TypeScript: Restart TS Server"

3. Check for missing `@types` packages:
   ```bash
   npm install --save-dev @types/react @types/react-dom
   ```

---

### ❌ Environment variables not working

**Checklist:**
- [ ] `.env` file exists in project root
- [ ] Environment variables start with `VITE_`
- [ ] Dev server was restarted after creating/editing `.env`
- [ ] No spaces around `=` in `.env` file
- [ ] `vite.config.ts` has `envPrefix: 'VITE_'`

**Correct format:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Incorrect formats:**
```env
API_URL=...              # ❌ Missing VITE_ prefix
VITE_API_URL = ...       # ❌ Spaces around =
VITE_API_URL="..."       # ⚠️ Quotes usually not needed
```

---

### ❌ Axios interceptor infinite loop

**Cause:** Token refresh failing repeatedly.

**Solution:**
1. Check refresh token endpoint is working:
   ```bash
   POST http://localhost:5000/api/auth/refresh
   { "refreshToken": "your-token" }
   ```

2. Verify `_retry` flag is working in interceptor

3. Check refresh token hasn't expired (7 days)

4. Clear localStorage and login again:
   ```javascript
   localStorage.clear();
   ```

---

### ❌ Swagger UI not showing

**Solution:**
1. Ensure backend is running on `http://localhost:5000`

2. Check `Program.cs` has Swagger configuration:
   ```csharp
   if (app.Environment.IsDevelopment())
   {
       app.UseSwagger();
       app.UseSwaggerUI();
   }
   ```

3. Navigate to `http://localhost:5000` (not `/swagger`)

---

### ❌ .NET build errors

**Solution:**
```bash
cd backend/KnowledgeBase.API

# Clean and rebuild
dotnet clean
dotnet restore
dotnet build

# If still failing, check .csproj file for correct package versions
```

---

### ❌ "Cannot find module 'axios'"

**Solution:**
```bash
# Install axios
npm install axios

# Verify installation
npm list axios

# If still failing, check package.json includes:
# "axios": "^1.7.9"
```

---

## Development Best Practices

### Always check these when debugging:

1. **Backend logs** - Terminal running `dotnet run`
2. **Frontend logs** - Browser console (F12)
3. **Network tab** - See actual API requests/responses
4. **Database** - Verify data exists
5. **Environment** - Check `.env` values

### Restart checklist:

When things aren't working, try restarting in this order:
1. Frontend dev server (Ctrl+C, then `npm run dev`)
2. Backend API (Ctrl+C, then `dotnet run`)
3. SQL Server service (rarely needed)
4. VS Code / IDE

---

## Getting Help

If issue persists:

1. ✅ Check this troubleshooting guide
2. ✅ Review error message carefully
3. ✅ Check browser console (F12)
4. ✅ Check backend terminal logs
5. ✅ Verify database connection
6. ✅ Check all services are running
7. ✅ Review relevant documentation:
   - [GET_STARTED.md](GET_STARTED.md)
   - [SETUP_GUIDE.md](backend/SETUP_GUIDE.md)
   - [TESTING_GUIDE.md](backend/TESTING_GUIDE.md)

---

## Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| Environment variables | Restart Vite dev server |
| CORS errors | Check backend CORS config |
| 401 Unauthorized | Login again |
| Module not found | `npm install` |
| Port in use | Kill process or change port |
| Database connection | Check SQL Server service |
| Build errors | `dotnet clean && dotnet restore` |
| TypeScript errors | Restart TS server |

---

**Still stuck? Double-check that both backend and frontend are running simultaneously in separate terminals!**
