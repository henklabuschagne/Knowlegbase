-- =============================================
-- Phase 2: Tags & Article Base - Seed Data
-- =============================================

USE KnowledgeBase;
GO

-- =============================================
-- Seed: ArticleStatuses
-- =============================================
SET IDENTITY_INSERT ArticleStatuses ON;

INSERT INTO ArticleStatuses (StatusId, StatusName, Description, IsActive)
VALUES 
    (1, 'Draft', 'Article is in draft state', 1),
    (2, 'Pending Review', 'Article is pending support review', 1),
    (3, 'Approved', 'Article is approved by admin', 1),
    (4, 'Published', 'Article is published and visible', 1),
    (5, 'Archived', 'Article is archived', 1);

SET IDENTITY_INSERT ArticleStatuses OFF;
GO

-- =============================================
-- Seed: TagTypes
-- =============================================
SET IDENTITY_INSERT TagTypes ON;

INSERT INTO TagTypes (TagTypeId, TagTypeName, Description, IsActive)
VALUES 
    (1, 'Visibility', 'Controls who can see the article (Internal/External)', 1),
    (2, 'Version', 'Product version information', 1),
    (3, 'Team', 'Internal team that owns the article', 1),
    (4, 'Client', 'Client organization for external articles', 1),
    (5, 'Module', 'Product module or feature area', 1),
    (6, 'Category', 'Article category or topic', 1);

SET IDENTITY_INSERT TagTypes OFF;
GO

-- =============================================
-- Seed: Tags - Visibility
-- =============================================
DECLARE @VisibilityTypeId INT = 1;

INSERT INTO Tags (TagTypeId, TagName, TagValue, Description, ColorCode, IsActive)
VALUES 
    (@VisibilityTypeId, 'Internal', 'internal', 'Internal company use only', '#6366F1', 1),
    (@VisibilityTypeId, 'External', 'external', 'Visible to clients', '#10B981', 1);
GO

-- =============================================
-- Seed: Tags - Version
-- =============================================
DECLARE @VersionTypeId INT = 2;

INSERT INTO Tags (TagTypeId, TagName, TagValue, Description, ColorCode, IsActive)
VALUES 
    (@VersionTypeId, 'v1.0', '1.0', 'Version 1.0', '#3B82F6', 1),
    (@VersionTypeId, 'v2.0', '2.0', 'Version 2.0', '#3B82F6', 1),
    (@VersionTypeId, 'v2.1', '2.1', 'Version 2.1', '#3B82F6', 1),
    (@VersionTypeId, 'v3.0', '3.0', 'Version 3.0 (Latest)', '#3B82F6', 1);
GO

-- =============================================
-- Seed: Tags - Team
-- =============================================
DECLARE @TeamTypeId INT = 3;

INSERT INTO Tags (TagTypeId, TagName, TagValue, Description, ColorCode, IsActive)
SELECT 
    @TeamTypeId,
    TeamName,
    LOWER(REPLACE(TeamName, ' ', '-')),
    'Team: ' + TeamName,
    CASE 
        WHEN TeamId = 1 THEN '#8B5CF6'
        WHEN TeamId = 2 THEN '#EC4899'
        WHEN TeamId = 3 THEN '#F59E0B'
        WHEN TeamId = 4 THEN '#14B8A6'
        ELSE '#6B7280'
    END,
    IsActive
FROM Teams
WHERE IsActive = 1;
GO

-- =============================================
-- Seed: Tags - Client
-- =============================================
DECLARE @ClientTypeId INT = 4;

INSERT INTO Tags (TagTypeId, TagName, TagValue, Description, ColorCode, IsActive)
SELECT 
    @ClientTypeId,
    ClientName,
    LOWER(REPLACE(ClientName, ' ', '-')),
    'Client: ' + ClientName,
    CASE 
        WHEN ClientId = 1 THEN '#EF4444'
        WHEN ClientId = 2 THEN '#10B981'
        WHEN ClientId = 3 THEN '#F59E0B'
        ELSE '#6B7280'
    END,
    IsActive
