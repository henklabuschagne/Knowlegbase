CREATE OR ALTER PROCEDURE sp_GetAuditTrail
    @TableName NVARCHAR(100) = NULL,
    @RecordId INT = NULL,
    @UserId INT = NULL,
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
    FROM AuditTrail at
    WHERE (@TableName IS NULL OR at.TableName = @TableName)
        AND (@RecordId IS NULL OR at.RecordId = @RecordId)
        AND (@UserId IS NULL OR at.UserId = @UserId)
        AND (@StartDate IS NULL OR at.ChangedAt >= @StartDate)
        AND (@EndDate IS NULL OR at.ChangedAt <= @EndDate);
    
    -- Get paginated results
    SELECT 
        at.AuditId,
        at.UserId,
        u.FirstName + ' ' + u.LastName AS UserName,
        at.TableName,
        at.RecordId,
        at.Operation,
        at.ColumnName,
        at.OldValue,
        at.NewValue,
        at.ChangedAt
    FROM AuditTrail at
    LEFT JOIN Users u ON at.UserId = u.UserId
    WHERE (@TableName IS NULL OR at.TableName = @TableName)
        AND (@RecordId IS NULL OR at.RecordId = @RecordId)
        AND (@UserId IS NULL OR at.UserId = @UserId)
        AND (@StartDate IS NULL OR at.ChangedAt >= @StartDate)
        AND (@EndDate IS NULL OR at.ChangedAt <= @EndDate)
    ORDER BY at.ChangedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
