CREATE OR ALTER PROCEDURE sp_GetSavedSearches
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ss.SavedSearchId,
        ss.UserId,
        ss.SearchName,
        ss.SearchQuery,
        ss.FilterCriteria,
        ss.IsPublic,
        ss.CreatedAt,
        ss.UpdatedAt,
        ss.LastUsedAt,
        ss.UseCount,
        u.FirstName + ' ' + u.LastName AS CreatedByName
    FROM SavedSearches ss
    INNER JOIN Users u ON ss.UserId = u.UserId
    WHERE ss.UserId = @UserId OR ss.IsPublic = 1
    ORDER BY ss.LastUsedAt DESC, ss.CreatedAt DESC;
END
