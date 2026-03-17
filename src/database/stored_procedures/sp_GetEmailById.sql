CREATE PROCEDURE sp_GetEmailById
    @EmailId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        EmailId,
        RecipientEmail,
        RecipientName,
        FromEmail,
        FromName,
        Subject,
        Body,
        IsHtml,
        Priority,
        Status,
        ScheduledFor,
        SentAt,
        ErrorMessage,
        RetryCount,
        UserId,
        EntityType,
        EntityId,
        CreatedAt
    FROM EmailQueue
    WHERE EmailId = @EmailId;
END
