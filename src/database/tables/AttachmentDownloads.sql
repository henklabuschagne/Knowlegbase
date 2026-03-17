CREATE TABLE AttachmentDownloads (
    DownloadId INT PRIMARY KEY IDENTITY(1,1),
    AttachmentId INT NOT NULL,
    UserId INT NULL, -- Nullable for anonymous downloads
    DownloadedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IpAddress NVARCHAR(45) NULL,
    UserAgent NVARCHAR(500) NULL,
    CONSTRAINT FK_AttachmentDownloads_Attachments FOREIGN KEY (AttachmentId) REFERENCES ArticleAttachments(AttachmentId),
    CONSTRAINT FK_AttachmentDownloads_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE INDEX IX_AttachmentDownloads_AttachmentId ON AttachmentDownloads(AttachmentId);
CREATE INDEX IX_AttachmentDownloads_UserId ON AttachmentDownloads(UserId);
CREATE INDEX IX_AttachmentDownloads_DownloadedAt ON AttachmentDownloads(DownloadedAt DESC);
