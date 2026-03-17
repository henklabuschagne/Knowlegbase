# Knowledge Base Application - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              React Frontend (Port 3000)                   │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │   │
│  │  │   Admin    │  │  Template  │  │    Permission      │ │   │
│  │  │ Dashboard  │  │  Manager   │  │     Manager        │ │   │
│  │  └────────────┘  └────────────┘  └────────────────────┘ │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │   │
│  │  │  Activity  │  │   Export   │  │    User            │ │   │
│  │  │Log Viewer  │  │   Import   │  │  Interface         │ │   │
│  │  └────────────┘  └────────────┘  └────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS/REST API
                            │ JWT Authentication
┌───────────────────────────▼─────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          .NET Core 6+ Backend (Port 5000)                │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │              API CONTROLLERS                         │ │   │
│  │  │ ActivityLog │ Email │ Export │ Template │ Permission│ │   │
│  │  └───────────────────────┬─────────────────────────────┘ │   │
│  │  ┌───────────────────────▼─────────────────────────────┐ │   │
│  │  │              BUSINESS SERVICES                       │ │   │
│  │  │  EmailService  │  ExportImportService  │  etc.      │ │   │
│  │  └───────────────────────┬─────────────────────────────┘ │   │
│  │  ┌───────────────────────▼─────────────────────────────┐ │   │
│  │  │              REPOSITORIES (Data Access)              │ │   │
│  │  │ Activity │ Email │ Template │ Permission │ Article  │ │   │
│  │  └───────────────────────┬─────────────────────────────┘ │   │
│  └────────────────────────┬─┴──────────────────────────────┘   │
└───────────────────────────┼────────────────────────────────────┘
                            │ Dapper ORM
                            │ Stored Procedures
┌───────────────────────────▼─────────────────────────────────────┐
│                        DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              SQL Server Database                          │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │   │
│  │  │   Core     │  │  Activity  │  │      Email         │ │   │
│  │  │  Tables    │  │   Logs     │  │      Queue         │ │   │
│  │  └────────────┘  └────────────┘  └────────────────────┘ │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │   │
│  │  │ Templates  │  │   Teams    │  │    Permissions     │ │   │
│  │  │            │  │            │  │                    │ │   │
│  │  └────────────┘  └────────────┘  └────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Architecture

```
src/
├── components/                    # React Components
│   ├── AdminDashboard.tsx         # Main admin interface
│   ├── ActivityLogViewer.tsx      # Activity monitoring
│   ├── TemplateManager.tsx        # Template CRUD
│   ├── PermissionManager.tsx      # Permission management
│   ├── ExportImport.tsx           # Data import/export
│   └── ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── table.tsx
│       └── ...
│
├── services/                      # API Services
│   ├── activityLog.service.ts     # Activity log API calls
│   ├── permission.service.ts      # Permission API calls
│   └── api.ts                     # Axios configuration
│
├── hooks/                         # Custom React Hooks
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   └── useActivityLog.ts
│
├── utils/                         # Utility Functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
│
└── styles/                        # Styling
    └── globals.css                # Tailwind + custom styles
```

### Backend Architecture

```
backend/
├── Controllers/                   # API Endpoints
│   ├── ActivityLogController.cs   # Activity log endpoints
│   ├── EmailController.cs         # Email endpoints
│   ├── ExportImportController.cs  # Export/import endpoints
│   ├── TemplateController.cs      # Template endpoints
│   └── PermissionController.cs    # Permission endpoints
│
├── Services/                      # Business Logic
│   ├── EmailService.cs            # Email processing & templates
│   ├── ExportImportService.cs     # Data export/import logic
│   └── PermissionService.cs       # Permission checking
│
├── Repositories/                  # Data Access
│   ├── ActivityLogRepository.cs   # Activity log data access
│   ├── EmailRepository.cs         # Email data access
│   ├── TemplateRepository.cs      # Template data access
│   ├── PermissionRepository.cs    # Permission data access
│   ├── ArticleRepository.cs       # Article data access
│   └── UserRepository.cs          # User data access
│
├── DTOs/                          # Data Transfer Objects
│   ├── ActivityLogDto.cs
│   ├── EmailDto.cs
│   ├── ExportDto.cs
│   ├── TemplateDto.cs
│   └── PermissionDto.cs
│
├── Middleware/                    # Custom Middleware
│   ├── ErrorHandlingMiddleware.cs
│   └── LoggingMiddleware.cs
│
└── Program.cs                     # Application entry point
```

