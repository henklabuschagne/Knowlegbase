CREATE OR ALTER PROCEDURE sp_LogActivity
    @UserId INT = NULL,
    @EntityType NVARCHAR(50),
    @EntityId INT,
    @Action NVARCHAR(50),
    @Description NVARCHAR(MAX) = NULL,
    @OldValue NVARCHAR(MAX) = NULL,
    @NewValue NVARCHAR(MAX) = NULL,
    @IpAddress NVARCHAR(45) = NULL,
    @UserAgent NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO ActivityLogs (
        UserId,
        EntityType,
        EntityId,
        Action,
        Description,
        OldValue,
        NewValue,
        IpAddress,
        UserAgent,
        CreatedAt
    )
    VALUES (
        @UserId,
        @EntityType,
        @EntityId,
        @Action,
        @Description,
        @OldValue,
        @NewValue,
        @IpAddress,
        @UserAgent,
        GETUTCDATE()
    );
    
    SELECT SCOPE_IDENTITY() AS ActivityId;
END
