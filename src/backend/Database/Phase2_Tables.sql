-- =============================================
-- Phase 2: Tags & Article Base Structure - Tables
-- =============================================

USE KnowledgeBase;
GO

-- =============================================
-- Table: TagTypes
-- =============================================
CREATE TABLE TagTypes (
    TagTypeId INT PRIMARY KEY IDENTITY(1,1),
    TagTypeName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(200),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_TagTypes_TagTypeName ON TagTypes(TagTypeName);
GO

-- =============================================
-- Table: Tags
-- =============================================
CREATE TABLE Tags (
    TagId INT PRIMARY KEY IDENTITY(1,1),
    TagTypeId INT NOT NULL,
    TagName NVARCHAR(100) NOT NULL,
    TagValue NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500),
    ColorCode NVARCHAR(7), -- Hex color code (e.g., #FF5733)
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_Tags_TagTypes FOREIGN KEY (TagTypeId) REFERENCES TagTypes(TagTypeId),
    CONSTRAINT UQ_Tags_TypeValue UNIQUE (TagTypeId, TagValue)
);

CREATE INDEX IX_Tags_TagTypeId ON Tags(TagTypeId);
CREATE INDEX IX_Tags_TagName ON Tags(TagName);
CREATE INDEX IX_Tags_IsActive ON Tags(IsActive);
GO

-- =============================================
-- Table: Articles
-- =============================================
CREATE TABLE Articles (
    ArticleId INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(500) NOT NULL,
    Summary NVARCHAR(2000),
    Content NVARCHAR(MAX), -- Markdown content
    
    -- Metadata
    CreatedBy INT NOT NULL,
    UpdatedBy INT,
    ApprovedBy INT,
    
    -- Status
    StatusId INT NOT NULL DEFAULT 1, -- 1=Draft, 2=PendingReview, 3=Approved, 4=Published, 5=Archived
    IsPublished BIT NOT NULL DEFAULT 0,
    
    -- Timestamps
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    PublishedAt DATETIME2,
    ApprovedAt DATETIME2,
    
    -- Versioning
    VersionNumber INT NOT NULL DEFAULT 1,
    ParentArticleId INT, -- For version history
    
    -- Visibility
    IsInternal BIT NOT NULL DEFAULT 0,
    
    -- Stats
    ViewCount INT NOT NULL DEFAULT 0,
    
    CONSTRAINT FK_Articles_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserId),
    CONSTRAINT FK_Articles_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES Users(UserId),
    CONSTRAINT FK_Articles_ApprovedBy FOREIGN KEY (ApprovedBy) REFERENCES Users(UserId),
    CONSTRAINT FK_Articles_ParentArticle FOREIGN KEY (ParentArticleId) REFERENCES Articles(ArticleId)
);

CREATE INDEX IX_Articles_CreatedBy ON Articles(CreatedBy);
CREATE INDEX IX_Articles_StatusId ON Articles(StatusId);
CREATE INDEX IX_Articles_IsPublished ON Articles(IsPublished);
CREATE INDEX IX_Articles_CreatedAt ON Articles(CreatedAt);
CREATE INDEX IX_Articles_Title ON Articles(Title);
CREATE INDEX IX_Articles_ParentArticleId ON Articles(ParentArticleId);
GO

-- =============================================
-- Table: ArticleTags (Junction Table)
-- =============================================
CREATE TABLE ArticleTags (
    ArticleTagId INT PRIMARY KEY IDENTITY(1,1),
    ArticleId INT NOT NULL,
    TagId INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_ArticleTags_Article FOREIGN KEY (ArticleId) REFERENCES Articles(ArticleId) ON DELETE CASCADE,
    CONSTRAINT FK_ArticleTags_Tag FOREIGN KEY (TagId) REFERENCES Tags(TagId),
    CONSTRAINT UQ_ArticleTags UNIQUE (ArticleId, TagId)
);

CREATE INDEX IX_ArticleTags_ArticleId ON ArticleTags(ArticleId);
CREATE INDEX IX_ArticleTags_TagId ON ArticleTags(TagId);
GO

-- =============================================
-- Table: ArticleSteps (For step-by-step guides)
-- =============================================
CREATE TABLE ArticleSteps (
    StepId INT PRIMARY KEY IDENTITY(1,1),
    ArticleId INT NOT NULL,
    StepNumber INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX), -- Markdown content
    VideoUrl NVARCHAR(500),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_ArticleSteps_Article FOREIGN KEY (ArticleId) REFERENCES Articles(ArticleId) ON DELETE CASCADE,
    CONSTRAINT UQ_ArticleSteps UNIQUE (ArticleId, StepNumber)
);

CREATE INDEX IX_ArticleSteps_ArticleId ON ArticleSteps(ArticleId);
GO

-- =============================================
-- Table: ArticleAttachments
-- =============================================
CREATE TABLE ArticleAttachments (
    AttachmentId INT PRIMARY KEY IDENTITY(1,1),
    ArticleId INT NOT NULL,
    FileName NVARCHAR(255) NOT NULL,
    FileUrl NVARCHAR(1000) NOT NULL,
    FileSize BIGINT, -- In bytes
    FileType NVARCHAR(100),
    UploadedBy INT NOT NULL,
    UploadedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_ArticleAttachments_Article FOREIGN KEY (ArticleId) REFERENCES Articles(ArticleId) ON DELETE CASCADE,
    CONSTRAINT FK_ArticleAttachments_UploadedBy FOREIGN KEY (UploadedBy) REFERENCES Users(UserId)
);

CREATE INDEX IX_ArticleAttachments_ArticleId ON ArticleAttachments(ArticleId);
GO

-- =============================================
-- Table: ArticleStatuses (Lookup)
-- =============================================
CREATE TABLE ArticleStatuses (
    StatusId INT PRIMARY KEY IDENTITY(1,1),
    StatusName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(200),
    IsActive BIT NOT NULL DEFAULT 1
);

CREATE INDEX IX_ArticleStatuses_StatusName ON ArticleStatuses(StatusName);
GO

PRINT 'Phase 2 Tables Created Successfully';
