CREATE OR ALTER PROCEDURE sp_GetSearchFacets
    @SearchQuery NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get articles matching the base search query
    CREATE TABLE #BaseResults (ArticleId INT);
    
    INSERT INTO #BaseResults (ArticleId)
    SELECT DISTINCT a.ArticleId
    FROM Articles a
    WHERE @SearchQuery IS NULL OR 
          a.Title LIKE '%' + @SearchQuery + '%' OR 
          a.Summary LIKE '%' + @SearchQuery + '%' OR 
          a.Content LIKE '%' + @SearchQuery + '%';
    
    -- Status facets
    SELECT 
        s.StatusId,
        s.StatusName,
        COUNT(DISTINCT a.ArticleId) AS Count
    FROM ArticleStatuses s
    LEFT JOIN Articles a ON s.StatusId = a.StatusId
    LEFT JOIN #BaseResults br ON a.ArticleId = br.ArticleId
    WHERE br.ArticleId IS NOT NULL OR @SearchQuery IS NULL
    GROUP BY s.StatusId, s.StatusName
    ORDER BY s.StatusName;
    
    -- Tag facets
    SELECT 
        t.TagId,
        t.TagName,
        t.ColorCode,
        COUNT(DISTINCT at.ArticleId) AS Count
    FROM Tags t
    LEFT JOIN ArticleTags at ON t.TagId = at.TagId
    LEFT JOIN #BaseResults br ON at.ArticleId = br.ArticleId
    WHERE (br.ArticleId IS NOT NULL OR @SearchQuery IS NULL) AND t.IsActive = 1
    GROUP BY t.TagId, t.TagName, t.ColorCode
    HAVING COUNT(DISTINCT at.ArticleId) > 0
    ORDER BY Count DESC, t.TagName;
    
    -- Author facets
    SELECT 
        u.UserId,
        u.FirstName + ' ' + u.LastName AS AuthorName,
        COUNT(DISTINCT a.ArticleId) AS Count
    FROM Users u
    LEFT JOIN Articles a ON u.UserId = a.AuthorId
    LEFT JOIN #BaseResults br ON a.ArticleId = br.ArticleId
    WHERE br.ArticleId IS NOT NULL OR @SearchQuery IS NULL
    GROUP BY u.UserId, u.FirstName, u.LastName
    HAVING COUNT(DISTINCT a.ArticleId) > 0
    ORDER BY Count DESC, AuthorName;
    
    -- Internal/External facets
    SELECT 
        CASE WHEN a.IsInternal = 1 THEN 'Internal' ELSE 'External' END AS Visibility,
        COUNT(DISTINCT a.ArticleId) AS Count
    FROM Articles a
    LEFT JOIN #BaseResults br ON a.ArticleId = br.ArticleId
    WHERE br.ArticleId IS NOT NULL OR @SearchQuery IS NULL
    GROUP BY a.IsInternal;
    
    -- Date range facets (last 7 days, 30 days, 90 days, year, older)
    SELECT 
        CASE 
            WHEN a.CreatedAt >= DATEADD(DAY, -7, GETUTCDATE()) THEN 'Last 7 days'
            WHEN a.CreatedAt >= DATEADD(DAY, -30, GETUTCDATE()) THEN 'Last 30 days'
            WHEN a.CreatedAt >= DATEADD(DAY, -90, GETUTCDATE()) THEN 'Last 90 days'
            WHEN a.CreatedAt >= DATEADD(YEAR, -1, GETUTCDATE()) THEN 'Last year'
            ELSE 'Older'
        END AS DateRange,
        COUNT(DISTINCT a.ArticleId) AS Count
    FROM Articles a
    LEFT JOIN #BaseResults br ON a.ArticleId = br.ArticleId
    WHERE br.ArticleId IS NOT NULL OR @SearchQuery IS NULL
    GROUP BY 
        CASE 
            WHEN a.CreatedAt >= DATEADD(DAY, -7, GETUTCDATE()) THEN 'Last 7 days'
            WHEN a.CreatedAt >= DATEADD(DAY, -30, GETUTCDATE()) THEN 'Last 30 days'
            WHEN a.CreatedAt >= DATEADD(DAY, -90, GETUTCDATE()) THEN 'Last 90 days'
            WHEN a.CreatedAt >= DATEADD(YEAR, -1, GETUTCDATE()) THEN 'Last year'
            ELSE 'Older'
        END;
    
    DROP TABLE #BaseResults;
END
