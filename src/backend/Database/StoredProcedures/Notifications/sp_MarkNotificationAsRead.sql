CREATE PROCEDURE sp_MarkNotificationAsRead
    @NotificationId INT,
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Notifications
    SET 
        IsRead = 1,
        ReadAt = GETUTCDATE()
    WHERE NotificationId = @NotificationId
        AND UserId = @UserId
        AND IsRead = 0;

    SELECT @@ROWCOUNT AS RowsAffected;
END;
