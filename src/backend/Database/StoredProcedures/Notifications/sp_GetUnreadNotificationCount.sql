CREATE PROCEDURE sp_GetUnreadNotificationCount
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT COUNT(*) AS UnreadCount
    FROM Notifications
    WHERE UserId = @UserId
        AND IsRead = 0;
END;
