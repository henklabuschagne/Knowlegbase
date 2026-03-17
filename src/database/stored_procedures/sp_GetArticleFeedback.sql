CREATE OR ALTER PROCEDURE sp_GetArticleFeedback
    @ArticleId INT,
    @IncludeResolved BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        f.FeedbackId,
        f.ArticleId,
        f.UserId,
        u.FirstName + ' ' + u.LastName AS UserName,
        f.Rating,
        f.IsHelpful,
        f.FeedbackText,
        f.Category,
        f.CreatedAt,
        f.UpdatedAt,
        f.IsResolved,
        f.ResolvedBy,
        CASE WHEN f.ResolvedBy IS NOT NULL THEN ru.FirstName + ' ' + ru.LastName ELSE NULL END AS ResolvedByName,
        f.ResolvedAt,
        f.ResolutionNotes
    FROM ArticleFeedback f
    INNER JOIN Users u ON f.UserId = u.UserId
    LEFT JOIN Users ru ON f.ResolvedBy = ru.UserId
    WHERE f.ArticleId = @ArticleId
        AND (@IncludeResolved = 1 OR f.IsResolved = 0)
    ORDER BY f.CreatedAt DESC;
END
