-- =============================================
-- Phase 2: Tags & Article Base - Stored Procedures
-- =============================================

USE KnowledgeBase;
GO

-- =============================================
-- Tag Management Procedures
-- =============================================

-- Get All Tag Types
CREATE OR ALTER PROCEDURE sp_GetAllTagTypes
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        TagTypeId,
        TagTypeName,
        Description,
        IsActive,
        CreatedAt,
        UpdatedAt
    FROM TagTypes
    WHERE IsActive = 1
    ORDER BY TagTypeName;
END
GO

-- Get All Tags
CREATE OR ALTER PROCEDURE sp_GetAllTags
    @TagTypeId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        t.TagId,
        t.TagTypeId,
        tt.TagTypeName,
        t.TagName,
        t.TagValue,
        t.Description,
        t.ColorCode,
        t.IsActive,
        t.CreatedAt,
        t.UpdatedAt
    FROM Tags t
    INNER JOIN TagTypes tt ON t.TagTypeId = tt.TagTypeId
    WHERE t.IsActive = 1
        AND (@TagTypeId IS NULL OR t.TagTypeId = @TagTypeId)
    ORDER BY tt.TagTypeName, t.TagName;
END
GO

-- Get Tag by ID
CREATE OR ALTER PROCEDURE sp_GetTagById
    @TagId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        t.TagId,
        t.TagTypeId,
        tt.TagTypeName,
        t.TagName,
        t.TagValue,
        t.Description,
        t.ColorCode,
        t.IsActive,
        t.CreatedAt,
        t.UpdatedAt
    FROM Tags t
    INNER JOIN TagTypes tt ON t.TagTypeId = tt.TagTypeId
    WHERE t.TagId = @TagId;
END
GO

-- Create Tag
CREATE OR ALTER PROCEDURE sp_CreateTag
    @TagTypeId INT,
    @TagName NVARCHAR(100),
    @TagValue NVARCHAR(200),
    @Description NVARCHAR(500) = NULL,
    @ColorCode NVARCHAR(7) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Tags (TagTypeId, TagName, TagValue, Description, ColorCode)
    VALUES (@TagTypeId, @TagName, @TagValue, @Description, @ColorCode);
    
    SELECT SCOPE_IDENTITY() AS TagId;
END
GO

-- Update Tag
CREATE OR ALTER PROCEDURE sp_UpdateTag
    @TagId INT,
    @TagName NVARCHAR(100),
    @TagValue NVARCHAR(200),
    @Description NVARCHAR(500) = NULL,
    @ColorCode NVARCHAR(7) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Tags
    SET TagName = @TagName,
        TagValue = @TagValue,
        Description = @Description,
        ColorCode = @ColorCode,
        UpdatedAt = GETUTCDATE()
    WHERE TagId = @TagId;
END
GO

-- Delete Tag (Soft Delete)
CREATE OR ALTER PROCEDURE sp_DeleteTag
    @TagId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Tags
    SET IsActive = 0,
        UpdatedAt = GETUTCDATE()
    WHERE TagId = @TagId;
END
GO

-- =============================================
-- Article Management Procedures
-- =============================================

-- Get All Articles
CREATE OR ALTER PROCEDURE sp_GetAllArticles
    @UserId INT = NULL,
    @IsInternal BIT = NULL,
    @StatusId INT = NULL,
    @IsPublished BIT = NULL,
    @SearchTerm NVARCHAR(200) = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    ;WITH ArticleCTE AS (
        SELECT 
            a.ArticleId,
            a.Title,
            a.Summary,
            a.CreatedBy,
            u.FirstName + ' ' + u.LastName AS CreatedByName,
            a.UpdatedBy,
            uu.FirstName + ' ' + uu.LastName AS UpdatedByName,
            a.ApprovedBy,
            ua.FirstName + ' ' + ua.LastName AS ApprovedByName,
            a.StatusId,
            ast.StatusName,
            a.IsPublished,
            a.CreatedAt,
            a.UpdatedAt,
            a.PublishedAt,
            a.ApprovedAt,
            a.VersionNumber,
            a.ParentArticleId,
            a.IsInternal,
            a.ViewCount,
            COUNT(*) OVER() AS TotalCount
        FROM Articles a
        INNER JOIN Users u ON a.CreatedBy = u.UserId
        LEFT JOIN Users uu ON a.UpdatedBy = uu.UserId
        LEFT JOIN Users ua ON a.ApprovedBy = ua.UserId
        INNER JOIN ArticleStatuses ast ON a.StatusId = ast.StatusId
        WHERE (@IsInternal IS NULL OR a.IsInternal = @IsInternal)
            AND (@StatusId IS NULL OR a.StatusId = @StatusId)
            AND (@IsPublished IS NULL OR a.IsPublished = @IsPublished)
            AND (@SearchTerm IS NULL OR a.Title LIKE '%' + @SearchTerm + '%' OR a.Summary LIKE '%' + @SearchTerm + '%')
            AND (@UserId IS NULL OR a.CreatedBy = @UserId)
    )
    SELECT *
    FROM ArticleCTE
    ORDER BY CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- Get Article by ID
