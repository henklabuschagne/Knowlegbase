CREATE OR ALTER PROCEDURE sp_CreateArticleTemplate
    @TemplateName NVARCHAR(200),
    @Description NVARCHAR(500) = NULL,
    @Category NVARCHAR(100) = NULL,
    @TitleTemplate NVARCHAR(500) = NULL,
    @ContentTemplate NVARCHAR(MAX),
    @SummaryTemplate NVARCHAR(1000) = NULL,
    @IsInternal BIT = 0,
    @CreatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO ArticleTemplates (
        TemplateName,
        Description,
        Category,
        TitleTemplate,
        ContentTemplate,
        SummaryTemplate,
        IsInternal,
        IsActive,
        CreatedBy,
        CreatedAt,
        UpdatedAt
    )
    VALUES (
        @TemplateName,
        @Description,
        @Category,
        @TitleTemplate,
        @ContentTemplate,
        @SummaryTemplate,
        @IsInternal,
        1,
        @CreatedBy,
        GETUTCDATE(),
        GETUTCDATE()
    );
    
    SELECT SCOPE_IDENTITY() AS TemplateId;
END
