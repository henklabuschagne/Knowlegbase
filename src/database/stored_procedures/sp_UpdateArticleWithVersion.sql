CREATE OR ALTER PROCEDURE sp_UpdateArticleWithVersion
    @ArticleId INT,
    @Title NVARCHAR(500),
    @Summary NVARCHAR(2000) = NULL,
    @Content NVARCHAR(MAX) = NULL,
    @UpdatedBy INT,
    @StatusId INT = NULL,
    @IsInternal BIT = NULL,
    @TagIds NVARCHAR(MAX) = NULL,
    @ChangeDescription NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        DECLARE @VersionId INT;
        DECLARE @VersionNumber INT;
        DECLARE @CurrentTitle NVARCHAR(500);
        DECLARE @CurrentContent NVARCHAR(MAX);
        DECLARE @CurrentSummary NVARCHAR(1000);
        DECLARE @CurrentIsInternal BIT;
        
        -- Get current article data to create version snapshot
        SELECT 
            @CurrentTitle = Title,
            @CurrentContent = Content,
            @CurrentSummary = Summary,
            @CurrentIsInternal = IsInternal
        FROM Articles
        WHERE ArticleId = @ArticleId;
        
        -- Check if this is a content change (not just status change)
        IF @CurrentContent != @Content OR @CurrentTitle != @Title OR @CurrentSummary != ISNULL(@Summary, '') OR @CurrentIsInternal != ISNULL(@IsInternal, @CurrentIsInternal)
        BEGIN
            -- Create version snapshot of current state BEFORE updating
            SELECT @VersionNumber = ISNULL(MAX(VersionNumber), 0) + 1
            FROM ArticleVersions
            WHERE ArticleId = @ArticleId;
            
            INSERT INTO ArticleVersions (ArticleId, VersionNumber, Title, Content, Summary, IsInternal, CreatedBy, CreatedAt, ChangeDescription)
            VALUES (@ArticleId, @VersionNumber, @CurrentTitle, @CurrentContent, @CurrentSummary, @CurrentIsInternal, @UpdatedBy, GETUTCDATE(), ISNULL(@ChangeDescription, 'Article updated'));
            
            SET @VersionId = SCOPE_IDENTITY();
            
            -- Copy current tags to the version
            INSERT INTO ArticleVersionTags (VersionId, TagId)
            SELECT @VersionId, TagId
            FROM ArticleTags
            WHERE ArticleId = @ArticleId;
        END
        
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
