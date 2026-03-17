CREATE PROCEDURE sp_GetNotificationsByUserId
    @UserId INT,
    @IsRead BIT = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

    -- Get total count
    DECLARE @TotalCount INT;
    SELECT @TotalCount = COUNT(*)
    FROM Notifications
    WHERE UserId = @UserId
        AND (@IsRead IS NULL OR IsRead = @IsRead);

    -- Get paginated results
    SELECT 
        NotificationId,
        UserId,
        Title,
        Message,
        NotificationType,
        RelatedEntityType,
        RelatedEntityId,
        IsRead,
        CreatedAt,
        ReadAt,
        @TotalCount AS TotalCount
    FROM Notifications
    WHERE UserId = @UserId
        AND (@IsRead IS NULL OR IsRead = @IsRead)
    ORDER BY CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
