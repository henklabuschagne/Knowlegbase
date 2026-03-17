CREATE OR ALTER PROCEDURE sp_GetTopRatedArticles
    @TopN INT = 10,
    @MinFeedbackCount INT = 3
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@TopN)
        a.ArticleId,
        a.Title,
        a.Summary,
        m.AverageRating,
        m.TotalFeedback,
        m.HelpfulCount,
        m.TotalViews
    FROM Articles a
    INNER JOIN ArticleMetrics m ON a.ArticleId = m.ArticleId
    WHERE m.TotalFeedback >= @MinFeedbackCount
        AND a.StatusId = (SELECT StatusId FROM ArticleStatuses WHERE StatusName = 'Published')
    ORDER BY m.AverageRating DESC, m.TotalFeedback DESC;
END
