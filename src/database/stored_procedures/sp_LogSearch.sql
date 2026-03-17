CREATE OR ALTER PROCEDURE sp_LogSearch
    @UserId INT = NULL,
    @SearchQuery NVARCHAR(500),
    @SearchType NVARCHAR(50),
    @ResultsCount INT,
    @ClickedArticleId INT = NULL,
    @ClickPosition INT = NULL,
    @ResponseTimeMs INT = NULL,
    @SessionId NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO SearchLogs (
        UserId,
        SearchQuery,
        SearchType,
        ResultsCount,
        ClickedArticleId,
        ClickPosition,
        SearchedAt,
        ResponseTimeMs,
        SessionId
    )
    VALUES (
        @UserId,
        @SearchQuery,
        @SearchType,
        @ResultsCount,
        @ClickedArticleId,
        @ClickPosition,
        GETUTCDATE(),
        @ResponseTimeMs,
        @SessionId
    );
    
    SELECT SCOPE_IDENTITY() AS SearchId;
END
