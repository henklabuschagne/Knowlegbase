CREATE OR ALTER PROCEDURE sp_UpdateEmailStatus
    @EmailId INT,
    @Status NVARCHAR(20),
    @ErrorMessage NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE EmailQueue
    SET Status = @Status,
        Attempts = Attempts + 1,
        ErrorMessage = @ErrorMessage,
        SentAt = CASE WHEN @Status = 'Sent' THEN GETUTCDATE() ELSE SentAt END
    WHERE EmailId = @EmailId;
    
    SELECT @@ROWCOUNT AS UpdatedCount;
END
