CREATE OR ALTER PROCEDURE sp_GetSearchAnalytics
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
    
    -- Overall search statistics
    SELECT 
        COUNT(*) AS TotalSearches,
        COUNT(DISTINCT UserId) AS UniqueSearchers,
        AVG(ResultsCount) AS AvgResultsCount,
        AVG(ResponseTimeMs) AS AvgResponseTimeMs,
        COUNT(CASE WHEN ClickedArticleId IS NOT NULL THEN 1 END) AS SearchesWithClicks,
        CAST(COUNT(CASE WHEN ClickedArticleId IS NOT NULL THEN 1 END) AS FLOAT) / COUNT(*) * 100 AS ClickThroughRate
    FROM SearchLogs
    WHERE SearchedAt BETWEEN @StartDate AND @EndDate;
    
    -- Search by type
    SELECT 
        SearchType,
        COUNT(*) AS SearchCount,
        AVG(ResultsCount) AS AvgResultsCount,
        AVG(ResponseTimeMs) AS AvgResponseTimeMs,
        COUNT(CASE WHEN ClickedArticleId IS NOT NULL THEN 1 END) AS ClickCount
    FROM SearchLogs
    WHERE SearchedAt BETWEEN @StartDate AND @EndDate
    GROUP BY SearchType
    ORDER BY SearchCount DESC;
    
    -- Top search queries
    SELECT TOP 20
        SearchQuery,
        COUNT(*) AS SearchCount,
        AVG(ResultsCount) AS AvgResultsCount,
        COUNT(CASE WHEN ClickedArticleId IS NOT NULL THEN 1 END) AS ClickCount
    FROM SearchLogs
    WHERE SearchedAt BETWEEN @StartDate AND @EndDate
    GROUP BY SearchQuery
    ORDER BY SearchCount DESC;
    
    -- Searches with no results
    SELECT TOP 20
        SearchQuery,
        COUNT(*) AS SearchCount,
        SearchType
    FROM SearchLogs
    WHERE SearchedAt BETWEEN @StartDate AND @EndDate
        AND ResultsCount = 0
    GROUP BY SearchQuery, SearchType
    ORDER BY SearchCount DESC;
    
    -- Most clicked articles from search
    SELECT TOP 10
        a.ArticleId,
        a.Title,
        COUNT(*) AS ClickCount,
        AVG(CAST(sl.ClickPosition AS FLOAT)) AS AvgClickPosition
    FROM SearchLogs sl
    INNER JOIN Articles a ON sl.ClickedArticleId = a.ArticleId
    WHERE sl.SearchedAt BETWEEN @StartDate AND @EndDate
    GROUP BY a.ArticleId, a.Title
    ORDER BY ClickCount DESC;
    
    -- Search trend over time
    SELECT 
        CAST(SearchedAt AS DATE) AS SearchDate,
        COUNT(*) AS SearchCount,
        COUNT(DISTINCT UserId) AS UniqueSearchers
    FROM SearchLogs
    WHERE SearchedAt BETWEEN @StartDate AND @EndDate
    GROUP BY CAST(SearchedAt AS DATE)
    ORDER BY SearchDate;
END