CREATE OR ALTER PROCEDURE sp_GetArticleById
    @ArticleId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.ArticleId,
        a.Title,
        a.Summary,
        a.Content,
        a.CreatedBy,
        u.FirstName + ' ' + u.LastName AS CreatedByName,
        u.Email AS CreatedByEmail,
        a.UpdatedBy,
        uu.FirstName + ' ' + uu.LastName AS UpdatedByName,
        a.ApprovedBy,
        ua.FirstName + ' ' + ua.LastName AS ApprovedByName,
        a.StatusId,
        ast.StatusName,
        a.IsPublished,
        a.CreatedAt,
        a.UpdatedAt,
        a.PublishedAt,
        a.ApprovedAt,
        a.VersionNumber,
        a.ParentArticleId,
        a.IsInternal,
        a.ViewCount
    FROM Articles a
    INNER JOIN Users u ON a.CreatedBy = u.UserId
    LEFT JOIN Users uu ON a.UpdatedBy = uu.UserId
    LEFT JOIN Users ua ON a.ApprovedBy = ua.UserId
    INNER JOIN ArticleStatuses ast ON a.StatusId = ast.StatusId
    WHERE a.ArticleId = @ArticleId;
    
    -- Also return article tags
    SELECT 
        t.TagId,
        t.TagTypeId,
        tt.TagTypeName,
        t.TagName,
        t.TagValue,
        t.ColorCode
    FROM ArticleTags at
    INNER JOIN Tags t ON at.TagId = t.TagId
    INNER JOIN TagTypes tt ON t.TagTypeId = tt.TagTypeId
    WHERE at.ArticleId = @ArticleId
    ORDER BY tt.TagTypeName, t.TagName;
END
GO

-- Create Article
CREATE OR ALTER PROCEDURE sp_CreateArticle
    @Title NVARCHAR(500),
    @Summary NVARCHAR(2000) = NULL,
    @Content NVARCHAR(MAX) = NULL,
    @CreatedBy INT,
    @StatusId INT = 1,
    @IsInternal BIT = 0,
    @TagIds NVARCHAR(MAX) = NULL -- Comma-separated tag IDs
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Insert article
        INSERT INTO Articles (Title, Summary, Content, CreatedBy, StatusId, IsInternal)
        VALUES (@Title, @Summary, @Content, @CreatedBy, @StatusId, @IsInternal);
        
        DECLARE @ArticleId INT = SCOPE_IDENTITY();
        
        -- Insert tags if provided
        IF @TagIds IS NOT NULL AND LEN(@TagIds) > 0
        BEGIN
            INSERT INTO ArticleTags (ArticleId, TagId)
            SELECT @ArticleId, CAST(value AS INT)
            FROM STRING_SPLIT(@TagIds, ',')
            WHERE RTRIM(value) <> '';
        END
        
        COMMIT TRANSACTION;
        
        -- Return the created article
        EXEC sp_GetArticleById @ArticleId;
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- Update Article
CREATE OR ALTER PROCEDURE sp_UpdateArticle
    @ArticleId INT,
    @Title NVARCHAR(500),
    @Summary NVARCHAR(2000) = NULL,
    @Content NVARCHAR(MAX) = NULL,
    @UpdatedBy INT,
    @StatusId INT = NULL,
    @IsInternal BIT = NULL,
    @TagIds NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Update article
        UPDATE Articles
        SET Title = @Title,
            Summary = @Summary,
            Content = @Content,
            UpdatedBy = @UpdatedBy,
            StatusId = ISNULL(@StatusId, StatusId),
            IsInternal = ISNULL(@IsInternal, IsInternal),
            UpdatedAt = GETUTCDATE()
        WHERE ArticleId = @ArticleId;
        
        -- Update tags if provided
        IF @TagIds IS NOT NULL
        BEGIN
            -- Remove existing tags
            DELETE FROM ArticleTags WHERE ArticleId = @ArticleId;
            
            -- Add new tags
            IF LEN(@TagIds) > 0
            BEGIN
                INSERT INTO ArticleTags (ArticleId, TagId)
                SELECT @ArticleId, CAST(value AS INT)
                FROM STRING_SPLIT(@TagIds, ',')
                WHERE RTRIM(value) <> '';
            END
        END
        
        COMMIT TRANSACTION;
        
        -- Return updated article
        EXEC sp_GetArticleById @ArticleId;
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- Delete Article (Soft Delete - Archive)
CREATE OR ALTER PROCEDURE sp_DeleteArticle
    @ArticleId INT,
    @UpdatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Articles
    SET StatusId = 5, -- Archived
        UpdatedBy = @UpdatedBy,
        UpdatedAt = GETUTCDATE()
    WHERE ArticleId = @ArticleId;
