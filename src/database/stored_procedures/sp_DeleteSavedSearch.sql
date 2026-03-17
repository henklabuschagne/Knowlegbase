CREATE OR ALTER PROCEDURE sp_DeleteSavedSearch
    @SavedSearchId INT,
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Only allow deletion if user owns the search or is an admin
    DELETE FROM SavedSearches
    WHERE SavedSearchId = @SavedSearchId 
        AND UserId = @UserId;
    
    SELECT @@ROWCOUNT AS DeletedCount;
END
