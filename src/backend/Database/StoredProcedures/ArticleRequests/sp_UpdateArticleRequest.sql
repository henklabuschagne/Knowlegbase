CREATE PROCEDURE sp_UpdateArticleRequest
    @RequestId INT,
    @Title NVARCHAR(500) = NULL,
    @Description NVARCHAR(MAX) = NULL,
    @StatusId INT = NULL,
    @Priority INT = NULL,
    @AssignedToUserId INT = NULL,
    @RejectionReason NVARCHAR(1000) = NULL,
    @ArticleId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OldStatusId INT, @RequestedByUserId INT;
    SELECT @OldStatusId = StatusId, @RequestedByUserId = RequestedByUserId
    FROM ArticleRequests
    WHERE RequestId = @RequestId;

    UPDATE ArticleRequests
    SET
        Title = ISNULL(@Title, Title),
        Description = ISNULL(@Description, Description),
        StatusId = ISNULL(@StatusId, StatusId),
        Priority = ISNULL(@Priority, Priority),
        AssignedToUserId = CASE WHEN @AssignedToUserId IS NOT NULL THEN @AssignedToUserId ELSE AssignedToUserId END,
        RejectionReason = CASE WHEN @RejectionReason IS NOT NULL THEN @RejectionReason ELSE RejectionReason END,
        ArticleId = CASE WHEN @ArticleId IS NOT NULL THEN @ArticleId ELSE ArticleId END,
        UpdatedAt = GETUTCDATE(),
        CompletedAt = CASE WHEN @StatusId IN (4, 5) THEN GETUTCDATE() ELSE CompletedAt END
    WHERE RequestId = @RequestId;

    -- Create notification if status changed
    IF @StatusId IS NOT NULL AND @StatusId != @OldStatusId
    BEGIN
        DECLARE @Title NVARCHAR(500), @StatusName NVARCHAR(50);
        SELECT @Title = Title FROM ArticleRequests WHERE RequestId = @RequestId;
        SELECT @StatusName = StatusName FROM RequestStatuses WHERE StatusId = @StatusId;

        -- Notify the requester
        INSERT INTO Notifications (UserId, Title, Message, NotificationType, RelatedEntityType, RelatedEntityId, CreatedAt)
        VALUES (
            @RequestedByUserId,
            'Article Request Updated',
            'Your request "' + @Title + '" status changed to: ' + @StatusName,
            'ArticleRequestUpdate',
            'Request',
            @RequestId,
            GETUTCDATE()
        );
    END

    -- Return updated request
    EXEC sp_GetArticleRequestById @RequestId;
END;
