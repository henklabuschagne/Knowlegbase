CREATE OR ALTER PROCEDURE sp_DeleteArticleTemplate
    @TemplateId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Soft delete by marking as inactive
    UPDATE ArticleTemplates
    SET IsActive = 0,
        UpdatedAt = GETUTCDATE()
    WHERE TemplateId = @TemplateId;
    
    SELECT @@ROWCOUNT AS DeletedCount;
END
