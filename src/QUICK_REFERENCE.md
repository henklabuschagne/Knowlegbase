# Knowledge Base - Quick Reference Card

## 🚀 Quick Start Commands

### Start Backend
```bash
cd backend/KnowledgeBase.API
dotnet run
```
→ API: http://localhost:5000

### Start Frontend
```bash
npm run dev
```
→ App: http://localhost:5173

---

## 🔐 Demo Accounts

| Email | Password | Role | Access |
|-------|----------|------|--------|
| `admin@knowledgebase.com` | `Password123!` | Admin | Full access |
| `support@knowledgebase.com` | `Password123!` | Support | Review & approve |
| `user@acme.com` | `Password123!` | User | Client: Acme Corp |
| `user@techstart.com` | `Password123!` | User | Client: TechStart |

---

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login
POST   /api/auth/refresh           Refresh token
POST   /api/auth/revoke            Logout
```

### User
```
GET    /api/user/profile           Get profile
PUT    /api/user/profile           Update profile
POST   /api/user/change-password   Change password
GET    /api/user/roles             List roles (Admin/Support)
GET    /api/user/teams             List teams
GET    /api/user/clients           List clients
```

### Health
```
GET    /health                     API health check
```

---

## 📦 Database Scripts (Run in order)

```sql
-- 1. Create database
CREATE DATABASE KnowledgeBase;

-- 2. Tables
-- Run: /backend/Database/Phase1_Tables.sql

-- 3. Stored Procedures
-- Run: /backend/Database/Phase1_StoredProcedures.sql

-- 4. Seed Data
-- Run: /backend/Database/Phase1_SeedData.sql
```

---

## 🔧 Configuration Files

### Backend: `appsettings.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=KnowledgeBase;..."
  },
  "Jwt": {
    "Key": "YourSecretKey...",
    "Issuer": "KnowledgeBaseAPI",
    "Audience": "KnowledgeBaseClient"
  }
}
```

### Frontend: `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Common Commands

### Backend
```bash
# Restore packages
dotnet restore

# Build
dotnet build

# Run
dotnet run

# Clean
dotnet clean

# Publish
dotnet publish -c Release
```

### Frontend
```bash
# Install dependencies
npm install

# Dev server
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

### Database
```sql
-- Check tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;

-- Check stored procedures
SELECT ROUTINE_NAME FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_TYPE = 'PROCEDURE';

-- View users
SELECT u.Email, r.RoleName, t.TeamName, c.ClientName
FROM Users u
INNER JOIN Roles r ON u.RoleId = r.RoleId
LEFT JOIN Teams t ON u.TeamId = t.TeamId
LEFT JOIN Clients c ON u.ClientId = c.ClientId;
```

---

## 📝 Request Examples

### Register User
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "roleId": 1
}
```

### Login
```json
POST /api/auth/login
{
  "email": "admin@knowledgebase.com",
  "password": "Password123!"
}
```

### Update Profile
```json
PUT /api/user/profile
Authorization: Bearer {token}
{
  "firstName": "Jane",
  "lastName": "Smith",
  "teamId": 2
}
```

### Change Password
```json
POST /api/user/change-password
Authorization: Bearer {token}
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

---

## 🔍 Testing with Swagger

1. Open: http://localhost:5000
2. Login to get token
3. Click "Authorize" button
4. Enter: `Bearer {your-token}`
5. Test any endpoint

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to DB | Check SQL Server service running |
| CORS error | Verify frontend URL in backend CORS config |
| 401 Unauthorized | Check token in Authorization header |
| Port already in use | Change port in launchSettings.json |
| npm install fails | Delete node_modules and package-lock.json, retry |

---

## 📂 Key Files

### Backend
- `Program.cs` - API configuration
- `appsettings.json` - Configuration
- `Controllers/AuthController.cs` - Auth endpoints
- `Controllers/UserController.cs` - User endpoints
- `Services/AuthService.cs` - Auth logic
- `Repositories/UserRepository.cs` - Database access

### Frontend
- `App.tsx` - Root component
- `components/Login.tsx` - Login page
- `lib/api/` - API modules (articles, users, tags, etc.)
- `lib/appStore.ts` - Centralized data store
- `hooks/useAuth.tsx` - Auth context

### Database
- `Phase1_Tables.sql` - Table definitions
- `Phase1_StoredProcedures.sql` - Stored procedures
- `Phase1_SeedData.sql` - Initial data

---

## 📊 Phase Progress

- ✅ **Phase 1**: Authentication & Users (COMPLETE)
- ⏳ **Phase 2**: Tags & Article Base
- ⏳ **Phase 3**: Article Management & Versioning
- ⏳ **Phase 4**: Article Discovery & Tracking
- ⏳ **Phase 5**: Article Requests & Workflow
- ⏳ **Phase 6**: Feedback & Notifications
- ⏳ **Phase 7**: AI Integration

---

## 🔗 Useful Links

- Swagger UI: http://localhost:5000
- Frontend: http://localhost:5173
- Health Check: http://localhost:5000/health

---

## 📞 Need Help?

1. Check [SETUP_GUIDE.md](backend/SETUP_GUIDE.md)
2. Check [TESTING_GUIDE.md](backend/TESTING_GUIDE.md)
3. Review [README.md](README.md)
4. Check browser console (F12)
5. Check API logs in terminal