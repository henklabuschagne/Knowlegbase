CREATE OR ALTER PROCEDURE sp_LogUserActivity
    @UserId INT,
    @ActivityType NVARCHAR(100),
    @EntityType NVARCHAR(50) = NULL,
    @EntityId INT = NULL,
    @Details NVARCHAR(MAX) = NULL,
    @SessionId NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO UserActivity (UserId, ActivityType, EntityType, EntityId, Details, CreatedAt, SessionId)
    VALUES (@UserId, @ActivityType, @EntityType, @EntityId, @Details, GETUTCDATE(), @SessionId);
    
    SELECT SCOPE_IDENTITY() AS ActivityId;
END
