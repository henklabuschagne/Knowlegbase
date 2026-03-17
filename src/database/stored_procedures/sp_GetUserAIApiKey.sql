CREATE OR ALTER PROCEDURE sp_GetUserAIApiKey
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT ApiKey
    FROM UserAISettings
    WHERE UserId = @UserId;
END