---

## Data Flow Diagrams

### Activity Logging Flow

```
┌────────────┐
│   User     │
│  Action    │
└─────┬──────┘
      │
      ▼
┌────────────────┐
│   Controller   │  Performs action (Create/Update/Delete)
└─────┬──────────┘
      │
      ├─────────────────┐
      │                 │
      ▼                 ▼
┌────────────┐    ┌──────────────┐
│  Execute   │    │ Log Activity │
│  Action    │    │              │
└────────────┘    └───────┬──────┘
                          │
                          ▼
                  ┌──────────────────┐
                  │ ActivityLog      │
                  │ Repository       │
                  └───────┬──────────┘
                          │
                          ▼
                  ┌──────────────────┐
                  │ sp_LogActivity   │
                  │ Stored Procedure │
                  └───────┬──────────┘
                          │
                          ▼
                  ┌──────────────────┐
                  │  ActivityLogs    │
                  │  AuditTrail      │
                  │  Tables          │
                  └──────────────────┘
```

### Email Notification Flow

```
┌────────────┐
│   Event    │  (Article Approved, Published, etc.)
│  Trigger   │
└─────┬──────┘
      │
      ▼
┌────────────────┐
│ EmailService   │  Render template with variables
│ QueueEmail()   │
└─────┬──────────┘
      │
      ▼
┌────────────────┐
│ Email          │  Insert into EmailQueue
│ Repository     │
└─────┬──────────┘
      │
      ▼
┌────────────────┐
│  EmailQueue    │  Status: Pending
│  Table         │
└─────┬──────────┘
      │
      │ (Background Job - Every minute)
      │
      ▼
┌────────────────┐
│  Email         │  Get pending emails
│  Service       │  Send via provider
│ProcessPending()│
└─────┬──────────┘
      │
      ├──────────┬──────────┐
      │          │          │
      ▼          ▼          ▼
┌──────────┐ ┌──────┐ ┌──────────┐
│SendGrid  │ │ SMTP │ │ AWS SES  │
└──────────┘ └──────┘ └──────────┘
      │          │          │
      └──────────┴──────────┘
             │
             ▼
      ┌──────────────┐
      │Update Status │  Status: Sent/Failed
      │ in Queue     │
      └──────────────┘
```

### Template Usage Flow

```
┌────────────┐
│    User    │  Selects template
│            │
└─────┬──────┘
      │
      ▼
┌────────────────┐
│TemplateManager │  Load template with fields
│   Component    │
└─────┬──────────┘
      │
      ▼
┌────────────────┐
│User fills form │  Enter values for dynamic fields
│with field data │
└─────┬──────────┘
      │
      ▼
┌────────────────┐
│POST to backend │  /api/template/use/{id}
│with field vals │
└─────┬──────────┘
      │
      ▼
┌────────────────┐
│Template        │  1. Get template
│Controller      │  2. Get template fields
└─────┬──────────┘  3. Substitute variables
      │
      ▼
┌────────────────┐
│Variable        │  Replace {{fieldName}} with values
│Substitution    │  in title, content, summary
└─────┬──────────┘
      │
      ▼
┌────────────────┐
│Create Article  │  Insert new article with
│                │  substituted content
└─────┬──────────┘
      │
      ▼
┌────────────────┐
│Increment Usage │  Update template usage count
│    Count       │
└────────────────┘
```

