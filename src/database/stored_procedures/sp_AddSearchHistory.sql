CREATE OR ALTER PROCEDURE sp_AddSearchHistory
    @UserId INT,
    @SearchQuery NVARCHAR(500),
    @FilterCriteria NVARCHAR(MAX) = NULL,
    @ResultsCount INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO SearchHistory (UserId, SearchQuery, FilterCriteria, ResultsCount, SearchedAt)
    VALUES (@UserId, @SearchQuery, @FilterCriteria, @ResultsCount, GETUTCDATE());
    
    SELECT SCOPE_IDENTITY() AS HistoryId;
END
