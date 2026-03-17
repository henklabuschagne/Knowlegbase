CREATE OR ALTER PROCEDURE sp_GetArticleAnalytics
    @ArticleId INT,
    @StartDate DATETIME2 = NULL,
    @EndDate DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Default to last 30 days if not specified
    IF @StartDate IS NULL
        SET @StartDate = DATEADD(DAY, -30, GETUTCDATE());
    
    IF @EndDate IS NULL
        SET @EndDate = GETUTCDATE();
    
    -- Article basic info
    SELECT 
        a.ArticleId,
        a.Title,
        a.Summary,
        a.CreatedAt,
        a.PublishedAt,
        u.FirstName + ' ' + u.LastName AS AuthorName
    FROM Articles a
    INNER JOIN Users u ON a.AuthorId = u.UserId
    WHERE a.ArticleId = @ArticleId;
    
    -- View statistics
    SELECT 
        COUNT(*) AS TotalViews,
        COUNT(DISTINCT UserId) AS UniqueViewers,
        MIN(ViewedAt) AS FirstViewed,
        MAX(ViewedAt) AS LastViewed
    FROM ArticleViews
    WHERE ArticleId = @ArticleId
        AND ViewedAt BETWEEN @StartDate AND @EndDate;
    
    -- Views trend
    SELECT 
        CAST(ViewedAt AS DATE) AS ViewDate,
        COUNT(*) AS ViewCount
    FROM ArticleViews
    WHERE ArticleId = @ArticleId
        AND ViewedAt BETWEEN @StartDate AND @EndDate
    GROUP BY CAST(ViewedAt AS DATE)
    ORDER BY ViewDate;
    
    -- Feedback statistics
    SELECT 
        AVG(CAST(Rating AS DECIMAL(3,2))) AS AvgRating,
        COUNT(*) AS TotalFeedback,
        SUM(CASE WHEN IsHelpful = 1 THEN 1 ELSE 0 END) AS HelpfulCount,
        SUM(CASE WHEN IsHelpful = 0 THEN 1 ELSE 0 END) AS NotHelpfulCount
    FROM ArticleFeedback
    WHERE ArticleId = @ArticleId
        AND CreatedAt BETWEEN @StartDate AND @EndDate;
    
    -- Search queries leading to this article
    SELECT TOP 10
        SearchQuery,
        COUNT(*) AS SearchCount,
        ClickPosition
    FROM SearchLogs
    WHERE ClickedArticleId = @ArticleId
        AND SearchedAt BETWEEN @StartDate AND @EndDate
    GROUP BY SearchQuery, ClickPosition
    ORDER BY SearchCount DESC;
    
    -- Version history count
    SELECT 
        COUNT(*) AS TotalVersions
    FROM ArticleVersions
    WHERE ArticleId = @ArticleId;
END
