CREATE OR ALTER PROCEDURE sp_GetAnalyticsDashboard
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
    
    -- Overall statistics
    SELECT 
        (SELECT COUNT(*) FROM Articles WHERE StatusId = (SELECT StatusId FROM ArticleStatuses WHERE StatusName = 'Published')) AS TotalPublishedArticles,
        (SELECT COUNT(*) FROM Users WHERE IsActive = 1) AS TotalActiveUsers,
        (SELECT COUNT(*) FROM ArticleViews WHERE ViewedAt BETWEEN @StartDate AND @EndDate) AS TotalViewsInPeriod,
        (SELECT COUNT(*) FROM SearchLogs WHERE SearchedAt BETWEEN @StartDate AND @EndDate) AS TotalSearchesInPeriod,
        (SELECT COUNT(*) FROM ArticleFeedback WHERE CreatedAt BETWEEN @StartDate AND @EndDate) AS TotalFeedbackInPeriod,
        (SELECT COUNT(*) FROM ArticleRequests WHERE StatusId = (SELECT RequestStatusId FROM ArticleRequestStatuses WHERE StatusName = 'Pending')) AS PendingRequests,
        (SELECT COUNT(*) FROM ApprovalWorkflow WHERE CurrentStatusId = (SELECT ApprovalStatusId FROM ApprovalStatuses WHERE StatusName = 'Pending')) AS PendingApprovals;
    
    -- Article views trend (daily for the period)
    SELECT 
        CAST(ViewedAt AS DATE) AS ViewDate,
        COUNT(*) AS ViewCount,
        COUNT(DISTINCT UserId) AS UniqueUsers
    FROM ArticleViews
    WHERE ViewedAt BETWEEN @StartDate AND @EndDate
    GROUP BY CAST(ViewedAt AS DATE)
    ORDER BY ViewDate;
    
    -- Search trend (daily for the period)
    SELECT 
        CAST(SearchedAt AS DATE) AS SearchDate,
        COUNT(*) AS SearchCount,
        SearchType,
        AVG(ResultsCount) AS AvgResultsCount
    FROM SearchLogs
    WHERE SearchedAt BETWEEN @StartDate AND @EndDate
    GROUP BY CAST(SearchedAt AS DATE), SearchType
    ORDER BY SearchDate;
    
    -- Top viewed articles
    SELECT TOP 10
        a.ArticleId,
        a.Title,
        COUNT(*) AS ViewCount,
        COUNT(DISTINCT av.UserId) AS UniqueViewers
    FROM ArticleViews av
    INNER JOIN Articles a ON av.ArticleId = a.ArticleId
    WHERE av.ViewedAt BETWEEN @StartDate AND @EndDate
    GROUP BY a.ArticleId, a.Title
    ORDER BY ViewCount DESC;
    
    -- Top search queries
    SELECT TOP 10
        SearchQuery,
        COUNT(*) AS SearchCount,
        AVG(ResultsCount) AS AvgResultsCount,
        SearchType
    FROM SearchLogs
    WHERE SearchedAt BETWEEN @StartDate AND @EndDate
    GROUP BY SearchQuery, SearchType
    ORDER BY SearchCount DESC;
    
    -- User activity summary
    SELECT 
        ActivityType,
        COUNT(*) AS ActivityCount,
        COUNT(DISTINCT UserId) AS UniqueUsers
    FROM UserActivity
    WHERE CreatedAt BETWEEN @StartDate AND @EndDate
    GROUP BY ActivityType
    ORDER BY ActivityCount DESC;
    
    -- Feedback summary
    SELECT 
        AVG(CAST(Rating AS DECIMAL(3,2))) AS AvgRating,
        COUNT(*) AS TotalFeedback,
        SUM(CASE WHEN IsHelpful = 1 THEN 1 ELSE 0 END) AS HelpfulCount,
        SUM(CASE WHEN IsHelpful = 0 THEN 1 ELSE 0 END) AS NotHelpfulCount,
        Category,
        COUNT(CASE WHEN IsResolved = 1 THEN 1 END) AS ResolvedCount
    FROM ArticleFeedback
    WHERE CreatedAt BETWEEN @StartDate AND @EndDate
    GROUP BY Category;
END
