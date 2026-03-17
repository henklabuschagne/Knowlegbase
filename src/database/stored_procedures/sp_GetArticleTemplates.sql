CREATE OR ALTER PROCEDURE sp_GetArticleTemplates
    @Category NVARCHAR(100) = NULL,
    @IsActive BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        t.TemplateId,
        t.TemplateName,
        t.Description,
        t.Category,
        t.TitleTemplate,
        t.ContentTemplate,
        t.SummaryTemplate,
        t.IsInternal,
        t.IsActive,
        t.UsageCount,
        t.CreatedBy,
        u.FirstName + ' ' + u.LastName AS CreatedByName,
        t.CreatedAt,
        t.UpdatedAt
    FROM ArticleTemplates t
    INNER JOIN Users u ON t.CreatedBy = u.UserId
    WHERE (@Category IS NULL OR t.Category = @Category)
        AND (@IsActive IS NULL OR t.IsActive = @IsActive)
    ORDER BY t.UsageCount DESC, t.TemplateName ASC;
END
