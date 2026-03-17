CREATE TABLE SearchHistory (
    HistoryId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    SearchQuery NVARCHAR(500) NOT NULL,
    FilterCriteria NVARCHAR(MAX) NULL, -- JSON with filter settings
    ResultsCount INT NOT NULL,
    SearchedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_SearchHistory_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE INDEX IX_SearchHistory_UserId ON SearchHistory(UserId);
CREATE INDEX IX_SearchHistory_SearchedAt ON SearchHistory(SearchedAt DESC);
CREATE INDEX IX_SearchHistory_SearchQuery ON SearchHistory(SearchQuery);
