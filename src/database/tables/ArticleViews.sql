CREATE TABLE ArticleViews (
    ViewId INT PRIMARY KEY IDENTITY(1,1),
    ArticleId INT NOT NULL,
    UserId INT NULL,
    ViewedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    SessionId NVARCHAR(100) NULL,
    UserAgent NVARCHAR(500) NULL,
    IpAddress NVARCHAR(50) NULL,
    CONSTRAINT FK_ArticleViews_Articles FOREIGN KEY (ArticleId) REFERENCES Articles(ArticleId),
    CONSTRAINT FK_ArticleViews_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE INDEX IX_ArticleViews_ArticleId ON ArticleViews(ArticleId);
CREATE INDEX IX_ArticleViews_UserId ON ArticleViews(UserId);
CREATE INDEX IX_ArticleViews_ViewedAt ON ArticleViews(ViewedAt DESC);
CREATE INDEX IX_ArticleViews_SessionId ON ArticleViews(SessionId);
