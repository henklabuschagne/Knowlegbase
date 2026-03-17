CREATE TABLE EmailTemplates (
    TemplateId INT PRIMARY KEY IDENTITY(1,1),
    TemplateName NVARCHAR(100) NOT NULL UNIQUE,
    Subject NVARCHAR(500) NOT NULL,
    BodyHtml NVARCHAR(MAX) NOT NULL,
    BodyText NVARCHAR(MAX) NULL,
    Description NVARCHAR(500) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_EmailTemplates_TemplateName ON EmailTemplates(TemplateName);
CREATE INDEX IX_EmailTemplates_IsActive ON EmailTemplates(IsActive);
