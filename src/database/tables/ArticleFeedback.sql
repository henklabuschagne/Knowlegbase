CREATE TABLE ArticleFeedback (
    FeedbackId INT PRIMARY KEY IDENTITY(1,1),
    ArticleId INT NOT NULL,
    UserId INT NOT NULL,
    Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    IsHelpful BIT NULL,
    FeedbackText NVARCHAR(2000) NULL,
    Category NVARCHAR(100) NULL, -- 'Accuracy', 'Clarity', 'Completeness', 'Other'
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    IsResolved BIT NOT NULL DEFAULT 0,
    ResolvedBy INT NULL,
    ResolvedAt DATETIME2 NULL,
    ResolutionNotes NVARCHAR(1000) NULL,
    CONSTRAINT FK_ArticleFeedback_Articles FOREIGN KEY (ArticleId) REFERENCES Articles(ArticleId),
    CONSTRAINT FK_ArticleFeedback_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_ArticleFeedback_ResolvedBy FOREIGN KEY (ResolvedBy) REFERENCES Users(UserId)
);

CREATE INDEX IX_ArticleFeedback_ArticleId ON ArticleFeedback(ArticleId);
CREATE INDEX IX_ArticleFeedback_UserId ON ArticleFeedback(UserId);
CREATE INDEX IX_ArticleFeedback_CreatedAt ON ArticleFeedback(CreatedAt DESC);
CREATE INDEX IX_ArticleFeedback_IsResolved ON ArticleFeedback(IsResolved);
CREATE INDEX IX_ArticleFeedback_Rating ON ArticleFeedback(Rating);
