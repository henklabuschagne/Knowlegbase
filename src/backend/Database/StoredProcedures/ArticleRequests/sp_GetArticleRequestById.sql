CREATE PROCEDURE sp_GetArticleRequestById
    @RequestId INT
AS
BEGIN
    SET NOCOUNT ON;

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
        ar.CompletedAt
    FROM ArticleRequests ar
    INNER JOIN Users u1 ON ar.RequestedByUserId = u1.UserId
    LEFT JOIN Users u2 ON ar.AssignedToUserId = u2.UserId
    INNER JOIN RequestStatuses rs ON ar.StatusId = rs.StatusId
    WHERE ar.RequestId = @RequestId;
END;
