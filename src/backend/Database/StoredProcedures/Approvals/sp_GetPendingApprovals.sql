CREATE PROCEDURE sp_GetPendingApprovals
    @ApproverUserId INT = NULL,
    @ApprovalLevel INT = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    DECLARE @UserRole NVARCHAR(50);
    
    IF @ApproverUserId IS NOT NULL
    BEGIN
        SELECT @UserRole = Role FROM Users WHERE UserId = @ApproverUserId;
    END

    -- Get total count
    DECLARE @TotalCount INT;
    SELECT @TotalCount = COUNT(*)
    FROM ArticleApprovals aa
    INNER JOIN Articles a ON aa.ArticleId = a.ArticleId
    WHERE aa.Status = 'Pending'
        AND (@ApprovalLevel IS NULL OR aa.ApprovalLevel = @ApprovalLevel)
        AND (@ApproverUserId IS NULL OR 
            (@UserRole = 'Admin') OR 
            (@UserRole = 'Support' AND aa.ApprovalLevel = 1));

    -- Get paginated results
    SELECT 
        aa.ApprovalId,
        aa.ArticleId,
        a.Title AS ArticleTitle,
        aa.ArticleVersionId,
        aa.SubmittedByUserId,
        u.FirstName + ' ' + u.LastName AS SubmittedByName,
        aa.ApprovalLevel,
        aa.Status,
        aa.SubmittedAt,
        @TotalCount AS TotalCount
    FROM ArticleApprovals aa
    INNER JOIN Articles a ON aa.ArticleId = a.ArticleId
    INNER JOIN Users u ON aa.SubmittedByUserId = u.UserId
    WHERE aa.Status = 'Pending'
        AND (@ApprovalLevel IS NULL OR aa.ApprovalLevel = @ApprovalLevel)
        AND (@ApproverUserId IS NULL OR 
            (@UserRole = 'Admin') OR 
            (@UserRole = 'Support' AND aa.ApprovalLevel = 1))
    ORDER BY aa.SubmittedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
