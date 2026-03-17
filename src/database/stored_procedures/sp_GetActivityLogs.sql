CREATE OR ALTER PROCEDURE sp_GetActivityLogs
    @UserId INT = NULL,
    @EntityType NVARCHAR(50) = NULL,
    @EntityId INT = NULL,
    @Action NVARCHAR(50) = NULL,
    @StartDate DATETIME2 = NULL,
    @EndDate DATETIME2 = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 50
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    -- Get total count
    SELECT COUNT(*) AS TotalCount
    FROM ActivityLogs al
    WHERE (@UserId IS NULL OR al.UserId = @UserId)
        AND (@EntityType IS NULL OR al.EntityType = @EntityType)
        AND (@EntityId IS NULL OR al.EntityId = @EntityId)
        AND (@Action IS NULL OR al.Action = @Action)
        AND (@StartDate IS NULL OR al.CreatedAt >= @StartDate)
        AND (@EndDate IS NULL OR al.CreatedAt <= @EndDate);
    
    -- Get paginated results
    SELECT 
        al.ActivityId,
        al.UserId,
        u.FirstName + ' ' + u.LastName AS UserName,
        u.Email AS UserEmail,
        al.EntityType,
        al.EntityId,
        al.Action,
        al.Description,
        al.OldValue,
        al.NewValue,
        al.IpAddress,
        al.UserAgent,
        al.CreatedAt
    FROM ActivityLogs al
    LEFT JOIN Users u ON al.UserId = u.UserId
    WHERE (@UserId IS NULL OR al.UserId = @UserId)
        AND (@EntityType IS NULL OR al.EntityType = @EntityType)
        AND (@EntityId IS NULL OR al.EntityId = @EntityId)
        AND (@Action IS NULL OR al.Action = @Action)
        AND (@StartDate IS NULL OR al.CreatedAt >= @StartDate)
        AND (@EndDate IS NULL OR al.CreatedAt <= @EndDate)
    ORDER BY al.CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