FROM Clients
WHERE IsActive = 1;
GO

-- =============================================
-- Seed: Tags - Module
-- =============================================
DECLARE @ModuleTypeId INT = 5;

INSERT INTO Tags (TagTypeId, TagName, TagValue, Description, ColorCode, IsActive)
VALUES 
    (@ModuleTypeId, 'Authentication', 'authentication', 'User authentication and security', '#DC2626', 1),
    (@ModuleTypeId, 'Dashboard', 'dashboard', 'Dashboard and reporting', '#2563EB', 1),
    (@ModuleTypeId, 'API', 'api', 'API integration and endpoints', '#7C3AED', 1),
    (@ModuleTypeId, 'Database', 'database', 'Database and data management', '#059669', 1),
    (@ModuleTypeId, 'UI/UX', 'ui-ux', 'User interface and experience', '#DB2777', 1),
    (@ModuleTypeId, 'Settings', 'settings', 'System settings and configuration', '#6B7280', 1),
    (@ModuleTypeId, 'Reports', 'reports', 'Reporting and analytics', '#EA580C', 1),
    (@ModuleTypeId, 'Integrations', 'integrations', 'Third-party integrations', '#0891B2', 1);
GO

-- =============================================
-- Seed: Tags - Category
-- =============================================
DECLARE @CategoryTypeId INT = 6;

INSERT INTO Tags (TagTypeId, TagName, TagValue, Description, ColorCode, IsActive)
VALUES 
    (@CategoryTypeId, 'Getting Started', 'getting-started', 'Introduction and setup guides', '#10B981', 1),
    (@CategoryTypeId, 'How-To', 'how-to', 'Step-by-step instructions', '#3B82F6', 1),
    (@CategoryTypeId, 'Troubleshooting', 'troubleshooting', 'Problem solving and fixes', '#EF4444', 1),
    (@CategoryTypeId, 'Best Practices', 'best-practices', 'Recommended approaches', '#8B5CF6', 1),
    (@CategoryTypeId, 'FAQ', 'faq', 'Frequently asked questions', '#F59E0B', 1),
    (@CategoryTypeId, 'Reference', 'reference', 'Technical reference documentation', '#6B7280', 1),
    (@CategoryTypeId, 'Tutorial', 'tutorial', 'Learning tutorials', '#EC4899', 1);
GO

-- =============================================
-- Seed: Sample Articles
-- =============================================
DECLARE @AdminUserId INT = (SELECT UserId FROM Users WHERE Email = 'admin@knowledgebase.com');

-- Article 1: Getting Started Guide (Published)
INSERT INTO Articles (Title, Summary, Content, CreatedBy, StatusId, IsPublished, PublishedAt, VersionNumber, IsInternal)
VALUES (
    'Getting Started with Knowledge Base System',
    'Learn how to navigate and use the Knowledge Base system effectively.',
    '# Getting Started with Knowledge Base System

## Introduction
Welcome to the Knowledge Base system! This guide will help you get started with using the platform.

## Key Features
- **Search**: Quickly find articles using the search bar
- **Filters**: Use tags to filter articles by category, version, team, etc.
- **AI Assistant**: Chat with our AI to get instant answers
- **Favorites**: Save frequently accessed articles

## Navigation
Use the sidebar to browse different sections and categories.

## Getting Help
If you need assistance, use the AI chat or submit an article request.',
    @AdminUserId,
    4, -- Published
    1,
    GETUTCDATE(),
    1,
    0 -- External
);

DECLARE @Article1Id INT = SCOPE_IDENTITY();

