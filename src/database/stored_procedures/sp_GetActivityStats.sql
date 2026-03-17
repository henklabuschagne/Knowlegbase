CREATE OR ALTER PROCEDURE sp_GetActivityStats
    @StartDate DATETIME2 = NULL,
    @EndDate DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Overall stats
    SELECT 
        COUNT(*) AS TotalActivities,
        COUNT(DISTINCT UserId) AS UniqueUsers,
        COUNT(DISTINCT EntityType) AS EntityTypes,
        COUNT(DISTINCT Action) AS ActionTypes
    FROM ActivityLogs
    WHERE (@StartDate IS NULL OR CreatedAt >= @StartDate)
        AND (@EndDate IS NULL OR CreatedAt <= @EndDate);
    
    -- Activities by entity type
    SELECT 
        EntityType,
        COUNT(*) AS ActivityCount,
        COUNT(DISTINCT UserId) AS UniqueUsers
    FROM ActivityLogs
    WHERE (@StartDate IS NULL OR CreatedAt >= @StartDate)
        AND (@EndDate IS NULL OR CreatedAt <= @EndDate)
    GROUP BY EntityType
    ORDER BY ActivityCount DESC;
    
    -- Activities by action
    SELECT 
        Action,
        COUNT(*) AS ActivityCount,
        COUNT(DISTINCT UserId) AS UniqueUsers
    FROM ActivityLogs
    WHERE (@StartDate IS NULL OR CreatedAt >= @StartDate)
        AND (@EndDate IS NULL OR CreatedAt <= @EndDate)
    GROUP BY Action
    ORDER BY ActivityCount DESC;
    
    -- Top users by activity
    SELECT TOP 10
        u.UserId,
        u.FirstName + ' ' + u.LastName AS UserName,
        u.Email,
        COUNT(*) AS ActivityCount,
        MAX(al.CreatedAt) AS LastActivity
    FROM ActivityLogs al
    INNER JOIN Users u ON al.UserId = u.UserId
    WHERE (@StartDate IS NULL OR al.CreatedAt >= @StartDate)
        AND (@EndDate IS NULL OR al.CreatedAt <= @EndDate)
    GROUP BY u.UserId, u.FirstName, u.LastName, u.Email
    ORDER BY ActivityCount DESC;
    
    -- Activity timeline (daily)
    SELECT 
        CAST(CreatedAt AS DATE) AS ActivityDate,
        COUNT(*) AS ActivityCount,
        COUNT(DISTINCT UserId) AS UniqueUsers
    FROM ActivityLogs
    WHERE (@StartDate IS NULL OR CreatedAt >= @StartDate)
        AND (@EndDate IS NULL OR CreatedAt <= @EndDate)
    GROUP BY CAST(CreatedAt AS DATE)
    ORDER BY ActivityDate DESC;
END
