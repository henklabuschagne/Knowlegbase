CREATE TABLE SavedSearches (
    SavedSearchId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    SearchName NVARCHAR(200) NOT NULL,
    SearchQuery NVARCHAR(500) NULL,
    FilterCriteria NVARCHAR(MAX) NOT NULL, -- JSON with filter settings
    IsPublic BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    LastUsedAt DATETIME2 NULL,
    UseCount INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_SavedSearches_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE INDEX IX_SavedSearches_UserId ON SavedSearches(UserId);
CREATE INDEX IX_SavedSearches_IsPublic ON SavedSearches(IsPublic);
CREATE INDEX IX_SavedSearches_LastUsedAt ON SavedSearches(LastUsedAt DESC);
