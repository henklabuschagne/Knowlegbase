CREATE OR ALTER PROCEDURE sp_GetArticleMetrics
    @ArticleId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        m.MetricId,
        m.ArticleId,
        m.TotalViews,
        m.UniqueViews,
        m.TotalFeedback,
        m.AverageRating,
        m.HelpfulCount,
        m.NotHelpfulCount,
        m.LastViewedAt,
        m.LastFeedbackAt,
        m.UpdatedAt
    FROM ArticleMetrics m
    WHERE m.ArticleId = @ArticleId;
    
    -- If no metrics exist, return default values
    IF @@ROWCOUNT = 0
    BEGIN
        SELECT 
            NULL AS MetricId,
            @ArticleId AS ArticleId,
            0 AS TotalViews,
            0 AS UniqueViews,
            0 AS TotalFeedback,
            NULL AS AverageRating,
            0 AS HelpfulCount,
            0 AS NotHelpfulCount,
            NULL AS LastViewedAt,
            NULL AS LastFeedbackAt,
            NULL AS UpdatedAt;
    END
END
