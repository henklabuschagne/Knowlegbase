# Knowledge Base Application - Integration Guide

## Overview
This guide provides step-by-step instructions for integrating all completed phases into your running application.

---

## Part 1: Backend Integration

### Step 1: Register Services in Program.cs

Add the following to your `Program.cs` or `Startup.cs`:

```csharp
using KnowledgeBaseApp.Repositories;
using KnowledgeBaseApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers
builder.Services.AddControllers();

// Register Repositories
builder.Services.AddScoped<IActivityLogRepository, ActivityLogRepository>();
builder.Services.AddScoped<IEmailRepository, EmailRepository>();
builder.Services.AddScoped<ITemplateRepository, TemplateRepository>();
builder.Services.AddScoped<IPermissionRepository, PermissionRepository>();
builder.Services.AddScoped<IArticleRepository, ArticleRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();

// Register Services
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IExportImportService, ExportImportService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization();

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure middleware
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

### Step 2: Update appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=KnowledgeBase;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "KnowledgeBaseApp",
    "Audience": "KnowledgeBaseUsers",
    "ExpiryMinutes": 1440
  },
  "EmailSettings": {
    "Provider": "SendGrid",
    "FromEmail": "noreply@yourcompany.com",
    "FromName": "Knowledge Base System",
    "SendGrid": {
      "ApiKey": "YOUR_SENDGRID_API_KEY_HERE"
    },
    "SMTP": {
      "Host": "smtp.gmail.com",
      "Port": 587,
      "Username": "your-email@gmail.com",
      "Password": "your-app-password",
      "EnableSsl": true
    },
    "AWS": {
      "SES": {
        "Region": "us-east-1",
        "FromEmail": "noreply@yourcompany.com"
      }
    }
  },
  "AppUrl": "http://localhost:3000",
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### Step 3: Install Required NuGet Packages

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package Dapper
dotnet add package System.Data.SqlClient
dotnet add package BCrypt.Net-Next
dotnet add package SendGrid  # Optional: for SendGrid integration
dotnet add package AWSSDK.SimpleEmail  # Optional: for AWS SES
```

---

## Part 2: Database Setup

### Step 1: Run Database Creation Scripts

Execute in this order:

```sql
-- 1. Create Activity Log tables
-- Run: /database/tables/ActivityLogs.sql
-- Run: /database/tables/AuditTrail.sql

-- 2. Create Email tables
-- Run: /database/tables/EmailQueue.sql
-- Run: /database/tables/EmailTemplates.sql
-- Run: /database/tables/EmailPreferences.sql

-- 3. Create Template tables
-- Run: /database/tables/ArticleTemplates.sql
-- Run: /database/tables/TemplateFields.sql
-- Run: /database/tables/TemplateTags.sql

-- 4. Create Permission tables
-- Run: /database/tables/Teams.sql
-- Run: /database/tables/TeamMembers.sql
-- Run: /database/tables/CustomRoles.sql
-- Run: /database/tables/RolePermissions.sql
-- Run: /database/tables/UserCustomRoles.sql
-- Run: /database/tables/ArticlePermissions.sql
```

### Step 2: Create Stored Procedures

Execute all stored procedures from `/database/stored_procedures/`:

```sql
-- Activity Logs
sp_LogActivity.sql
sp_GetActivityLogs.sql
sp_GetAuditTrail.sql
sp_GetActivityStats.sql

-- Email
sp_QueueEmail.sql
sp_GetPendingEmails.sql
sp_UpdateEmailStatus.sql
sp_GetEmailTemplate.sql
sp_GetUserEmailPreferences.sql
sp_UpsertEmailPreference.sql
sp_GetEmailById.sql
sp_GetAllEmailTemplates.sql
sp_UpdateEmailTemplate.sql
sp_GetEmailHistory.sql

-- Templates
sp_CreateArticleTemplate.sql
sp_GetArticleTemplates.sql
sp_GetArticleTemplateById.sql
sp_UpdateArticleTemplate.sql
sp_DeleteArticleTemplate.sql
sp_IncrementTemplateUsage.sql
sp_AddTemplateField.sql

-- Permissions
sp_CreateTeam.sql
sp_GetTeams.sql
sp_AddTeamMember.sql
sp_CreateCustomRole.sql
sp_AddRolePermission.sql
sp_AssignRoleToUser.sql
sp_CheckUserPermission.sql
sp_GrantArticlePermission.sql
```

### Step 3: Insert Initial Data

