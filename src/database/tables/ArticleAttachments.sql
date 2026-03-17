CREATE TABLE ArticleAttachments (
    AttachmentId INT PRIMARY KEY IDENTITY(1,1),
    ArticleId INT NOT NULL,
    FileName NVARCHAR(255) NOT NULL,
    OriginalFileName NVARCHAR(255) NOT NULL,
    FileSize BIGINT NOT NULL, -- Size in bytes
    FileType NVARCHAR(100) NOT NULL, -- MIME type
    FilePath NVARCHAR(500) NOT NULL,
    FileExtension NVARCHAR(10) NOT NULL,
    UploadedBy INT NOT NULL,
    UploadedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Description NVARCHAR(500) NULL,
    IsImage BIT NOT NULL DEFAULT 0,
    ThumbnailPath NVARCHAR(500) NULL,
    DownloadCount INT NOT NULL DEFAULT 0,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedAt DATETIME2 NULL,
    DeletedBy INT NULL,
    CONSTRAINT FK_ArticleAttachments_Articles FOREIGN KEY (ArticleId) REFERENCES Articles(ArticleId),
    CONSTRAINT FK_ArticleAttachments_UploadedBy FOREIGN KEY (UploadedBy) REFERENCES Users(UserId),
    CONSTRAINT FK_ArticleAttachments_DeletedBy FOREIGN KEY (DeletedBy) REFERENCES Users(UserId)
);

CREATE INDEX IX_ArticleAttachments_ArticleId ON ArticleAttachments(ArticleId);
CREATE INDEX IX_ArticleAttachments_UploadedBy ON ArticleAttachments(UploadedBy);
CREATE INDEX IX_ArticleAttachments_IsDeleted ON ArticleAttachments(IsDeleted);
CREATE INDEX IX_ArticleAttachments_FileType ON ArticleAttachments(FileType);
