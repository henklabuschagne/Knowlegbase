CREATE PROCEDURE sp_GetArticleRequests
    @StatusId INT = NULL,
    @RequestedByUserId INT = NULL,
    @AssignedToUserId INT = NULL,
    @Priority INT = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

    -- Get total count
    DECLARE @TotalCount INT;
    SELECT @TotalCount = COUNT(*)
    FROM ArticleRequests ar
    WHERE (@StatusId IS NULL OR ar.StatusId = @StatusId)
        AND (@RequestedByUserId IS NULL OR ar.RequestedByUserId = @RequestedByUserId)
        AND (@AssignedToUserId IS NULL OR ar.AssignedToUserId = @AssignedToUserId)
        AND (@Priority IS NULL OR ar.Priority = @Priority);

    -- Get paginated results
    SELECT 
        ar.RequestId,
        ar.Title,
        ar.Description,
        ar.RequestedByUserId,
        u1.FirstName + ' ' + u1.LastName AS RequestedByName,
        u1.Email AS RequestedByEmail,
        ar.AssignedToUserId,
        u2.FirstName + ' ' + u2.LastName AS AssignedToName,
        ar.StatusId,
        rs.StatusName,
        ar.Priority,
        ar.ArticleId,
        ar.RejectionReason,
        ar.CreatedAt,
        ar.UpdatedAt,
        ar.CompletedAt,
        @TotalCount AS TotalCount
    FROM ArticleRequests ar
    INNER JOIN Users u1 ON ar.RequestedByUserId = u1.UserId
    LEFT JOIN Users u2 ON ar.AssignedToUserId = u2.UserId
    INNER JOIN RequestStatuses rs ON ar.StatusId = rs.StatusId
    WHERE (@StatusId IS NULL OR ar.StatusId = @StatusId)
        AND (@RequestedByUserId IS NULL OR ar.RequestedByUserId = @RequestedByUserId)
        AND (@AssignedToUserId IS NULL OR ar.AssignedToUserId = @AssignedToUserId)
        AND (@Priority IS NULL OR ar.Priority = @Priority)
    ORDER BY 
        CASE ar.Priority WHEN 4 THEN 1 WHEN 3 THEN 2 WHEN 2 THEN 3 ELSE 4 END,
        ar.CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
