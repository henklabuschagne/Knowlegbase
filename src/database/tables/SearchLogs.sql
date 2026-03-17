CREATE TABLE SearchLogs (
    SearchId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NULL,
    SearchQuery NVARCHAR(500) NOT NULL,
    SearchType NVARCHAR(50) NOT NULL, -- 'Standard', 'AI', 'Advanced'
    ResultsCount INT NOT NULL DEFAULT 0,
    ClickedArticleId INT NULL,
    ClickPosition INT NULL,
    SearchedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ResponseTimeMs INT NULL,
    SessionId NVARCHAR(100) NULL,
    CONSTRAINT FK_SearchLogs_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_SearchLogs_Article FOREIGN KEY (ClickedArticleId) REFERENCES Articles(ArticleId)
);

CREATE INDEX IX_SearchLogs_UserId ON SearchLogs(UserId);
CREATE INDEX IX_SearchLogs_SearchedAt ON SearchLogs(SearchedAt DESC);
CREATE INDEX IX_SearchLogs_SearchQuery ON SearchLogs(SearchQuery);
CREATE INDEX IX_SearchLogs_SearchType ON SearchLogs(SearchType);
