CREATE OR ALTER PROCEDURE sp_CreateArticleVersion
    @ArticleId INT,
    @Title NVARCHAR(500),
    @Content NVARCHAR(MAX),
    @Summary NVARCHAR(1000),
    @IsInternal BIT,
    @CreatedBy INT,
    @ChangeDescription NVARCHAR(1000),
    @TagIds NVARCHAR(MAX) -- Comma-separated tag IDs
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @VersionId INT;
    DECLARE @VersionNumber INT;
    
    -- Get the next version number
    SELECT @VersionNumber = ISNULL(MAX(VersionNumber), 0) + 1
    FROM ArticleVersions
    WHERE ArticleId = @ArticleId;
    
    -- Create the version
    INSERT INTO ArticleVersions (ArticleId, VersionNumber, Title, Content, Summary, IsInternal, CreatedBy, CreatedAt, ChangeDescription)
    VALUES (@ArticleId, @VersionNumber, @Title, @Content, @Summary, @IsInternal, @CreatedBy, GETUTCDATE(), @ChangeDescription);
    
    SET @VersionId = SCOPE_IDENTITY();
    
    -- Insert tags if provided
    IF @TagIds IS NOT NULL AND @TagIds != ''
    BEGIN
        INSERT INTO ArticleVersionTags (VersionId, TagId)
        SELECT @VersionId, CAST(value AS INT)
        FROM STRING_SPLIT(@TagIds, ',')
        WHERE RTRIM(value) != '';
    END
    
    SELECT @VersionId AS VersionId, @VersionNumber AS VersionNumber;
END