### Permission Check Flow

```
┌────────────┐
│    User    │  Attempts action
│   Action   │
└─────┬──────┘
      │
      ▼
┌────────────────┐
│  [Authorize]   │  Check JWT token & role
│  Attribute     │
└─────┬──────────┘
      │
      ├─────────────┬──────────────┐
      │             │              │
      ▼             ▼              ▼
┌──────────┐  ┌──────────┐  ┌────────────┐
│Built-in  │  │ Custom   │  │  Article   │
│  Role    │  │  Role    │  │Permission  │
│ (Admin)  │  │          │  │            │
└────┬─────┘  └────┬─────┘  └─────┬──────┘
     │             │               │
     └─────────────┴───────────────┘
                   │
                   ▼
           ┌──────────────────┐
           │ Permission       │  Check all permission sources
           │ Repository       │
           │ CheckPermission()│
           └───────┬──────────┘
                   │
                   ▼
           ┌──────────────────┐
           │sp_CheckUser      │  Stored procedure
           │Permission        │
           └───────┬──────────┘
                   │
                   ▼
           ┌──────────────────┐
           │  Allow/Deny      │  Return boolean
           │                  │
           └──────────────────┘
```

### Export/Import Flow

```
EXPORT FLOW:
┌────────────┐
│    User    │  Clicks "Export"
└─────┬──────┘
      │
      ▼
┌────────────────┐
│Export Component│  Select format & entity type
└─────┬──────────┘
      │
      ▼
┌────────────────┐
│POST /export    │  Send export request
└─────┬──────────┘
      │
      ▼
┌────────────────┐
│Export Service  │  Fetch data from repositories
└─────┬──────────┘
      │
      ├──────────┬──────────┐
      │          │          │
      ▼          ▼          ▼
┌──────────┐ ┌──────┐ ┌──────────┐
│Articles  │ │Users │ │  Tags    │
│Repository│ │Repo  │ │Repository│
└────┬─────┘ └──┬───┘ └─────┬────┘
     │          │            │
     └──────────┴────────────┘
                │
                ▼
        ┌──────────────┐
        │ Format Data  │  Convert to JSON/CSV
        └───────┬──────┘
                │
                ▼
        ┌──────────────┐
        │  Return File │  Download to user
        └──────────────┘

IMPORT FLOW:
┌────────────┐
│    User    │  Pastes import data
└─────┬──────┘
      │
      ▼
┌────────────────┐
│Import Component│  Select format & entity type
└─────┬──────────┘
      │
      ▼
┌────────────────┐
│POST /import    │  Send import request
└─────┬──────────┘
      │
      ▼
┌────────────────┐
│Import Service  │  Parse & validate data
└─────┬──────────┘
      │
      ▼
┌────────────────┐
│For each record │  Process individually
└─────┬──────────┘
      │
      ├──────────────┬─────────────┐
      │              │             │
      ▼              ▼             ▼
┌──────────┐   ┌─────────┐   ┌─────────┐
│ Success  │   │  Error  │   │ Warning │
└────┬─────┘   └────┬────┘   └────┬────┘
     │              │             │
     └──────────────┴─────────────┘
                    │
                    ▼
            ┌──────────────┐
            │Return Results│  Show success/error counts
            │with details  │
            └──────────────┘
```

---

## Database Schema Overview

### Core Entities

```
Users ──┬─── Articles ──┬─── ArticleVersions
        │                │
        │                ├─── ArticleTags ──── Tags
        │                │
        │                ├─── Feedback ──── Comments
        │                │
        │                └─── ArticleRequests
        │
        ├─── ActivityLogs
        │
        ├─── EmailPreferences
        │
        ├─── TeamMembers ──── Teams
        │
        └─── UserCustomRoles ──── CustomRoles ──── RolePermissions
```

