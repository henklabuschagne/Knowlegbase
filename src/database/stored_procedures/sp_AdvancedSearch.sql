CREATE OR ALTER PROCEDURE sp_AdvancedSearch
    @SearchQuery NVARCHAR(500) = NULL,
    @StatusIds NVARCHAR(100) = NULL, -- Comma-separated StatusIds
    @TagIds NVARCHAR(500) = NULL, -- Comma-separated TagIds
    @AuthorId INT = NULL,
    @IsInternal BIT = NULL,
    @IsExternal BIT = NULL,
    @CreatedAfter DATETIME2 = NULL,
    @CreatedBefore DATETIME2 = NULL,
    @UpdatedAfter DATETIME2 = NULL,
    @UpdatedBefore DATETIME2 = NULL,
    @PublishedAfter DATETIME2 = NULL,
    @PublishedBefore DATETIME2 = NULL,
    @MinRating DECIMAL(3,2) = NULL,
    @MinViewCount INT = NULL,
    @HasFeedback BIT = NULL,
    @VersionNumber INT = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 20,
    @SortBy NVARCHAR(50) = 'CreatedAt', -- CreatedAt, UpdatedAt, Title, ViewCount, Rating, Relevance
    @SortOrder NVARCHAR(4) = 'DESC' -- ASC or DESC
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    -- Create temp table for tag filtering
    IF @TagIds IS NOT NULL
    BEGIN
        CREATE TABLE #FilterTags (TagId INT);
        INSERT INTO #FilterTags (TagId)
        SELECT CAST(value AS INT)
        FROM STRING_SPLIT(@TagIds, ',')
        WHERE value <> '';
    END
    
    -- Create temp table for status filtering
    IF @StatusIds IS NOT NULL
    BEGIN
        CREATE TABLE #FilterStatuses (StatusId INT);
        INSERT INTO #FilterStatuses (StatusId)
        SELECT CAST(value AS INT)
        FROM STRING_SPLIT(@StatusIds, ',')
        WHERE value <> '';
    END
    
    -- Main query with all filters
    WITH FilteredArticles AS (
        SELECT DISTINCT
            a.ArticleId,
            a.Title,
            a.Summary,
            a.Content,
            a.StatusId,
            s.StatusName,
            a.AuthorId,
            u.FirstName + ' ' + u.LastName AS AuthorName,
            a.CreatedAt,
            a.UpdatedAt,
            a.PublishedAt,
            a.IsInternal,
            a.VersionNumber,
            am.TotalViews AS ViewCount,
            am.AverageRating,
            am.TotalFeedback,
            -- Calculate relevance score for text search
            CASE 
                WHEN @SearchQuery IS NOT NULL THEN
                    (CASE WHEN a.Title LIKE '%' + @SearchQuery + '%' THEN 100 ELSE 0 END) +
                    (CASE WHEN a.Summary LIKE '%' + @SearchQuery + '%' THEN 50 ELSE 0 END) +
                    (CASE WHEN a.Content LIKE '%' + @SearchQuery + '%' THEN 25 ELSE 0 END)
                ELSE 0
            END AS RelevanceScore
        FROM Articles a
        INNER JOIN Users u ON a.AuthorId = u.UserId
        INNER JOIN ArticleStatuses s ON a.StatusId = s.StatusId
        LEFT JOIN ArticleMetrics am ON a.ArticleId = am.ArticleId
        LEFT JOIN ArticleTags at ON a.ArticleId = at.ArticleId
        WHERE 
            -- Text search
            (@SearchQuery IS NULL OR 
             a.Title LIKE '%' + @SearchQuery + '%' OR 
             a.Summary LIKE '%' + @SearchQuery + '%' OR 
             a.Content LIKE '%' + @SearchQuery + '%')
            -- Status filter
            AND (@StatusIds IS NULL OR EXISTS (SELECT 1 FROM #FilterStatuses WHERE StatusId = a.StatusId))
            -- Tag filter
            AND (@TagIds IS NULL OR EXISTS (
                SELECT 1 FROM #FilterTags ft 
                INNER JOIN ArticleTags at2 ON ft.TagId = at2.TagId 
                WHERE at2.ArticleId = a.ArticleId
            ))
            -- Author filter
            AND (@AuthorId IS NULL OR a.AuthorId = @AuthorId)
            -- Internal/External filters
            AND (@IsInternal IS NULL OR a.IsInternal = @IsInternal)
            AND (@IsExternal IS NULL OR a.IsInternal = CASE WHEN @IsExternal = 1 THEN 0 ELSE 1 END)
            -- Date filters
            AND (@CreatedAfter IS NULL OR a.CreatedAt >= @CreatedAfter)
            AND (@CreatedBefore IS NULL OR a.CreatedAt <= @CreatedBefore)
            AND (@UpdatedAfter IS NULL OR a.UpdatedAt >= @UpdatedAfter)
            AND (@UpdatedBefore IS NULL OR a.UpdatedAt <= @UpdatedBefore)
            AND (@PublishedAfter IS NULL OR a.PublishedAt >= @PublishedAfter)
            AND (@PublishedBefore IS NULL OR a.PublishedAt <= @PublishedBefore)
            -- Rating filter
            AND (@MinRating IS NULL OR am.AverageRating >= @MinRating)
            -- View count filter
            AND (@MinViewCount IS NULL OR am.TotalViews >= @MinViewCount)
            -- Feedback filter
            AND (@HasFeedback IS NULL OR 
                 (@HasFeedback = 1 AND am.TotalFeedback > 0) OR 
                 (@HasFeedback = 0 AND (am.TotalFeedback = 0 OR am.TotalFeedback IS NULL)))
            -- Version filter
            AND (@VersionNumber IS NULL OR a.VersionNumber = @VersionNumber)
    ),
    RankedArticles AS (
        SELECT *,
            ROW_NUMBER() OVER (
                ORDER BY 
                    CASE WHEN @SortBy = 'Title' AND @SortOrder = 'ASC' THEN Title END ASC,
                    CASE WHEN @SortBy = 'Title' AND @SortOrder = 'DESC' THEN Title END DESC,
                    CASE WHEN @SortBy = 'CreatedAt' AND @SortOrder = 'ASC' THEN CreatedAt END ASC,
                    CASE WHEN @SortBy = 'CreatedAt' AND @SortOrder = 'DESC' THEN CreatedAt END DESC,
                    CASE WHEN @SortBy = 'UpdatedAt' AND @SortOrder = 'ASC' THEN UpdatedAt END ASC,
                    CASE WHEN @SortBy = 'UpdatedAt' AND @SortOrder = 'DESC' THEN UpdatedAt END DESC,
                    CASE WHEN @SortBy = 'ViewCount' AND @SortOrder = 'ASC' THEN ViewCount END ASC,
                    CASE WHEN @SortBy = 'ViewCount' AND @SortOrder = 'DESC' THEN ViewCount END DESC,
                    CASE WHEN @SortBy = 'Rating' AND @SortOrder = 'ASC' THEN AverageRating END ASC,
                    CASE WHEN @SortBy = 'Rating' AND @SortOrder = 'DESC' THEN AverageRating END DESC,
                    CASE WHEN @SortBy = 'Relevance' AND @SortOrder = 'DESC' THEN RelevanceScore END DESC,
                    CASE WHEN @SortBy = 'Relevance' AND @SortOrder = 'ASC' THEN RelevanceScore END ASC
            ) AS RowNum,
            COUNT(*) OVER() AS TotalCount
        FROM FilteredArticles
    )
    SELECT 
        ArticleId,
        Title,
        Summary,
        StatusId,
        StatusName,
        AuthorId,
        AuthorName,
        CreatedAt,
        UpdatedAt,
        PublishedAt,
        IsInternal,
        VersionNumber,
        ViewCount,
        AverageRating,
        TotalFeedback,
        RelevanceScore,
        TotalCount
    FROM RankedArticles
    WHERE RowNum > @Offset AND RowNum <= @Offset + @PageSize
    ORDER BY RowNum;
    
    -- Cleanup
    IF OBJECT_ID('tempdb..#FilterTags') IS NOT NULL DROP TABLE #FilterTags;
    IF OBJECT_ID('tempdb..#FilterStatuses') IS NOT NULL DROP TABLE #FilterStatuses;
END
