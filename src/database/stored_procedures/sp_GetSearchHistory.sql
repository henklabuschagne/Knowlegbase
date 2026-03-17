CREATE OR ALTER PROCEDURE sp_GetSearchHistory
    @UserId INT,
    @Limit INT = 20
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@Limit)
        HistoryId,
        UserId,
        SearchQuery,
        FilterCriteria,
        ResultsCount,
        SearchedAt
    FROM SearchHistory
    WHERE UserId = @UserId
    ORDER BY SearchedAt DESC;
END
