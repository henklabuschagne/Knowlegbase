CREATE OR ALTER PROCEDURE sp_UpdateArticleTemplate
    @TemplateId INT,
    @TemplateName NVARCHAR(200),
    @Description NVARCHAR(500) = NULL,
    @Category NVARCHAR(100) = NULL,
    @TitleTemplate NVARCHAR(500) = NULL,
    @ContentTemplate NVARCHAR(MAX),
    @SummaryTemplate NVARCHAR(1000) = NULL,
    @IsInternal BIT = 0,
    @IsActive BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE ArticleTemplates
    SET TemplateName = @TemplateName,
        Description = @Description,
        Category = @Category,
        TitleTemplate = @TitleTemplate,
        ContentTemplate = @ContentTemplate,
        SummaryTemplate = @SummaryTemplate,
        IsInternal = @IsInternal,
        IsActive = @IsActive,
        UpdatedAt = GETUTCDATE()
    WHERE TemplateId = @TemplateId;
    
    SELECT @@ROWCOUNT AS UpdatedCount;
END
