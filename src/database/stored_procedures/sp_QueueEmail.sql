CREATE OR ALTER PROCEDURE sp_QueueEmail
    @ToEmail NVARCHAR(255),
    @ToName NVARCHAR(255) = NULL,
    @FromEmail NVARCHAR(255),
    @FromName NVARCHAR(255) = NULL,
    @Subject NVARCHAR(500),
    @Body NVARCHAR(MAX),
    @IsHtml BIT = 1,
    @Priority INT = 5,
    @ScheduledFor DATETIME2 = NULL,
    @UserId INT = NULL,
    @EntityType NVARCHAR(50) = NULL,
    @EntityId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO EmailQueue (
        ToEmail,
        ToName,
        FromEmail,
        FromName,
        Subject,
        Body,
        IsHtml,
        Priority,
        Status,
        ScheduledFor,
        UserId,
        EntityType,
        EntityId,
        CreatedAt
    )
    VALUES (
        @ToEmail,
        @ToName,
        @FromEmail,
        @FromName,
        @Subject,
        @Body,
        @IsHtml,
        @Priority,
        'Pending',
        @ScheduledFor,
        @UserId,
        @EntityType,
        @EntityId,
        GETUTCDATE()
    );
    
    SELECT SCOPE_IDENTITY() AS EmailId;
END