```sql
-- Insert default email templates
INSERT INTO EmailTemplates (TemplateName, Subject, TemplateContent, Description, Variables, IsActive)
VALUES 
('ArticleApproval', 
 'Article Pending Approval: {{articleTitle}}',
 '<html><body><h2>Article Approval Required</h2><p>Hi {{recipientName}},</p><p>The article "<strong>{{articleTitle}}</strong>" is awaiting your approval.</p><p><a href="{{approvalUrl}}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Review Article</a></p><p>Thank you!</p></body></html>',
 'Template for article approval notifications',
 'recipientName,articleTitle,articleId,approvalUrl',
 1),
 
('ArticlePublished',
 'Article Published: {{articleTitle}}',
 '<html><body><h2>Article Published Successfully</h2><p>Hi {{recipientName}},</p><p>Great news! Your article "<strong>{{articleTitle}}</strong>" has been published and is now live.</p><p><a href="{{articleUrl}}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Article</a></p><p>Thank you for your contribution!</p></body></html>',
 'Template for article published notifications',
 'recipientName,articleTitle,articleId,articleUrl',
 1),
 
('FeedbackReceived',
 'Feedback Received: {{articleTitle}}',
 '<html><body><h2>New Feedback on Your Article</h2><p>Hi {{recipientName}},</p><p>Your article "<strong>{{articleTitle}}</strong>" has received new feedback from readers.</p><p><a href="{{feedbackUrl}}" style="background-color: #FF9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Feedback</a></p><p>Thank you!</p></body></html>',
 'Template for feedback notifications',
 'recipientName,articleTitle,articleId,feedbackUrl',
 1);

-- Insert default custom roles
INSERT INTO CustomRoles (RoleName, Description, IsActive)
VALUES 
('Content Editor', 'Can create and edit articles but cannot publish', 1),
('Reviewer', 'Can review and approve articles', 1),
('Analytics Viewer', 'Can view analytics and reports', 1);

-- Insert default permissions for Content Editor
DECLARE @ContentEditorRoleId INT = (SELECT RoleId FROM CustomRoles WHERE RoleName = 'Content Editor');

INSERT INTO RolePermissions (RoleId, Resource, Action, Scope)
VALUES 
(@ContentEditorRoleId, 'Articles', 'Read', 'All'),
(@ContentEditorRoleId, 'Articles', 'Create', 'Own'),
(@ContentEditorRoleId, 'Articles', 'Update', 'Own'),
(@ContentEditorRoleId, 'Tags', 'Read', 'All');

-- Insert default teams (optional)
INSERT INTO Teams (TeamName, Description, IsActive)
VALUES 
('Engineering', 'Engineering team documentation', 1),
('Support', 'Customer support knowledge base', 1),
('Product', 'Product documentation team', 1);
```

---

## Part 3: Frontend Integration

### Step 1: Install Dependencies

```bash
npm install axios
npm install react-router
npm install lucide-react
# shadcn/ui components are already set up
```

### Step 2: Update App Routing

Update your `/App.tsx`:

```tsx
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { ActivityLogViewer } from './components/ActivityLogViewer';
import { TemplateManager } from './components/TemplateManager';
import { PermissionManager } from './components/PermissionManager';
import { ExportImport } from './components/ExportImport';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const userRole = localStorage.getItem('role'); // Get from auth

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        {userRole === 'Admin' && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/activity-logs" element={<ActivityLogViewer />} />
            <Route path="/admin/templates" element={<TemplateManager />} />
            <Route path="/admin/permissions" element={<PermissionManager />} />
            <Route path="/admin/export-import" element={<ExportImport />} />
          </>
        )}

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Step 3: Configure API Base URL

Create `/src/config/api.ts`:

```typescript
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
};

// Add to .env file:
// REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Update Service Files

The API modules are located in `/lib/api/`:
- `/lib/api/activity.ts`
- `/lib/api/users.ts`
- `/lib/api/articles.ts`
- (and other domain modules)

Make sure they're imported and used in components.

---

## Part 4: Testing the Integration

### Test 1: Activity Logging

```bash
# Start backend
cd backend
dotnet run

# Start frontend
cd frontend
npm start

# Navigate to: http://localhost:3000/admin/activity-logs
# Verify activity logs are displayed
```

### Test 2: Email System

```csharp
// Test email queueing via API
POST http://localhost:5000/api/email/queue
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "recipientEmail": "test@example.com",
  "recipientName": "Test User",
  "subject": "Test Email",
  "body": "This is a test email",
  "priority": "Normal"
}

// Process pending emails
POST http://localhost:5000/api/email/process
Authorization: Bearer YOUR_JWT_TOKEN
```

### Test 3: Templates

```bash
# Navigate to: http://localhost:3000/admin/templates
# Click "Create Template"
# Fill in template details
# Add dynamic fields
# Click "Create Template"
# Verify template appears in list
```

### Test 4: Permissions

```bash
# Navigate to: http://localhost:3000/admin/permissions
# Go to "Teams" tab
# Click "Create Team"
# Create a test team
# Add members to team
# Go to "Custom Roles" tab
# Create a custom role with permissions
```

### Test 5: Export/Import

