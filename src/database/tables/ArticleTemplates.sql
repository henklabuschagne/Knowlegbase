CREATE TABLE ArticleTemplates (
    TemplateId INT PRIMARY KEY IDENTITY(1,1),
    TemplateName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500) NULL,
    Category NVARCHAR(100) NULL,
    TitleTemplate NVARCHAR(500) NULL,
    ContentTemplate NVARCHAR(MAX) NOT NULL,
    SummaryTemplate NVARCHAR(1000) NULL,
    IsInternal BIT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    UsageCount INT NOT NULL DEFAULT 0,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_ArticleTemplates_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

CREATE INDEX IX_ArticleTemplates_Category ON ArticleTemplates(Category);
CREATE INDEX IX_ArticleTemplates_IsActive ON ArticleTemplates(IsActive);
CREATE INDEX IX_ArticleTemplates_CreatedBy ON ArticleTemplates(CreatedBy);
