CREATE OR ALTER PROCEDURE sp_GetLowRatedArticles
    @TopN INT = 10,
    @MinFeedbackCount INT = 3,
    @MaxRating DECIMAL(3,2) = 3.0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@TopN)
        a.ArticleId,
        a.Title,
        a.Summary,
        m.AverageRating,
        m.TotalFeedback,
        m.NotHelpfulCount,
        m.TotalViews
    FROM Articles a
    INNER JOIN ArticleMetrics m ON a.ArticleId = m.ArticleId
    WHERE m.TotalFeedback >= @MinFeedbackCount
        AND m.AverageRating <= @MaxRating
        AND a.StatusId = (SELECT StatusId FROM ArticleStatuses WHERE StatusName = 'Published')
    ORDER BY m.AverageRating ASC, m.NotHelpfulCount DESC;
END