```bash
# Navigate to: http://localhost:3000/admin/export-import
# Go to "Export" tab
# Select "Articles" and "JSON"
# Click "Export Data"
# Verify download starts

# Go to "Import" tab
# Paste JSON data
# Click "Import Data"
# Verify import results
```

---

## Part 5: Background Jobs Setup (Optional but Recommended)

### Option A: Hangfire (Recommended)

```bash
dotnet add package Hangfire.AspNetCore
dotnet add package Hangfire.SqlServer
```

```csharp
// In Program.cs
using Hangfire;
using Hangfire.SqlServer;

builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHangfireServer();

var app = builder.Build();

app.UseHangfireDashboard("/hangfire");

// Schedule recurring jobs
RecurringJob.AddOrUpdate<IEmailService>(
    "process-emails",
    service => service.ProcessPendingEmailsAsync(),
    Cron.Minutely);
```

### Option B: .NET Background Service

Create `/Services/EmailBackgroundService.cs`:

```csharp
public class EmailBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<EmailBackgroundService> _logger;

    public EmailBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<EmailBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                
                await emailService.ProcessPendingEmailsAsync();
                
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing emails");
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }
}

// Register in Program.cs
builder.Services.AddHostedService<EmailBackgroundService>();
```

---

## Part 6: Security Configuration

### Configure HTTPS (Production)

```csharp
// In Program.cs
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
    app.UseHsts();
}
```

### Configure Rate Limiting

```bash
dotnet add package AspNetCoreRateLimit
```

```csharp
// In Program.cs
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(options =>
{
    options.GeneralRules = new List<RateLimitRule>
    {
        new RateLimitRule
        {
            Endpoint = "*",
            Limit = 1000,
            Period = "1h"
        }
    };
});
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

app.UseIpRateLimiting();
```

---

## Part 7: Monitoring and Logging

### Add Serilog (Recommended)

```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File
```

```csharp
// In Program.cs
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/knowledgebase-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();
```

---

## Part 8: Deployment Checklist

### Pre-Deployment
- [ ] All database scripts executed
- [ ] Initial data seeded
- [ ] Email templates created
- [ ] Email provider configured
- [ ] JWT secret key changed to production value
- [ ] Connection string updated to production database
- [ ] CORS origins updated for production domain
- [ ] Background jobs configured
- [ ] Logging configured
- [ ] Rate limiting enabled

### Production Environment Variables
```bash
# Backend (.NET)
ConnectionStrings__DefaultConnection="Production_Connection_String"
Jwt__Key="Production_JWT_Secret_Key"
EmailSettings__SendGrid__ApiKey="Production_SendGrid_Key"
AppUrl="https://yourdomain.com"

# Frontend (React)
REACT_APP_API_URL="https://api.yourdomain.com"
```

### Health Checks

Add to `Program.cs`:

```csharp
builder.Services.AddHealthChecks()
    .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));

app.MapHealthChecks("/health");
```

---

## Part 9: Troubleshooting

### Common Issues

**Issue: "Cannot connect to database"**
- Check connection string in appsettings.json
- Verify SQL Server is running
- Check firewall rules

**Issue: "CORS error in browser"**
- Verify CORS policy includes your frontend URL
- Check if `UseCors()` is called before `UseAuthorization()`

**Issue: "401 Unauthorized on API calls"**
- Verify JWT token is being sent in Authorization header
- Check token expiry
- Verify JWT configuration matches between token generation and validation

**Issue: "Emails not sending"**
- Check email provider credentials
- Verify background job is running
- Check EmailQueue table for failed emails
- Review error messages in EmailQueue.ErrorMessage

**Issue: "Permission denied errors"**
- Check user roles in database
- Verify permission assignments
- Review custom role permissions
- Check ArticlePermissions for article-level access

---

## Part 10: Next Steps

1. **User Acceptance Testing**
   - Test all features with real users
   - Gather feedback on UI/UX
   - Identify any missing functionality

2. **Performance Optimization**
   - Add database query caching
   - Implement pagination everywhere
   - Optimize slow queries
   - Add CDN for static assets

3. **Additional Features**
   - Real-time notifications with SignalR
   - Advanced analytics dashboards
   - Workflow automation
   - Mobile app development

4. **Documentation**
   - User guides
   - Admin documentation
   - API documentation (Swagger/OpenAPI)
   - Deployment guides

---

## Support

For issues and questions:
- Review the IMPLEMENTATION_SUMMARY.md
- Check COMPLETION_CHECKLIST.md
- Review error logs
- Test with Postman/curl to isolate frontend vs backend issues

---

## Success Criteria

✅ Backend API responds to all endpoints
✅ Database contains all tables and stored procedures
✅ Frontend loads without console errors
✅ User can log in and access appropriate features
✅ Activity logs are being created
✅ Email queue is processing (if background jobs configured)
✅ Templates can be created and used
✅ Permissions can be assigned and enforced
✅ Data can be exported and imported

**Your knowledge base application is now fully integrated and ready for deployment!**