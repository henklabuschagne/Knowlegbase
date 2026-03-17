CREATE OR ALTER PROCEDURE sp_SaveSearch
    @UserId INT,
    @SearchName NVARCHAR(200),
    @SearchQuery NVARCHAR(500) = NULL,
    @FilterCriteria NVARCHAR(MAX),
    @IsPublic BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO SavedSearches (UserId, SearchName, SearchQuery, FilterCriteria, IsPublic, CreatedAt, UpdatedAt)
    VALUES (@UserId, @SearchName, @SearchQuery, @FilterCriteria, @IsPublic, GETUTCDATE(), GETUTCDATE());
    
    SELECT SCOPE_IDENTITY() AS SavedSearchId;
END
