CREATE OR ALTER PROCEDURE sp_RestoreArticleVersion
    @VersionId INT,
    @RestoredBy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ArticleId INT;
    DECLARE @Title NVARCHAR(500);
    DECLARE @Content NVARCHAR(MAX);
    DECLARE @Summary NVARCHAR(1000);
    DECLARE @IsInternal BIT;
    DECLARE @TagIds NVARCHAR(MAX);
    
    -- Get version data
    SELECT 
        @ArticleId = ArticleId,
        @Title = Title,
        @Content = Content,
        @Summary = Summary,
        @IsInternal = IsInternal
    FROM ArticleVersions
    WHERE VersionId = @VersionId;
    
    IF @ArticleId IS NULL
    BEGIN
        RAISERROR('Version not found', 16, 1);
        RETURN;
    END
    
    -- Get tag IDs
    SELECT @TagIds = STRING_AGG(CAST(TagId AS NVARCHAR(10)), ',')
    FROM ArticleVersionTags
    WHERE VersionId = @VersionId;
    
    -- Update the article
    UPDATE Articles
    SET Title = @Title,
        Content = @Content,
        Summary = @Summary,
        IsInternal = @IsInternal,
        UpdatedBy = @RestoredBy,
        UpdatedAt = GETUTCDATE()
    WHERE ArticleId = @ArticleId;
    
    -- Remove existing tags
    DELETE FROM ArticleTags WHERE ArticleId = @ArticleId;
    
    -- Add tags from version
    IF @TagIds IS NOT NULL AND @TagIds != ''
    BEGIN
        INSERT INTO ArticleTags (ArticleId, TagId)
        SELECT @ArticleId, CAST(value AS INT)
        FROM STRING_SPLIT(@TagIds, ',')
        WHERE RTRIM(value) != '';
    END
    
    -- Create a new version entry for this restoration
    DECLARE @NewVersionId INT;
    DECLARE @NewVersionNumber INT;
    
    SELECT @NewVersionNumber = ISNULL(MAX(VersionNumber), 0) + 1
    FROM ArticleVersions
    WHERE ArticleId = @ArticleId;
    
    INSERT INTO ArticleVersions (ArticleId, VersionNumber, Title, Content, Summary, IsInternal, CreatedBy, CreatedAt, ChangeDescription)
    VALUES (@ArticleId, @NewVersionNumber, @Title, @Content, @Summary, @IsInternal, @RestoredBy, GETUTCDATE(), 'Restored from version ' + CAST((SELECT VersionNumber FROM ArticleVersions WHERE VersionId = @VersionId) AS NVARCHAR(10)));
    
    SET @NewVersionId = SCOPE_IDENTITY();
    
    -- Copy tags to new version
    IF @TagIds IS NOT NULL AND @TagIds != ''
    BEGIN
        INSERT INTO ArticleVersionTags (VersionId, TagId)
        SELECT @NewVersionId, CAST(value AS INT)
        FROM STRING_SPLIT(@TagIds, ',')
        WHERE RTRIM(value) != '';
    END
    
    SELECT @NewVersionId AS VersionId, @NewVersionNumber AS VersionNumber;
END
