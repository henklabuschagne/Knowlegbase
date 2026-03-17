# 🚀 Get Started with Knowledge Base Application

**Welcome!** This guide will get you up and running in **5 simple steps**.

---

## ⚡ Quick Setup (5 Steps)

### **Step 1: Install Prerequisites** (5 minutes)

Download and install these (if not already installed):

1. **.NET 8.0 SDK**: https://dotnet.microsoft.com/download/dotnet/8.0
2. **SQL Server**: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
   - Choose "Express" for development
3. **Node.js 18+**: https://nodejs.org/ (LTS version)

**Verify installations:**
```bash
dotnet --version    # Should show 8.0.x
node --version      # Should show v18.x or higher
npm --version       # Should show 9.x or higher
```

---

### **Step 2: Setup Database** (5 minutes)

1. Open **SQL Server Management Studio (SSMS)** or **Azure Data Studio**

2. Create database:
   ```sql
   CREATE DATABASE KnowledgeBase;
   GO
   ```

3. Run these scripts **in order** (copy-paste into query window):
   - `backend/Database/Phase1_Tables.sql`
   - `backend/Database/Phase1_StoredProcedures.sql`
   - `backend/Database/Phase1_SeedData.sql`

**Verify:**
```sql
SELECT COUNT(*) FROM Users;  -- Should return 4
```

---

### **Step 3: Configure & Run Backend** (3 minutes)

1. Open terminal and navigate to backend:
   ```bash
   cd backend/KnowledgeBase.API
   ```

2. **IMPORTANT**: Edit `appsettings.json` - Update the connection string:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=KnowledgeBase;Trusted_Connection=True;TrustServerCertificate=True"
     }
   }
   ```
   
   **For SQL Server Express, use:**
   ```json
   "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=KnowledgeBase;Trusted_Connection=True;TrustServerCertificate=True"
   ```

3. Run the API:
   ```bash
   dotnet restore
   dotnet run
   ```

4. You should see:
   ```
   Now listening on: http://localhost:5000
   ```

5. **Test**: Open browser to http://localhost:5000
   - You should see Swagger API documentation

---

### **Step 4: Run Frontend** (2 minutes)

1. Open a **NEW terminal** (keep backend running)

2. Navigate to project root:
   ```bash
   cd ../..  # Back to project root
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start frontend:
   ```bash
   npm run dev
   ```

5. You should see:
   ```
   Local: http://localhost:5173
   ```

---

### **Step 5: Login & Test** (2 minutes)

1. Open browser to: **http://localhost:5173**

2. Click any demo account button (or use credentials below):

   | Email | Password | Role |
   |-------|----------|------|
   | `admin@knowledgebase.com` | `Password123!` | Admin |
   | `support@knowledgebase.com` | `Password123!` | Support |
   | `user@acme.com` | `Password123!` | User |

3. **Success!** You should:
   - See the dashboard after login
   - See your name in the header
   - Be able to navigate the app

---

## ✅ You're All Set!

**Both servers should be running:**
- ✅ Backend API: http://localhost:5000
- ✅ Frontend App: http://localhost:5173

**Keep both terminals open while developing.**

---

## 🎯 What Can You Do Now?

### As Admin User (`admin@knowledgebase.com`)
- ✅ View/edit profile
- ✅ Change password
- ✅ Create articles (Phase 2+)
- ✅ Approve requests (Phase 2+)
- ✅ Full system access

### As Support User (`support@knowledgebase.com`)
- ✅ View/edit profile
- ✅ Review article requests (Phase 2+)
- ✅ Approve/reject requests (Phase 2+)

### As Regular User (`user@acme.com`)
- ✅ View/edit profile
- ✅ Search articles (Phase 2+)
- ✅ Request new articles (Phase 2+)
- ✅ Provide feedback (Phase 2+)

---

## 📖 Next Steps

### Explore the Documentation

1. **[README.md](README.md)** - Full project overview
2. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Command cheat sheet
3. **[SETUP_GUIDE.md](backend/SETUP_GUIDE.md)** - Detailed setup guide
4. **[TESTING_GUIDE.md](backend/TESTING_GUIDE.md)** - How to test everything
5. **[PHASE1_COMPLETE.md](PHASE1_COMPLETE.md)** - What's been built

### Test the API

1. Open Swagger: http://localhost:5000
2. Click "Authorize" button
3. Login to get a token
4. Paste token: `Bearer YOUR_TOKEN`
5. Try any endpoint!

### Start Development

Phase 1 is complete! Ready for Phase 2:
- Tag management system
- Article base structure
- Article CRUD operations

See **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** for roadmap.

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to database"

**Fix:**
1. Check SQL Server service is running
2. Verify server name in connection string
   - For default instance: `localhost`
   - For Express: `localhost\\SQLEXPRESS`
3. Test connection in SSMS first

### ❌ "Port 5000 already in use"

**Fix:**
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :5000
taskkill /PID [process_id] /F

# Mac/Linux:
lsof -ti:5000 | xargs kill
```

### ❌ "CORS error" in browser

**Fix:**
1. Verify frontend URL in `backend/KnowledgeBase.API/Program.cs`:
   ```csharp
   policy.WithOrigins("http://localhost:5173")
   ```
2. Restart backend

### ❌ "npm install" fails

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### ❌ Login shows "Invalid credentials"

**Fix:**
1. Verify database seed data ran:
   ```sql
   SELECT Email FROM Users;
   ```
2. Check you're using correct password: `Password123!`
3. Check backend console for errors

---

## 💡 Pro Tips

### Development Workflow

**Terminal 1 - Backend:**
```bash
cd backend/KnowledgeBase.API
dotnet watch run  # Auto-restarts on code changes
```

**Terminal 2 - Frontend:**
```bash
npm run dev  # Auto-reloads on code changes
```

### Viewing Logs

**Backend logs**: Check Terminal 1 (API console)
**Frontend logs**: Press F12 in browser → Console tab
**Database logs**: Use SQL Server Profiler (optional)

### Quick Database Reset

```sql
-- Reset to initial state
USE KnowledgeBase;
DELETE FROM RefreshTokens;
DELETE FROM Users WHERE Email NOT LIKE '%@knowledgebase.com' AND Email NOT LIKE '%@acme.com' AND Email NOT LIKE '%@techstart.com';
```

---

## 📞 Need Help?

1. **Check documentation** in `/backend` folder
2. **Review error messages** in terminal/console
3. **Test API** with Swagger UI
4. **Verify database** data exists
5. **Check browser console** for frontend errors

---

## 🎉 Congratulations!

You've successfully set up:
- ✅ SQL Server database with seed data
- ✅ .NET 8.0 Web API with authentication
- ✅ React frontend with login system
- ✅ Full-stack integration

**Happy coding!** 🚀

---

## 🔗 Important URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Swagger Docs**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

**Ready to build the knowledge base? Start coding!** 💻
