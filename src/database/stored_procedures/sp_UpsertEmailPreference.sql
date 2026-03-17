CREATE OR ALTER PROCEDURE sp_UpsertEmailPreference
    @UserId INT,
    @EmailType NVARCHAR(50),
    @IsEnabled BIT,
    @Frequency NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM EmailPreferences WHERE UserId = @UserId AND EmailType = @EmailType)
    BEGIN
        UPDATE EmailPreferences
        SET IsEnabled = @IsEnabled,
            Frequency = @Frequency,
            UpdatedAt = GETUTCDATE()
        WHERE UserId = @UserId AND EmailType = @EmailType;
    END
    ELSE
    BEGIN
        INSERT INTO EmailPreferences (UserId, EmailType, IsEnabled, Frequency, CreatedAt, UpdatedAt)
        VALUES (@UserId, @EmailType, @IsEnabled, @Frequency, GETUTCDATE(), GETUTCDATE());
    END
    
    SELECT 
        PreferenceId,
        UserId,
        EmailType,
        IsEnabled,
        Frequency,
        CreatedAt,
        UpdatedAt
    FROM EmailPreferences
    WHERE UserId = @UserId AND EmailType = @EmailType;
END