-- Article 2: How to Search (Published)
INSERT INTO Articles (Title, Summary, Content, CreatedBy, StatusId, IsPublished, PublishedAt, VersionNumber, IsInternal)
VALUES (
    'How to Search for Articles',
    'A guide on using the search functionality to find what you need.',
    '# How to Search for Articles

## Search Bar
Type keywords into the search bar at the top of the page.

## Advanced Filters
Use the filter panel to narrow results by:
- Version
- Category
- Team
- Client

## Search Tips
- Use specific keywords
- Combine multiple tags
- Use quotes for exact phrases

## AI Search
Try asking the AI assistant for natural language search.',
    @AdminUserId,
    4, -- Published
    1,
    GETUTCDATE(),
    1,
    0 -- External
);

DECLARE @Article2Id INT = SCOPE_IDENTITY();

-- Article 3: Admin Guide (Draft, Internal)
INSERT INTO Articles (Title, Summary, Content, CreatedBy, StatusId, IsPublished, VersionNumber, IsInternal)
VALUES (
    'Admin Guide: Managing Articles',
    'Internal guide for administrators on article management.',
    '# Admin Guide: Managing Articles

## Creating Articles
1. Click "New Article" button
2. Fill in title and content
3. Add appropriate tags
4. Save as draft or submit for review

## Approval Workflow
1. Support reviews article requests
2. Admin approves final content
3. Article is published

## Version Control
Each edit creates a new version. Previous versions are preserved.

## Best Practices
- Use clear titles
- Add comprehensive tags
- Include screenshots when helpful
- Keep content updated',
    @AdminUserId,
    1, -- Draft
    0,
    1,
    1 -- Internal
);

DECLARE @Article3Id INT = SCOPE_IDENTITY();
GO

-- =============================================
-- Seed: Article Tags
-- =============================================

-- Get tag IDs
DECLARE @ExternalTagId INT = (SELECT TagId FROM Tags WHERE TagValue = 'external' AND TagTypeId = 1);
DECLARE @InternalTagId INT = (SELECT TagId FROM Tags WHERE TagValue = 'internal' AND TagTypeId = 1);
DECLARE @Version30TagId INT = (SELECT TagId FROM Tags WHERE TagValue = '3.0' AND TagTypeId = 2);
DECLARE @GettingStartedTagId INT = (SELECT TagId FROM Tags WHERE TagValue = 'getting-started' AND TagTypeId = 6);
DECLARE @HowToTagId INT = (SELECT TagId FROM Tags WHERE TagValue = 'how-to' AND TagTypeId = 6);
DECLARE @UIUXTagId INT = (SELECT TagId FROM Tags WHERE TagValue = 'ui-ux' AND TagTypeId = 5);

-- Get article IDs
DECLARE @Article1Id INT = (SELECT ArticleId FROM Articles WHERE Title LIKE 'Getting Started%');
DECLARE @Article2Id INT = (SELECT ArticleId FROM Articles WHERE Title LIKE 'How to Search%');
DECLARE @Article3Id INT = (SELECT ArticleId FROM Articles WHERE Title LIKE 'Admin Guide%');

-- Article 1 Tags
INSERT INTO ArticleTags (ArticleId, TagId)
VALUES 
    (@Article1Id, @ExternalTagId),
    (@Article1Id, @Version30TagId),
    (@Article1Id, @GettingStartedTagId);

-- Article 2 Tags
INSERT INTO ArticleTags (ArticleId, TagId)
VALUES 
    (@Article2Id, @ExternalTagId),
    (@Article2Id, @Version30TagId),
    (@Article2Id, @HowToTagId),
    (@Article2Id, @UIUXTagId);

-- Article 3 Tags
INSERT INTO ArticleTags (ArticleId, TagId)
VALUES 
    (@Article3Id, @InternalTagId),
    (@Article3Id, @Version30TagId),
    (@Article3Id, @HowToTagId);
GO

PRINT 'Phase 2 Seed Data Inserted Successfully';
PRINT 'Tag Types: 6';
PRINT 'Tags: ~30';
PRINT 'Article Statuses: 5';
PRINT 'Sample Articles: 3';