END
GO

-- Publish Article
CREATE OR ALTER PROCEDURE sp_PublishArticle
    @ArticleId INT,
    @ApprovedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Articles
    SET StatusId = 4, -- Published
        IsPublished = 1,
        ApprovedBy = @ApprovedBy,
        PublishedAt = GETUTCDATE(),
        ApprovedAt = GETUTCDATE(),
        UpdatedAt = GETUTCDATE()
    WHERE ArticleId = @ArticleId;
END
GO

-- Increment Article View Count
CREATE OR ALTER PROCEDURE sp_IncrementArticleViewCount
    @ArticleId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Articles
    SET ViewCount = ViewCount + 1
    WHERE ArticleId = @ArticleId;
END
GO

-- Search Articles by Tags
CREATE OR ALTER PROCEDURE sp_SearchArticlesByTags
    @TagIds NVARCHAR(MAX), -- Comma-separated tag IDs
    @IsPublished BIT = 1,
    @IsInternal BIT = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    ;WITH ArticleTagCounts AS (
        SELECT 
            at.ArticleId,
            COUNT(*) AS MatchingTags
        FROM ArticleTags at
        WHERE at.TagId IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@TagIds, ','))
        GROUP BY at.ArticleId
    ),
    ArticleCTE AS (
        SELECT DISTINCT
            a.ArticleId,
            a.Title,
            a.Summary,
            a.CreatedBy,
            u.FirstName + ' ' + u.LastName AS CreatedByName,
            a.StatusId,
            ast.StatusName,
            a.IsPublished,
            a.CreatedAt,
            a.UpdatedAt,
            a.PublishedAt,
            a.VersionNumber,
            a.IsInternal,
            a.ViewCount,
            atc.MatchingTags,
            COUNT(*) OVER() AS TotalCount
        FROM Articles a
        INNER JOIN ArticleTagCounts atc ON a.ArticleId = atc.ArticleId
        INNER JOIN Users u ON a.CreatedBy = u.UserId
        INNER JOIN ArticleStatuses ast ON a.StatusId = ast.StatusId
        WHERE (@IsPublished IS NULL OR a.IsPublished = @IsPublished)
            AND (@IsInternal IS NULL OR a.IsInternal = @IsInternal)
    )
    SELECT *
    FROM ArticleCTE
    ORDER BY MatchingTags DESC, ViewCount DESC, CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- Get Article Statuses
CREATE OR ALTER PROCEDURE sp_GetAllArticleStatuses
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        StatusId,
        StatusName,
        Description,
        IsActive
    FROM ArticleStatuses
    WHERE IsActive = 1
    ORDER BY StatusId;
END
GO

PRINT 'Phase 2 Stored Procedures Created Successfully';
PRINT 'Tag Procedures: 6';
PRINT 'Article Procedures: 10';
