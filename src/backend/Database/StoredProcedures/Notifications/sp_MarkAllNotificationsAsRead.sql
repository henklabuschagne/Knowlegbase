CREATE PROCEDURE sp_MarkAllNotificationsAsRead
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Notifications
    SET 
        IsRead = 1,
        ReadAt = GETUTCDATE()
    WHERE UserId = @UserId
        AND IsRead = 0;

    SELECT @@ROWCOUNT AS RowsAffected;
END;
