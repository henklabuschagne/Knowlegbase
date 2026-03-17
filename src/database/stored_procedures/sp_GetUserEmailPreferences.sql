CREATE OR ALTER PROCEDURE sp_GetUserEmailPreferences
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        PreferenceId,
        UserId,
        EmailType,
        IsEnabled,
        Frequency,
        CreatedAt,
        UpdatedAt
    FROM EmailPreferences
    WHERE UserId = @UserId;
END