### Table Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                       CORE TABLES                            │
├─────────────────────────────────────────────────────────────┤
│  Users (1) ────────> (N) Articles                           │
│  Articles (1) ─────> (N) ArticleVersions                    │
│  Articles (N) ─<───>─ (N) Tags  via ArticleTags            │
│  Articles (1) ─────> (N) Feedback                           │
│  Feedback (1) ─────> (N) Comments                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   ACTIVITY & AUDIT                           │
├─────────────────────────────────────────────────────────────┤
│  Users (1) ────────> (N) ActivityLogs                       │
│  ActivityLogs (1) ─> (N) AuditTrail                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      EMAIL SYSTEM                            │
├─────────────────────────────────────────────────────────────┤
│  Users (1) ────────> (N) EmailQueue                         │
│  Users (1) ────────> (N) EmailPreferences                   │
│  EmailTemplates (1) > (N) EmailQueue                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   TEMPLATE SYSTEM                            │
├─────────────────────────────────────────────────────────────┤
│  Users (1) ────────> (N) ArticleTemplates                   │
│  ArticleTemplates (1) ──> (N) TemplateFields                │
│  ArticleTemplates (N) <─> (N) Tags  via TemplateTags       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 PERMISSION SYSTEM                            │
├─────────────────────────────────────────────────────────────┤
│  Users (1) ────────> (N) TeamMembers ────> (1) Teams        │
│  Users (N) ─<───>─ (N) CustomRoles  via UserCustomRoles    │
│  CustomRoles (1) ──> (N) RolePermissions                    │
│  Articles (1) ─────> (N) ArticlePermissions                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Authentication                                     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  JWT Token Validation                              │     │
│  │  - Signature verification                          │     │
│  │  - Expiry checking                                 │     │
│  │  - Claims extraction                               │     │
│  └────────────────────────────────────────────────────┘     │
│                            │                                 │
│  Layer 2: Authorization                                      │
│  ┌────────────────────────▼──────────────────────────┐     │
│  │  Role-Based Access Control (RBAC)                 │     │
│  │  - Admin, Support, User roles                     │     │
│  │  - [Authorize] attributes                         │     │
│  └────────────────────────────────────────────────────┘     │
│                            │                                 │
│  Layer 3: Custom Permissions                                 │
│  ┌────────────────────────▼──────────────────────────┐     │
│  │  Permission-Based Access Control                  │     │
│  │  - Resource + Action + Scope                      │     │
│  │  - Custom roles                                   │     │
│  │  - Team-based permissions                         │     │
│  └────────────────────────────────────────────────────┘     │
│                            │                                 │
│  Layer 4: Article-Level Security                             │
│  ┌────────────────────────▼──────────────────────────┐     │
│  │  Fine-Grained Access Control                      │     │
│  │  - Article permissions                            │     │
│  │  - User-specific access                           │     │
│  │  - Team-specific access                           │     │
│  │  - Role-specific access                           │     │
│  └────────────────────────────────────────────────────┘     │
│                            │                                 │
│  Layer 5: Audit & Monitoring                                 │
│  ┌────────────────────────▼──────────────────────────┐     │
│  │  Activity Logging & Audit Trail                   │     │
│  │  - All actions logged                             │     │
│  │  - Field-level change tracking                    │     │
│  │  - IP address tracking                            │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Development Environment

```
┌──────────────────────────────────────────────────────────┐
│              Development Machine                          │
│  ┌────────────────┐     ┌────────────────────────────┐   │
│  │  React Dev     │     │  .NET Development Server   │   │
│  │  Server        │────>│  (Kestrel)                 │   │
│  │  Port 3000     │     │  Port 5000                 │   │
│  └────────────────┘     └─────────┬──────────────────┘   │
│                                   │                       │
│                          ┌────────▼────────┐              │
│                          │  SQL Server     │              │
│                          │  LocalDB/Docker │              │
│                          └─────────────────┘              │
└──────────────────────────────────────────────────────────┘
```

