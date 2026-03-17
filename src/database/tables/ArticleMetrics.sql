CREATE TABLE ArticleMetrics (
    MetricId INT PRIMARY KEY IDENTITY(1,1),
    ArticleId INT NOT NULL UNIQUE,
    TotalViews INT NOT NULL DEFAULT 0,
    UniqueViews INT NOT NULL DEFAULT 0,
    TotalFeedback INT NOT NULL DEFAULT 0,
    AverageRating DECIMAL(3,2) NULL,
    HelpfulCount INT NOT NULL DEFAULT 0,
    NotHelpfulCount INT NOT NULL DEFAULT 0,
    LastViewedAt DATETIME2 NULL,
    LastFeedbackAt DATETIME2 NULL,
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_ArticleMetrics_Articles FOREIGN KEY (ArticleId) REFERENCES Articles(ArticleId)
);

CREATE INDEX IX_ArticleMetrics_AverageRating ON ArticleMetrics(AverageRating DESC);
CREATE INDEX IX_ArticleMetrics_TotalViews ON ArticleMetrics(TotalViews DESC);
CREATE INDEX IX_ArticleMetrics_LastViewedAt ON ArticleMetrics(LastViewedAt DESC);
