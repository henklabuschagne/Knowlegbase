CREATE OR ALTER PROCEDURE sp_GetArticleTemplateById
    @TemplateId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get template details
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
    WHERE t.TemplateId = @TemplateId;
    
    -- Get template fields
    SELECT 
        FieldId,
        TemplateId,
        FieldName,
        FieldType,
        FieldLabel,
        Placeholder,
        DefaultValue,
        IsRequired,
        DisplayOrder,
        ValidationRules,
        DropdownOptions
    FROM TemplateFields
    WHERE TemplateId = @TemplateId
    ORDER BY DisplayOrder ASC;
    
    -- Get template tags
    SELECT 
        tt.TemplateTagId,
        tt.TagId,
        t.TagName,
        t.CategoryName,
        t.ColorCode
    FROM TemplateTags tt
    INNER JOIN Tags t ON tt.TagId = t.TagId
    WHERE tt.TemplateId = @TemplateId;
END
