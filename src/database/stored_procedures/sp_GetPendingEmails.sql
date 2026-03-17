CREATE OR ALTER PROCEDURE sp_GetPendingEmails
    @BatchSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@BatchSize)
        EmailId,
        ToEmail,
        ToName,
        FromEmail,
        FromName,
        Subject,
        Body,
        IsHtml,
        Priority,
        Attempts,
        MaxAttempts,
        UserId,
        EntityType,
        EntityId
    FROM EmailQueue
    WHERE Status = 'Pending'
        AND Attempts < MaxAttempts
        AND (ScheduledFor IS NULL OR ScheduledFor <= GETUTCDATE())
    ORDER BY Priority ASC, CreatedAt ASC;
END