### Production Environment (Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer                           │
│                     (Azure LB / AWS ELB)                     │
└────────────────┬────────────────────────┬───────────────────┘
                 │                        │
      ┌──────────▼─────────┐   ┌──────────▼─────────┐
      │   Web Server 1     │   │   Web Server 2     │
      │  ┌──────────────┐  │   │  ┌──────────────┐  │
      │  │   React      │  │   │  │   React      │  │
      │  │   Static     │  │   │  │   Static     │  │
      │  │   Files      │  │   │  │   Files      │  │
      │  └──────────────┘  │   │  └──────────────┘  │
      └────────────────────┘   └────────────────────┘
                 │                        │
      ┌──────────▼────────────────────────▼───────────┐
      │          API Gateway / Reverse Proxy          │
      │              (nginx / IIS / Azure)            │
      └────────────┬────────────────────┬─────────────┘
                   │                    │
        ┌──────────▼─────────┐   ┌─────▼──────────┐
        │   API Server 1     │   │  API Server 2  │
        │  ┌──────────────┐  │   │ ┌───────────┐  │
        │  │  .NET Core   │  │   │ │ .NET Core │  │
        │  │  Web API     │  │   │ │  Web API  │  │
        │  └──────────────┘  │   │ └───────────┘  │
        └────────────────────┘   └────────────────┘
                   │                    │
                   └──────────┬─────────┘
                              │
                   ┌──────────▼──────────┐
                   │   SQL Server        │
                   │   (Always On AG)    │
                   │  ┌──────┐ ┌──────┐  │
                   │  │Primary││Replica│ │
                   │  └──────┘ └──────┘  │
                   └─────────────────────┘
                              │
                   ┌──────────▼──────────┐
                   │  Background Jobs    │
                   │  (Hangfire Server)  │
                   │  - Email Processing │
                   │  - Cleanup Tasks    │
                   └─────────────────────┘
```

---

## Technology Stack Summary

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: React Hooks (useState, useEffect)
- **Charts**: Recharts

### Backend
- **Framework**: .NET Core 6+
- **ORM**: Dapper (micro-ORM)
- **Authentication**: JWT Bearer Tokens
- **Database**: SQL Server 2019+
- **Logging**: ILogger / Serilog
- **API Documentation**: Swagger/OpenAPI

### Database
- **RDBMS**: Microsoft SQL Server 2019+
- **Migration**: SQL Scripts
- **Stored Procedures**: T-SQL
- **Indexing**: Optimized indexes on all foreign keys

### DevOps
- **Version Control**: Git
- **CI/CD**: Azure DevOps / GitHub Actions
- **Containerization**: Docker (optional)
- **Hosting**: Azure App Service / AWS / IIS

---

## Performance Considerations

### Database Optimization
- ✅ Indexed foreign keys
- ✅ Pagination on all list queries
- ✅ Stored procedures for complex queries
- ✅ Connection pooling
- ✅ Async/await patterns

### API Optimization
- ✅ Efficient Dapper queries
- ✅ Response caching (where appropriate)
- ✅ Compression enabled
- ✅ Rate limiting

### Frontend Optimization
- ✅ Component lazy loading
- ✅ Debounced search inputs
- ✅ Optimized re-renders
- ✅ Code splitting

---

## Scalability Considerations

### Horizontal Scaling
- Multiple API servers behind load balancer
- Stateless API design (JWT authentication)
- Distributed caching (Redis)
- Background job workers

### Vertical Scaling
- Database server resources
- API server resources
- Optimized queries and indexes

---

This architecture supports:
- ✅ High availability
- ✅ Horizontal scalability
- ✅ Security best practices
- ✅ Monitoring and logging
- ✅ Easy deployment
- ✅ Maintainability

**Architecture is production-ready and enterprise-grade! 🏗️**
