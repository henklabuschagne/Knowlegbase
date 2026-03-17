CREATE OR ALTER PROCEDURE sp_GetUserAnalytics
    @UserId INT,
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
    
    -- User basic info
    SELECT 
        u.UserId,
        u.Email,
        u.FirstName + ' ' + u.LastName AS UserName,
        r.RoleName,
        u.CreatedAt AS JoinedAt
    FROM Users u
    INNER JOIN Roles r ON u.RoleId = r.RoleId
    WHERE u.UserId = @UserId;
    
    -- Activity summary
    SELECT 
        COUNT(*) AS TotalActivities,
        MIN(CreatedAt) AS FirstActivity,
        MAX(CreatedAt) AS LastActivity
    FROM UserActivity
    WHERE UserId = @UserId
        AND CreatedAt BETWEEN @StartDate AND @EndDate;
    
    -- Activity breakdown
    SELECT 
        ActivityType,
        COUNT(*) AS ActivityCount
    FROM UserActivity
    WHERE UserId = @UserId
        AND CreatedAt BETWEEN @StartDate AND @EndDate
    GROUP BY ActivityType
    ORDER BY ActivityCount DESC;
    
    -- Articles created
    SELECT 
        COUNT(*) AS ArticlesCreated
    FROM Articles
    WHERE AuthorId = @UserId
        AND CreatedAt BETWEEN @StartDate AND @EndDate;
    
    -- Articles viewed
    SELECT 
        COUNT(DISTINCT ArticleId) AS ArticlesViewed
    FROM ArticleViews
    WHERE UserId = @UserId
        AND ViewedAt BETWEEN @StartDate AND @EndDate;
    
    -- Searches performed
    SELECT 
        COUNT(*) AS TotalSearches,
        AVG(ResultsCount) AS AvgResultsCount
    FROM SearchLogs
    WHERE UserId = @UserId
        AND SearchedAt BETWEEN @StartDate AND @EndDate;
    
    -- Feedback provided
    SELECT 
        COUNT(*) AS FeedbackProvided,
        AVG(CAST(Rating AS DECIMAL(3,2))) AS AvgRatingGiven
    FROM ArticleFeedback
    WHERE UserId = @UserId
        AND CreatedAt BETWEEN @StartDate AND @EndDate;
    
    -- Article requests made
    SELECT 
        COUNT(*) AS RequestsMade
    FROM ArticleRequests
    WHERE RequestedBy = @UserId
        AND CreatedAt BETWEEN @StartDate AND @EndDate;
END
