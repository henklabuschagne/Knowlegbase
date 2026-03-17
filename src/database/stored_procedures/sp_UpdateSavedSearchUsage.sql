CREATE OR ALTER PROCEDURE sp_UpdateSavedSearchUsage
    @SavedSearchId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE SavedSearches
    SET LastUsedAt = GETUTCDATE(),
        UseCount = UseCount + 1
    WHERE SavedSearchId = @SavedSearchId;
END
