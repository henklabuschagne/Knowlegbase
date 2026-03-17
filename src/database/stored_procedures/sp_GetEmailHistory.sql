CREATE PROCEDURE sp_GetEmailHistory
    @UserEmail NVARCHAR(255),
    @Page INT = 1,
    @PageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    SELECT 
        EmailId,
        RecipientEmail,
        RecipientName,
        Subject,
        Status,
        Priority,
        ScheduledFor,
        SentAt,
        CreatedAt
    FROM EmailQueue
    WHERE RecipientEmail = @UserEmail
    ORDER BY CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
