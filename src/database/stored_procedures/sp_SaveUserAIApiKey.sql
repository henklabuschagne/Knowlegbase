CREATE OR ALTER PROCEDURE sp_SaveUserAIApiKey
    @UserId INT,
    @ApiKey NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if entry exists
    IF EXISTS (SELECT 1 FROM UserAISettings WHERE UserId = @UserId)
    BEGIN
        -- Update existing
        UPDATE UserAISettings
        SET ApiKey = @ApiKey,
            UpdatedAt = GETUTCDATE()
        WHERE UserId = @UserId;
    END
    ELSE
    BEGIN
        -- Insert new
        INSERT INTO UserAISettings (UserId, ApiKey, CreatedAt, UpdatedAt)
        VALUES (@UserId, @ApiKey, GETUTCDATE(), GETUTCDATE());
    END
END
