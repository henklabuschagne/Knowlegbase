CREATE OR ALTER PROCEDURE sp_GetAllFeedback
    @IncludeResolved BIT = 1,
    @CategoryFilter NVARCHAR(100) = NULL,
    @MinRating INT = NULL,
    @MaxRating INT = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 50
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        f.FeedbackId,
        f.ArticleId,
        a.Title AS ArticleTitle,
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
    INNER JOIN Articles a ON f.ArticleId = a.ArticleId
    INNER JOIN Users u ON f.UserId = u.UserId
    LEFT JOIN Users ru ON f.ResolvedBy = ru.UserId
    WHERE (@IncludeResolved = 1 OR f.IsResolved = 0)
        AND (@CategoryFilter IS NULL OR f.Category = @CategoryFilter)
        AND (@MinRating IS NULL OR f.Rating >= @MinRating)
        AND (@MaxRating IS NULL OR f.Rating <= @MaxRating)
    ORDER BY f.CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
    
    -- Return total count
    SELECT COUNT(*) AS TotalCount
    FROM ArticleFeedback f
    WHERE (@IncludeResolved = 1 OR f.IsResolved = 0)
        AND (@CategoryFilter IS NULL OR f.Category = @CategoryFilter)
        AND (@MinRating IS NULL OR f.Rating >= @MinRating)
        AND (@MaxRating IS NULL OR f.Rating <= @MaxRating);
END
