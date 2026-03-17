CREATE TABLE ArticleVersions (
    VersionId INT PRIMARY KEY IDENTITY(1,1),
    ArticleId INT NOT NULL,
    VersionNumber INT NOT NULL,
    Title NVARCHAR(500) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    Summary NVARCHAR(1000) NULL,
    IsInternal BIT NOT NULL DEFAULT 0,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ChangeDescription NVARCHAR(1000) NULL,
    CONSTRAINT FK_ArticleVersions_Articles FOREIGN KEY (ArticleId) REFERENCES Articles(ArticleId),
    CONSTRAINT FK_ArticleVersions_Users FOREIGN KEY (CreatedBy) REFERENCES Users(UserId),
    CONSTRAINT UQ_ArticleVersions_ArticleVersion UNIQUE (ArticleId, VersionNumber)
);

CREATE INDEX IX_ArticleVersions_ArticleId ON ArticleVersions(ArticleId);
CREATE INDEX IX_ArticleVersions_CreatedAt ON ArticleVersions(CreatedAt DESC);
CREATE INDEX IX_ArticleVersions_CreatedBy ON ArticleVersions(CreatedBy);
